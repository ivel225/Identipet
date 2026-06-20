from django.contrib import admin
from django import forms

from api.models import NfcTag, Owner, Pet, ScanHistory, User, VaccinationRecord


admin.site.site_header = "IDentiPet Backend"
admin.site.site_title = "IDentiPet Admin"
admin.site.index_title = "Database Management"


class UserAccountAdminForm(forms.ModelForm):
    password = forms.CharField(
        required=False,
        widget=forms.PasswordInput(render_value=False),
        help_text="Enter a new password to set or change it. Leave blank when editing to keep the current password.",
    )

    class Meta:
        model = User
        fields = "__all__"

    def clean_password(self):
        password = self.cleaned_data.get("password")
        if not self.instance.pk and not password:
            raise forms.ValidationError("Password is required for a new user account.")
        return password

    def save(self, commit=True):
        raw_password = self.cleaned_data.get("password")
        user = super().save(commit=False)

        if raw_password:
            user.set_password(raw_password)
        elif self.instance.pk:
            user.password = User.objects.only("password").get(pk=self.instance.pk).password

        if commit:
            user.save()
            self.save_m2m()
        return user


@admin.register(User)
class UserAccountAdmin(admin.ModelAdmin):
    form = UserAccountAdminForm
    list_display = ("email", "name", "role")
    list_filter = ("role",)
    search_fields = ("email", "name")
    ordering = ("email",)


@admin.register(Owner)
class OwnerAdmin(admin.ModelAdmin):
    list_display = ("full_name", "contact_number", "address", "latitude", "longitude")
    search_fields = ("full_name", "contact_number", "address")
    ordering = ("full_name",)


@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = ("name", "species", "breed", "gender", "owner")
    list_filter = ("species", "gender")
    search_fields = ("name", "species", "breed", "owner__full_name")
    autocomplete_fields = ("owner",)
    ordering = ("name",)


@admin.register(NfcTag)
class NfcTagAdmin(admin.ModelAdmin):
    list_display = ("unique_code", "pet", "status", "issue_at")
    list_filter = ("status", "issue_at")
    search_fields = ("unique_code", "pet__name", "pet__owner__full_name")
    autocomplete_fields = ("pet",)
    ordering = ("-issue_at",)


@admin.register(VaccinationRecord)
class VaccinationRecordAdmin(admin.ModelAdmin):
    list_display = ("vaccine_name", "pet", "user", "date_administered", "next_due_date")
    list_filter = ("date_administered", "next_due_date", "vaccine_name")
    search_fields = ("vaccine_name", "pet__name", "user__name", "user__email")
    autocomplete_fields = ("pet", "user")
    date_hierarchy = "date_administered"
    ordering = ("-date_administered",)


@admin.register(ScanHistory)
class ScanHistoryAdmin(admin.ModelAdmin):
    list_display = ("tag", "user", "scan_datetime")
    list_filter = ("scan_datetime",)
    search_fields = ("tag__unique_code", "tag__pet__name", "user__name", "user__email")
    autocomplete_fields = ("tag", "user")
    date_hierarchy = "scan_datetime"
    ordering = ("-scan_datetime",)
