from django.conf import settings
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Validate deployment-critical backend settings."

    def handle(self, *args, **options):
        failures = []

        if settings.DEBUG:
            failures.append("DJANGO_DEBUG must be false.")
        if not settings.SECRET_KEY or settings.SECRET_KEY == "identipet-dev-only-secret":
            failures.append("DJANGO_SECRET_KEY must be set to a production secret.")
        if not settings.ALLOWED_HOSTS:
            failures.append("DJANGO_ALLOWED_HOSTS must include the deployed API hostname.")
        if not settings.CORS_ALLOWED_ORIGINS:
            failures.append("DJANGO_CORS_ALLOWED_ORIGINS must include the deployed frontend origin.")
        if len(settings.IDENTIPET_JWT_SECRET) < 32:
            failures.append("IDENTIPET_JWT_SECRET must be at least 32 characters.")
        if settings.DATABASES["default"]["ENGINE"].endswith("sqlite3"):
            failures.append("Production must use PostgreSQL, not SQLite.")
        if not settings.SECURE_SSL_REDIRECT:
            failures.append("DJANGO_SECURE_SSL_REDIRECT should be true in production.")
        if settings.SECURE_HSTS_SECONDS < 300:
            failures.append("DJANGO_SECURE_HSTS_SECONDS should be enabled in production.")

        if failures:
            raise CommandError("\n".join(f"- {failure}" for failure in failures))

        self.stdout.write(self.style.SUCCESS("Deployment settings look ready."))
