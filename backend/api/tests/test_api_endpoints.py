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

    def test_service_home_points_to_backend_resources(self):
        response = self.client.get(reverse("service-home"))

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual("IDentiPet API", response.data["service"])
        self.assertIn("health", response.data["links"])
        self.assertIn("docs", response.data["links"])

    def test_service_home_renders_browser_ui(self):
        response = self.client.get(reverse("service-home"), HTTP_ACCEPT="text/html")

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertContains(response, "IDentiPet API")
        self.assertContains(response, "Open API")

    def test_api_index_renders_browser_ui(self):
        response = self.client.get(reverse("api-index"), HTTP_ACCEPT="text/html")

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertContains(response, "Resources")
        self.assertContains(response, "Owners")

    def test_health_check_is_public(self):
        response = self.client.get(reverse("health-check"))

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual("ok", response.data["status"])
        self.assertEqual("ok", response.data["database"])

    def test_api_docs_are_public_and_list_core_endpoints(self):
        response = self.client.get(reverse("api-docs"))

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        paths = {item["path"] for item in response.data["endpoints"]}
        self.assertIn("/api/auth/token/", paths)
        self.assertIn("/api/users/", paths)
        self.assertIn("/api/offline-sync/", paths)

    def test_api_docs_render_browser_ui(self):
        response = self.client.get(reverse("api-docs"), HTTP_ACCEPT="text/html")

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertContains(response, "Authentication")
        self.assertContains(response, "/api/offline-sync/")

    def test_token_endpoint_returns_jwt_for_valid_credentials(self):
        response = self.client.post(
            reverse("token-obtain"),
            {"email": "admin@example.test", "password": "secret"},
            format="json",
        )

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIn("access", response.data)
        self.assertEqual("Bearer", response.data["token_type"])
        self.assertEqual("Administrator", response.data["user"]["role"])

    def test_current_user_endpoint_returns_authenticated_profile(self):
        self.authenticate(self.admin)

        response = self.client.get(reverse("current-user"))

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual("admin@example.test", response.data["user"]["email"])

    def test_admin_can_create_user_account(self):
        self.authenticate(self.admin)

        response = self.client.post(
            reverse("user-list"),
            {
                "name": "Vet Staff",
                "role": User.Roles.VETERINARY_STAFF,
                "email": "vet@example.test",
                "password": "StrongPass123",
            },
            format="json",
        )

        self.assertEqual(status.HTTP_201_CREATED, response.status_code)
        self.assertEqual("Vet Staff", response.data["name"])
        self.assertNotIn("password", response.data)
        self.assertTrue(User.objects.get(email="vet@example.test").check_password("StrongPass123"))

    def test_non_admin_cannot_create_user_account(self):
        self.authenticate(self.field)

        response = self.client.post(
            reverse("user-list"),
            {
                "name": "Blocked User",
                "role": User.Roles.FIELD_PERSONNEL,
                "email": "blocked@example.test",
                "password": "StrongPass123",
            },
            format="json",
        )

        self.assertEqual(status.HTTP_403_FORBIDDEN, response.status_code)

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

    def test_owner_list_supports_search(self):
        self.authenticate(self.admin)

        response = self.client.get(reverse("owner-list"), {"search": "Alex"})

        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertEqual(1, len(response.data))
        self.assertEqual("Alex Pet Owner", response.data[0]["full_name"])

    def test_validation_errors_have_consistent_envelope(self):
        self.authenticate(self.admin)

        response = self.client.post(reverse("owner-list"), {}, format="json")

        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertEqual("Validation failed.", response.data["detail"])
        self.assertEqual("validation_error", response.data["error"]["code"])
        self.assertIn("full_name", response.data["error"]["fields"])

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
