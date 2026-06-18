"""Django application entry point reference for the layered backend structure."""

from identipet_backend.asgi import application as asgi_application
from identipet_backend.wsgi import application as wsgi_application


__all__ = ["asgi_application", "wsgi_application"]
