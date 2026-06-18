from django.contrib import admin

from api.models import NfcTag, Owner, Pet, ScanHistory, User, VaccinationRecord


admin.site.register(User)
admin.site.register(Owner)
admin.site.register(Pet)
admin.site.register(NfcTag)
admin.site.register(VaccinationRecord)
admin.site.register(ScanHistory)
