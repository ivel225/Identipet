import unittest
from pathlib import Path


BACKEND_ROOT = Path(__file__).resolve().parents[1]


class SqliteLocalContractTests(unittest.TestCase):
    def test_settings_default_to_sqlite_unless_postgres_is_enabled(self):
        settings = (BACKEND_ROOT / "identipet_backend" / "settings.py").read_text(
            encoding="utf-8"
        )

        self.assertIn('"django.contrib.auth"', settings)
        self.assertIn('USE_POSTGRES = os.getenv("USE_POSTGRES", "false")', settings)
        self.assertIn('"ENGINE": "django.db.backends.sqlite3"', settings)
        self.assertIn('BASE_DIR / "db.sqlite3"', settings)

    def test_models_are_managed_for_local_sqlite(self):
        models = (BACKEND_ROOT / "api" / "models.py").read_text(encoding="utf-8")

        self.assertIn("MANAGE_SCHEMA_WITH_DJANGO", models)
        self.assertIn("managed = MANAGE_SCHEMA_WITH_DJANGO", models)

    def test_start_backend_prepares_sqlite_database(self):
        script = (BACKEND_ROOT.parent / "scripts" / "start-backend.ps1").read_text(
            encoding="utf-8"
        )

        self.assertIn('$env:USE_POSTGRES = "false"', script)
        self.assertIn("python manage.py migrate --run-syncdb", script)


if __name__ == "__main__":
    unittest.main()
