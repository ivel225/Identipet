from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from api.authentication import create_access_token
from api.models import NfcTag, Owner, Pet, ScanHistory, User, VaccinationRecord


class ApiEndpointTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create(
            name="Admin",
            role=User.Roles.ADMINISTRATOR,
            email="admin@example.test",
            password="unused",
        )
        self.admin.set_password("secret")
        self.admin.save(update_fields=["password"])

        self.field = User.objects.create(
            name="Field",
            role=User.Roles.FIELD_PERSONNEL,
            email="field@example.test",
            password="unused",
        )
        self.owner = Owner.objects.create(
            full_name="Alex Pet Owner",
            address="123 Vet Street",
            contact_number="+100000000",
            latitude=14.5995,
            longitude=120.9842,
        )
        self.pet = Pet.objects.create(
            owner=self.owner,
            name="Mochi",
            species="Dog",
            breed="Aspen",
            gender="Female",
            color="Brown",
            age=3,
        )
        self.tag = NfcTag.objects.create(
            pet=self.pet,
            unique_code="04AABBCCDDEE",
            status=NfcTag.Statuses.ACTIVE,
            issue_at=timezone.now(),
        )
        VaccinationRecord.objects.create(
            pet=self.pet,
            user=self.admin,
            vaccine_name="Rabies",
            date_administered="2026-01-15",
            next_due_date="2027-01-15",
        )
        self.client = APIClient()

    def authenticate(self, user):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {create_access_token(user)}")

    def test_token_endpoint_returns_jwt_for_valid_credentials(self):
        response = self.client.post(
            reverse("token-obtain"),
            {"email": "admin@example.test", "password": "secret"},
            format="json",
        )

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIn("access", response.data)
        self.assertEqual("Administrator", response.data["user"]["role"])

    def test_admin_can_create_owner(self):
        self.authenticate(self.admin)

        response = self.client.post(
            reverse("owner-list"),
            {
                "full_name": "Jamie Owner",
                "address": "456 Clinic Road",
                "contact_number": "+12223334444",
                "latitude": 10.3157,
                "longitude": 123.8854,
            },
            format="json",
        )

        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual("Jamie Owner", response.data["full_name"])

    def test_field_personnel_can_query_pet_profile_by_nfc_code(self):
        self.authenticate(self.field)

        response = self.client.get(
            reverse("pet-profile-by-nfc", kwargs={"unique_code": self.tag.unique_code})
        )

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual("Mochi", response.data["name"])
        self.assertEqual("Alex Pet Owner", response.data["owner"]["full_name"])
        self.assertEqual("Rabies", response.data["vaccination_records"][0]["vaccine_name"])

    def test_field_personnel_can_log_scan_by_unique_code(self):
        self.authenticate(self.field)

        response = self.client.post(
            reverse("scan-history-log"),
            {"unique_code": self.tag.unique_code},
            format="json",
        )

        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(1, ScanHistory.objects.count())

    def test_offline_sync_accepts_bulk_scan_history(self):
        self.authenticate(self.field)

        response = self.client.post(
            reverse("offline-sync"),
            {
                "scan_history": [
                    {
                        "tag_id": self.tag.tag_id,
                        "scan_datetime": timezone.now().isoformat(),
                    }
                ]
            },
            format="json",
        )

        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual(1, len(response.data["synced"]["scan_history"]))
