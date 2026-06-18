"""Domain helpers for NFC scan workflows."""

from django.utils import timezone

from api.models import NfcTag, ScanHistory


def log_scan_by_unique_code(unique_code, user, scan_datetime=None):
    tag = NfcTag.objects.get(unique_code=unique_code)
    return ScanHistory.objects.create(
        tag=tag,
        user=user,
        scan_datetime=scan_datetime or timezone.now(),
    )
