from django.contrib import admin
from django.test import SimpleTestCase
from django.urls import reverse

from api.models import NfcTag, Owner, Pet, ScanHistory, User, VaccinationRecord


class AdminConsoleTests(SimpleTestCase):
    def test_admin_login_route_is_available(self):
        response = self.client.get(reverse("admin:login"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "IDentiPet Backend")

    def test_identipet_models_are_registered_in_admin(self):
        registered_models = {
            User,
            Owner,
            Pet,
            NfcTag,
            VaccinationRecord,
            ScanHistory,
        }

        for model in registered_models:
            with self.subTest(model=model.__name__):
                self.assertTrue(admin.site.is_registered(model))
