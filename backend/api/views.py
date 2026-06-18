from django.db import transaction
from django.utils import timezone
from rest_framework import mixins, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from api.authentication import create_access_token
from api.models import NfcTag, Owner, Pet, ScanHistory, User, VaccinationRecord
from api.permissions import (
    IsAdministrator,
    IsAdministratorOrVeterinaryStaff,
    IsFieldPersonnelOrHigher,
)
from api.serializers import (
    LoginSerializer,
    NfcTagSerializer,
    OfflineSyncSerializer,
    OwnerSerializer,
    PetProfileSerializer,
    PetSerializer,
    ScanHistorySerializer,
    UserPublicSerializer,
    VaccinationRecordSerializer,
)


class TokenObtainView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.filter(email=serializer.validated_data["email"]).first()
        if user is None or not user.check_password(serializer.validated_data["password"]):
            return Response(
                {"detail": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(
            {
                "access": create_access_token(user),
                "user": UserPublicSerializer(user).data,
            }
        )


class OwnerViewSet(viewsets.ModelViewSet):
    queryset = Owner.objects.all().order_by("owner_id")
    serializer_class = OwnerSerializer
    permission_classes = [IsAdministratorOrVeterinaryStaff]


class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.select_related("owner").all().order_by("pet_id")
    serializer_class = PetSerializer
    permission_classes = [IsAdministratorOrVeterinaryStaff]


class NfcTagViewSet(viewsets.ModelViewSet):
    queryset = NfcTag.objects.select_related("pet").all().order_by("tag_id")
    serializer_class = NfcTagSerializer
    permission_classes = [IsAdministratorOrVeterinaryStaff]


class VaccinationRecordViewSet(viewsets.ModelViewSet):
    queryset = VaccinationRecord.objects.select_related("pet", "user").all()
    serializer_class = VaccinationRecordSerializer
    permission_classes = [IsAdministratorOrVeterinaryStaff]


class PetProfileByNfcCodeView(APIView):
    permission_classes = [IsFieldPersonnelOrHigher]

    def get(self, request, unique_code):
        tag = (
            NfcTag.objects.select_related("pet__owner")
            .prefetch_related("pet__nfc_tags", "pet__vaccination_records")
            .filter(unique_code=unique_code, status=NfcTag.Statuses.ACTIVE)
            .first()
        )
        if tag is None:
            return Response(
                {"detail": "Active NFC tag was not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(PetProfileSerializer(tag.pet).data)


class ScanHistoryLogView(APIView):
    permission_classes = [IsFieldPersonnelOrHigher]

    def post(self, request):
        payload = request.data.copy()
        if "unique_code" in payload and "tag_id" not in payload:
            tag = NfcTag.objects.filter(unique_code=payload["unique_code"]).first()
            if tag is None:
                return Response(
                    {"detail": "NFC tag was not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
            payload["tag_id"] = tag.tag_id

        payload.setdefault("scan_datetime", timezone.now())
        serializer = ScanHistorySerializer(data=payload, context={"request": request})
        serializer.is_valid(raise_exception=True)
        scan = serializer.save()

        return Response(
            ScanHistorySerializer(scan, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class ScanHistoryViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    queryset = ScanHistory.objects.select_related("tag", "user").all().order_by(
        "-scan_datetime"
    )
    serializer_class = ScanHistorySerializer
    permission_classes = [IsAdministratorOrVeterinaryStaff]


class OfflineSyncView(APIView):
    permission_classes = [IsFieldPersonnelOrHigher]

    @transaction.atomic
    def post(self, request):
        serializer = OfflineSyncSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        synced = {}

        synced["owners"] = self._save_many(
            serializer.validated_data.get("owners", []),
            OwnerSerializer,
            request,
        )
        synced["pets"] = self._save_many(
            serializer.validated_data.get("pets", []),
            PetSerializer,
            request,
        )
        synced["nfc_tags"] = self._save_many(
            serializer.validated_data.get("nfc_tags", []),
            NfcTagSerializer,
            request,
        )
        synced["vaccination_records"] = self._save_many(
            serializer.validated_data.get("vaccination_records", []),
            VaccinationRecordSerializer,
            request,
        )
        synced["scan_history"] = self._save_many(
            serializer.validated_data.get("scan_history", []),
            ScanHistorySerializer,
            request,
        )

        return Response({"synced": synced}, status=status.HTTP_201_CREATED)

    def _save_many(self, items, serializer_class, request):
        saved = []
        for item in items:
            if serializer_class is ScanHistorySerializer and "unique_code" in item:
                tag = NfcTag.objects.filter(unique_code=item["unique_code"]).first()
                if tag is None:
                    raise ValidationError(
                        {"scan_history": f"NFC tag was not found: {item['unique_code']}"}
                    )
                item = {**item, "tag_id": tag.tag_id}
            serializer = serializer_class(data=item, context={"request": request})
            serializer.is_valid(raise_exception=True)
            saved.append(serializer.save())
        return serializer_class(saved, many=True, context={"request": request}).data
