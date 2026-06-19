from django.urls import include, path

from api.views import ServiceHomeView


urlpatterns = [
    path("", ServiceHomeView.as_view(), name="service-home"),
    path("api/", include("api.urls")),
]
