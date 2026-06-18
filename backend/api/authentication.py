from datetime import datetime, timedelta, timezone

import jwt
from django.conf import settings
from rest_framework import authentication, exceptions

from api.models import User


def create_access_token(user):
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user.user_id),
        "email": user.email,
        "role": user.role,
        "iss": settings.IDENTIPET_JWT_ISSUER,
        "iat": now,
        "exp": now + timedelta(minutes=settings.IDENTIPET_JWT_EXPIRY_MINUTES),
    }
    return jwt.encode(payload, settings.IDENTIPET_JWT_SECRET, algorithm="HS256")


class IdentipetJWTAuthentication(authentication.BaseAuthentication):
    keyword = "Bearer"

    def authenticate(self, request):
        auth_header = authentication.get_authorization_header(request).decode("utf-8")
        if not auth_header:
            return None

        parts = auth_header.split()
        if len(parts) != 2 or parts[0] != self.keyword:
            raise exceptions.AuthenticationFailed("Invalid authorization header.")

        try:
            payload = jwt.decode(
                parts[1],
                settings.IDENTIPET_JWT_SECRET,
                algorithms=["HS256"],
                issuer=settings.IDENTIPET_JWT_ISSUER,
            )
        except jwt.ExpiredSignatureError as exc:
            raise exceptions.AuthenticationFailed("Token has expired.") from exc
        except jwt.InvalidTokenError as exc:
            raise exceptions.AuthenticationFailed("Invalid token.") from exc

        try:
            user = User.objects.get(user_id=payload["sub"])
        except (KeyError, User.DoesNotExist) as exc:
            raise exceptions.AuthenticationFailed("Token user was not found.") from exc

        return user, payload
