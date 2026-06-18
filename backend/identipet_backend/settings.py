import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent


def load_env_file(path):
    if not path.exists():
        return

    for line in path.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or "=" not in stripped:
            continue
        key, value = stripped.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


load_env_file(BASE_DIR / ".env.local")
load_env_file(BASE_DIR / ".env")
load_env_file(BASE_DIR.parent / ".env.local")
load_env_file(BASE_DIR.parent / ".env")

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "identipet-dev-only-secret")
DEBUG = os.getenv("DJANGO_DEBUG", "true").lower() == "true"
ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
    if host.strip()
]

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.auth",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "api",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "identipet_backend.urls"
WSGI_APPLICATION = "identipet_backend.wsgi.application"
ASGI_APPLICATION = "identipet_backend.asgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
            ],
        },
    }
]

DATABASE_URL = os.getenv("DATABASE_URL")
USE_DATABASE_URL = os.getenv("USE_DATABASE_URL", "false").lower() == "true"
USE_POSTGRES = os.getenv("USE_POSTGRES", "false").lower() == "true"
if USE_DATABASE_URL and DATABASE_URL:
    try:
        import dj_database_url
    except ModuleNotFoundError as exc:
        raise RuntimeError(
            "dj-database-url is required only when USE_DATABASE_URL=true. "
            "Install backend requirements or set USE_DATABASE_URL=false for local SQLite."
        ) from exc

    DATABASES = {
        "default": dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
            ssl_require=os.getenv("DATABASE_SSL_REQUIRE", "true").lower() == "true",
        )
    }
elif USE_POSTGRES:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("POSTGRES_DB", "identipet"),
            "USER": os.getenv("POSTGRES_USER", "identipet"),
            "PASSWORD": os.getenv("POSTGRES_PASSWORD", "identipet_dev_password"),
            "HOST": os.getenv("POSTGRES_HOST", "localhost"),
            "PORT": os.getenv("POSTGRES_PORT", "5432"),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "api.authentication.IdentipetJWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
}

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("DJANGO_CORS_ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
]

IDENTIPET_JWT_SECRET = os.getenv("IDENTIPET_JWT_SECRET", SECRET_KEY)
IDENTIPET_JWT_ISSUER = os.getenv("IDENTIPET_JWT_ISSUER", "identipet-api")
IDENTIPET_JWT_EXPIRY_MINUTES = int(os.getenv("IDENTIPET_JWT_EXPIRY_MINUTES", "120"))

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    }
}
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
