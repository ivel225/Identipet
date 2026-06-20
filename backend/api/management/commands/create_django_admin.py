import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "create_django_admin: create or update the Django Admin backend login."

    def add_arguments(self, parser):
        parser.add_argument(
            "--username",
            default=os.getenv("DJANGO_ADMIN_USERNAME"),
            help="Django Admin username.",
        )
        parser.add_argument(
            "--email",
            default=os.getenv("DJANGO_ADMIN_EMAIL", ""),
            help="Django Admin email address.",
        )
        parser.add_argument(
            "--password",
            default=os.getenv("DJANGO_ADMIN_PASSWORD"),
            help="Django Admin password. Can also be set with DJANGO_ADMIN_PASSWORD.",
        )
        parser.add_argument(
            "--no-update",
            action="store_true",
            help="Fail if the account already exists instead of updating it.",
        )

    def handle(self, *args, **options):
        username = options["username"]
        email = options["email"]
        password = options["password"]

        if not username:
            raise CommandError("Provide --username or DJANGO_ADMIN_USERNAME.")
        if not password:
            raise CommandError("Provide --password or DJANGO_ADMIN_PASSWORD.")

        django_user_model = get_user_model()
        admin_user, created = django_user_model.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "is_staff": True,
                "is_superuser": True,
                "is_active": True,
            },
        )

        if not created and options["no_update"]:
            raise CommandError(f"Django Admin account already exists: {username}")

        admin_user.email = email
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.is_active = True
        admin_user.set_password(password)
        admin_user.save()

        action = "Created" if created else "Updated"
        self.stdout.write(
            self.style.SUCCESS(f"{action} Django Admin account for {username}.")
        )
