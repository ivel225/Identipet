from django.conf import settings
from django.db import connection
from django.db import transaction
from django.utils import timezone
from rest_framework import filters, mixins, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
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
    UserAccountSerializer,
    UserPublicSerializer,
    VaccinationRecordSerializer,
)


def endpoint(path, methods, description, auth=True):
    return {
        "path": path,
        "methods": methods,
        "auth": "Bearer JWT" if auth else "Public",
        "description": description,
    }


def api_endpoints():
    return [
        endpoint("/api/health/", ["GET"], "Backend and database health.", False),
        endpoint("/api/auth/token/", ["POST"], "Create an access token.", False),
        endpoint("/api/me/", ["GET"], "Current authenticated user."),
        endpoint("/api/users/", ["GET", "POST"], "System user accounts."),
        endpoint("/api/users/{user_id}/", ["GET", "PUT", "PATCH", "DELETE"], "Single system user account."),
        endpoint("/api/owners/", ["GET", "POST"], "Owner records."),
        endpoint("/api/owners/{owner_id}/", ["GET", "PUT", "PATCH", "DELETE"], "Single owner record."),
        endpoint("/api/pets/", ["GET", "POST"], "Pet records."),
        endpoint("/api/pets/{pet_id}/", ["GET", "PUT", "PATCH", "DELETE"], "Single pet record."),
        endpoint("/api/nfc-tags/", ["GET", "POST"], "NFC tag assignments."),
        endpoint("/api/vaccination-records/", ["GET", "POST"], "Vaccination records."),
        endpoint("/api/scan-history/", ["GET"], "Field scan history."),
        endpoint("/api/nfc-tags/{unique_code}/pet-profile/", ["GET"], "Pet profile lookup by NFC code."),
        endpoint("/api/scans/", ["POST"], "Log a scan by tag id or NFC unique code."),
        endpoint("/api/offline-sync/", ["POST"], "Bulk offline sync payload."),
    ]


class ServiceHomeView(APIView):
    authentication_classes = []
    permission_classes = []
    renderer_classes = [JSONRenderer, TemplateHTMLRenderer]

    def get(self, request):
        data = {
            "service": "IDentiPet API",
            "status": "online",
            "environment": "development" if settings.DEBUG else "production",
            "links": {
                "api": request.build_absolute_uri("/api/"),
                "health": request.build_absolute_uri("/api/health/"),
                "docs": request.build_absolute_uri("/api/docs/"),
                "token": request.build_absolute_uri("/api/auth/token/"),
            },
        }
        return Response(
            {
                **data,
                "cards": [
                    {"label": "Status", "value": data["status"]},
                    {"label": "Environment", "value": data["environment"]},
                    {"label": "Auth", "value": "Bearer JWT"},
                ],
            },
            template_name="api/service_home.html",
        )


class HealthCheckView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()

        return Response(
            {
                "status": "ok",
                "service": "identipet-backend",
                "database": "ok",
                "time": timezone.now().isoformat(),
            }
        )


class ApiDocsView(APIView):
    authentication_classes = []
    permission_classes = []
    renderer_classes = [JSONRenderer, TemplateHTMLRenderer]

    def get(self, request):
        data = {
            "service": "IDentiPet API",
            "auth": {
                "type": "Bearer JWT",
                "token_url": request.build_absolute_uri("/api/auth/token/"),
                "header": "Authorization: Bearer <access_token>",
            },
            "endpoints": api_endpoints(),
        }
        return Response(
            data,
            template_name="api/api_docs.html",
        )


class ApiIndexView(APIView):
    authentication_classes = []
    permission_classes = []
    renderer_classes = [JSONRenderer, TemplateHTMLRenderer]

    def get(self, request):
        resources = [
            {"name": "Owners", "path": request.build_absolute_uri("/api/owners/")},
            {"name": "Pets", "path": request.build_absolute_uri("/api/pets/")},
            {"name": "NFC Tags", "path": request.build_absolute_uri("/api/nfc-tags/")},
            {"name": "Vaccinations", "path": request.build_absolute_uri("/api/vaccination-records/")},
            {"name": "Scan History", "path": request.build_absolute_uri("/api/scan-history/")},
            {"name": "Docs", "path": request.build_absolute_uri("/api/docs/")},
            {"name": "Health", "path": request.build_absolute_uri("/api/health/")},
        ]
        return Response(
            {
                "service": "IDentiPet API",
                "resources": resources,
                "auth": "Authorization: Bearer <access_token>",
            },
            template_name="api/api_index.html",
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
                "token_type": "Bearer",
                "expires_in_minutes": settings.IDENTIPET_JWT_EXPIRY_MINUTES,
                "user": UserPublicSerializer(user).data,
            }
        )


class CurrentUserView(APIView):
    def get(self, request):
        return Response({"user": UserPublicSerializer(request.user).data})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("user_id")
    serializer_class = UserAccountSerializer
    permission_classes = [IsAdministrator]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "email", "role"]
    ordering_fields = ["user_id", "name", "email", "role"]


class OwnerViewSet(viewsets.ModelViewSet):
    queryset = Owner.objects.all().order_by("owner_id")
    serializer_class = OwnerSerializer
    permission_classes = [IsAdministratorOrVeterinaryStaff]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["full_name", "address", "contact_number"]
    ordering_fields = ["owner_id", "full_name"]


class PetViewSet(viewsets.ModelViewSet):
    queryset = Pet.objects.select_related("owner").all().order_by("pet_id")
    serializer_class = PetSerializer
    permission_classes = [IsAdministratorOrVeterinaryStaff]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "species", "breed", "color", "owner__full_name"]
    ordering_fields = ["pet_id", "name", "species", "age", "birth_date"]


class NfcTagViewSet(viewsets.ModelViewSet):
    queryset = NfcTag.objects.select_related("pet").all().order_by("tag_id")
    serializer_class = NfcTagSerializer
    permission_classes = [IsAdministratorOrVeterinaryStaff]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["unique_code", "status", "pet__name"]
    ordering_fields = ["tag_id", "unique_code", "status", "issue_at"]


class VaccinationRecordViewSet(viewsets.ModelViewSet):
    queryset = VaccinationRecord.objects.select_related("pet", "user").all()
    serializer_class = VaccinationRecordSerializer
    permission_classes = [IsAdministratorOrVeterinaryStaff]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["vaccine_name", "pet__name", "user__name"]
    ordering_fields = ["record_id", "date_administered", "next_due_date"]


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
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["tag__unique_code", "tag__pet__name", "user__name"]
    ordering_fields = ["scan_id", "scan_datetime"]


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
