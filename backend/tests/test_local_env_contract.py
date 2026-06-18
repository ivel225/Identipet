import unittest
from pathlib import Path


BACKEND_ROOT = Path(__file__).resolve().parents[1]


class LocalEnvironmentContractTests(unittest.TestCase):
    def test_settings_loads_local_env_files_before_database_config(self):
        settings_path = BACKEND_ROOT / "identipet_backend" / "settings.py"
        settings = settings_path.read_text(encoding="utf-8")

        self.assertIn("def load_env_file", settings)
        self.assertIn('load_env_file(BASE_DIR / ".env.local")', settings)
        self.assertIn('load_env_file(BASE_DIR / ".env")', settings)
        self.assertLess(settings.index("load_env_file"), settings.index("DATABASE_URL"))

    def test_backend_has_local_env_file(self):
        env_path = BACKEND_ROOT / ".env.local"
        self.assertTrue(env_path.exists())

        env = env_path.read_text(encoding="utf-8")
        self.assertIn("POSTGRES_USER=identipet", env)
        self.assertIn("POSTGRES_PASSWORD=identipet_dev_password", env)
        self.assertIn("DATABASE_SSL_REQUIRE=false", env)


if __name__ == "__main__":
    unittest.main()
