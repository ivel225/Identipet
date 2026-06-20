from django.contrib import admin
from django.urls import include, path

from api.views import ServiceHomeView


urlpatterns = [
    path("", ServiceHomeView.as_view(), name="service-home"),
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
]
