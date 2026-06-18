from django.contrib.auth.hashers import check_password, make_password
from django.db import models


class User(models.Model):
    class Roles(models.TextChoices):
        ADMINISTRATOR = "Administrator", "Administrator"
        VETERINARY_STAFF = "Veterinary Staff", "Veterinary Staff"
        FIELD_PERSONNEL = "Field Personnel", "Field Personnel"

    user_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=32, choices=Roles.choices)
    email = models.EmailField(unique=True)
    password = models.TextField()

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def __str__(self):
        return f"{self.name} ({self.role})"

    class Meta:
        managed = False
        db_table = "users"


class Owner(models.Model):
    owner_id = models.BigAutoField(primary_key=True)
    full_name = models.CharField(max_length=150)
    address = models.TextField()
    contact_number = models.CharField(max_length=40)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.full_name

    class Meta:
        managed = False
        db_table = "owners"


class Pet(models.Model):
    pet_id = models.BigAutoField(primary_key=True)
    owner = models.ForeignKey(
        Owner,
        db_column="owner_id",
        related_name="pets",
        on_delete=models.RESTRICT,
    )
    name = models.CharField(max_length=100)
    species = models.CharField(max_length=80)
    breed = models.CharField(max_length=100, blank=True, null=True)
    gender = models.CharField(max_length=30, blank=True, null=True)
    color = models.CharField(max_length=80, blank=True, null=True)
    age = models.IntegerField(blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        managed = False
        db_table = "pets"


class NfcTag(models.Model):
    class Statuses(models.TextChoices):
        ACTIVE = "Active", "Active"
        INACTIVE = "Inactive", "Inactive"
        LOST = "Lost", "Lost"
        RETIRED = "Retired", "Retired"

    tag_id = models.BigAutoField(primary_key=True)
    pet = models.ForeignKey(
        Pet,
        db_column="pet_id",
        related_name="nfc_tags",
        on_delete=models.RESTRICT,
    )
    unique_code = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=16, choices=Statuses.choices)
    issue_at = models.DateTimeField()

    def __str__(self):
        return self.unique_code

    class Meta:
        managed = False
        db_table = "nfc_tags"


class VaccinationRecord(models.Model):
    record_id = models.BigAutoField(primary_key=True)
    pet = models.ForeignKey(
        Pet,
        db_column="pet_id",
        related_name="vaccination_records",
        on_delete=models.CASCADE,
    )
    user = models.ForeignKey(
        User,
        db_column="user_id",
        related_name="vaccination_records",
        on_delete=models.RESTRICT,
    )
    vaccine_name = models.CharField(max_length=150)
    date_administered = models.DateField()
    next_due_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.vaccine_name} for {self.pet_id}"

    class Meta:
        managed = False
        db_table = "vaccination_records"


class ScanHistory(models.Model):
    scan_id = models.BigAutoField(primary_key=True)
    tag = models.ForeignKey(
        NfcTag,
        db_column="tag_id",
        related_name="scan_history",
        on_delete=models.RESTRICT,
    )
    user = models.ForeignKey(
        User,
        db_column="user_id",
        related_name="scan_history",
        on_delete=models.RESTRICT,
    )
    scan_datetime = models.DateTimeField()

    def __str__(self):
        return f"{self.tag_id} scanned by {self.user_id}"

    class Meta:
        managed = False
        db_table = "scan_history"
