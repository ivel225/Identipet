from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.views import (
    NfcTagViewSet,
    OfflineSyncView,
    OwnerViewSet,
    PetProfileByNfcCodeView,
    PetViewSet,
    ScanHistoryViewSet,
    ScanHistoryLogView,
    TokenObtainView,
    VaccinationRecordViewSet,
)


router = DefaultRouter()
router.register("owners", OwnerViewSet, basename="owner")
router.register("pets", PetViewSet, basename="pet")
router.register("nfc-tags", NfcTagViewSet, basename="nfc-tag")
router.register("scan-history", ScanHistoryViewSet, basename="scan-history")
router.register(
    "vaccination-records",
    VaccinationRecordViewSet,
    basename="vaccination-record",
)

urlpatterns = [
    path("auth/token/", TokenObtainView.as_view(), name="token-obtain"),
    path("", include(router.urls)),
    path(
        "nfc-tags/<str:unique_code>/pet-profile/",
        PetProfileByNfcCodeView.as_view(),
        name="pet-profile-by-nfc",
    ),
    path("scans/", ScanHistoryLogView.as_view(), name="scan-history-log"),
    path("offline-sync/", OfflineSyncView.as_view(), name="offline-sync"),
]
