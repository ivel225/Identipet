from rest_framework.permissions import BasePermission


ADMINISTRATOR = "Administrator"
VETERINARY_STAFF = "Veterinary Staff"
FIELD_PERSONNEL = "Field Personnel"


class HasRole(BasePermission):
    allowed_roles = ()

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in self.allowed_roles
        )


class IsAdministrator(HasRole):
    allowed_roles = (ADMINISTRATOR,)


class IsAdministratorOrVeterinaryStaff(HasRole):
    allowed_roles = (ADMINISTRATOR, VETERINARY_STAFF)


class IsFieldPersonnelOrHigher(HasRole):
    allowed_roles = (ADMINISTRATOR, VETERINARY_STAFF, FIELD_PERSONNEL)
