import unittest
from pathlib import Path


BACKEND_ROOT = Path(__file__).resolve().parents[1]


class BackendScaffoldContractTests(unittest.TestCase):
    def test_backend_contains_required_drf_modules(self):
        required_paths = [
            "manage.py",
            "requirements.txt",
            "identipet_backend/settings.py",
            "identipet_backend/urls.py",
            "api/models.py",
            "api/serializers.py",
            "api/permissions.py",
            "api/authentication.py",
            "api/views.py",
            "api/urls.py",
            "api/management/commands/create_superadmin.py",
            "api/tests/test_api_endpoints.py",
        ]

        missing = [path for path in required_paths if not (BACKEND_ROOT / path).exists()]

        self.assertEqual([], missing)

    def test_backend_implements_required_api_concepts(self):
        expected_markers = {
            "api/models.py": [
                "class User(",
                "class Owner(",
                "class Pet(",
                "class NfcTag(",
                "class VaccinationRecord(",
                "class ScanHistory(",
            ],
            "api/views.py": [
                "class OwnerViewSet(",
                "class PetViewSet(",
                "class VaccinationRecordViewSet(",
                "class PetProfileByNfcCodeView(",
                "class ScanHistoryLogView(",
                "class OfflineSyncView(",
            ],
            "api/permissions.py": [
                "class IsAdministrator(",
                "class IsAdministratorOrVeterinaryStaff(",
                "class IsFieldPersonnelOrHigher(",
            ],
            "api/authentication.py": [
                "class IdentipetJWTAuthentication(",
                "jwt.decode",
            ],
            "api/management/commands/create_superadmin.py": [
                "class Command(BaseCommand)",
                "create_superadmin",
                "set_password",
                "User.Roles.ADMINISTRATOR",
            ],
        }

        missing = {}
        for relative_path, markers in expected_markers.items():
            path = BACKEND_ROOT / relative_path
            content = path.read_text(encoding="utf-8") if path.exists() else ""
            file_missing = [marker for marker in markers if marker not in content]
            if file_missing:
                missing[relative_path] = file_missing

        self.assertEqual({}, missing)


if __name__ == "__main__":
    unittest.main()
