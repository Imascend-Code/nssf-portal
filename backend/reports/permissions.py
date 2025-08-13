# reports/permissions.py
from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwnerOrAdmin(BasePermission):
    """Admins can do anything; regular users only their own reports."""
    def has_object_permission(self, request, view, obj):
        if request.user and request.user.is_staff:
            return True
        return obj.owner_id == getattr(request.user, "id", None)

    def has_permission(self, request, view):
        # For list/create: allow any authenticated; detail is checked above.
        return request.user and request.user.is_authenticated
