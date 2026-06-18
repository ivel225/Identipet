import os

from django.core.management.base import BaseCommand, CommandError

from api.models import User


class Command(BaseCommand):
    help = "create_superadmin: create or update an IDentiPet Administrator account."

    def add_arguments(self, parser):
        parser.add_argument(
            "--email",
            default=os.getenv("IDENTIPET_SUPERADMIN_EMAIL"),
            help="Administrator email address.",
        )
        parser.add_argument(
            "--name",
            default=os.getenv("IDENTIPET_SUPERADMIN_NAME", "IDentiPet Superadmin"),
            help="Administrator display name.",
        )
        parser.add_argument(
            "--password",
            default=os.getenv("IDENTIPET_SUPERADMIN_PASSWORD"),
            help="Administrator password. Can also be set with IDENTIPET_SUPERADMIN_PASSWORD.",
        )
        parser.add_argument(
            "--no-update",
            action="store_true",
            help="Fail if the account already exists instead of updating it.",
        )

    def handle(self, *args, **options):
        email = options["email"]
        name = options["name"]
        password = options["password"]

        if not email:
            raise CommandError("Provide --email or IDENTIPET_SUPERADMIN_EMAIL.")
        if not password:
            raise CommandError("Provide --password or IDENTIPET_SUPERADMIN_PASSWORD.")

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "name": name,
                "role": User.Roles.ADMINISTRATOR,
                "password": "",
            },
        )

        if not created and options["no_update"]:
            raise CommandError(f"Administrator already exists: {email}")

        user.name = name
        user.role = User.Roles.ADMINISTRATOR
        user.set_password(password)
        user.save()

        action = "Created" if created else "Updated"
        self.stdout.write(
            self.style.SUCCESS(f"{action} Administrator account for {email}.")
        )
