from rest_framework import serializers

from api.models import NfcTag, Owner, Pet, ScanHistory, User, VaccinationRecord


class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["user_id", "name", "role", "email"]


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = [
            "owner_id",
            "full_name",
            "address",
            "contact_number",
            "latitude",
            "longitude",
        ]


class PetSerializer(serializers.ModelSerializer):
    owner_id = serializers.PrimaryKeyRelatedField(
        queryset=Owner.objects.all(),
        source="owner",
    )

    class Meta:
        model = Pet
        fields = [
            "pet_id",
            "owner_id",
            "name",
            "species",
            "breed",
            "gender",
            "color",
            "age",
            "birth_date",
        ]


class NfcTagSerializer(serializers.ModelSerializer):
    pet_id = serializers.PrimaryKeyRelatedField(
        queryset=Pet.objects.all(),
        source="pet",
    )

    class Meta:
        model = NfcTag
        fields = ["tag_id", "pet_id", "unique_code", "status", "issue_at"]
        read_only_fields = ["issue_at"]


class VaccinationRecordSerializer(serializers.ModelSerializer):
    pet_id = serializers.PrimaryKeyRelatedField(
        queryset=Pet.objects.all(),
        source="pet",
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="user",
        required=False,
    )

    class Meta:
        model = VaccinationRecord
        fields = [
            "record_id",
            "pet_id",
            "user_id",
            "vaccine_name",
            "date_administered",
            "next_due_date",
        ]

    def create(self, validated_data):
        validated_data.setdefault("user", self.context["request"].user)
        return super().create(validated_data)


class ScanHistorySerializer(serializers.ModelSerializer):
    tag_id = serializers.PrimaryKeyRelatedField(
        queryset=NfcTag.objects.all(),
        source="tag",
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="user",
        required=False,
    )

    class Meta:
        model = ScanHistory
        fields = ["scan_id", "tag_id", "user_id", "scan_datetime"]
        read_only_fields = ["scan_id"]

    def create(self, validated_data):
        validated_data.setdefault("user", self.context["request"].user)
        return super().create(validated_data)


class PetProfileSerializer(serializers.ModelSerializer):
    owner = OwnerSerializer(read_only=True)
    nfc_tags = NfcTagSerializer(many=True, read_only=True)
    vaccination_records = VaccinationRecordSerializer(many=True, read_only=True)

    class Meta:
        model = Pet
        fields = [
            "pet_id",
            "owner",
            "name",
            "species",
            "breed",
            "gender",
            "color",
            "age",
            "birth_date",
            "nfc_tags",
            "vaccination_records",
        ]


class OfflineSyncSerializer(serializers.Serializer):
    owners = serializers.ListField(child=serializers.DictField(), required=False)
    pets = serializers.ListField(child=serializers.DictField(), required=False)
    nfc_tags = serializers.ListField(child=serializers.DictField(), required=False)
    vaccination_records = serializers.ListField(
        child=serializers.DictField(),
        required=False,
    )
    scan_history = serializers.ListField(child=serializers.DictField(), required=False)
