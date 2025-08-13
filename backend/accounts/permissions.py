from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        u = request.user
        return bool(u and u.is_authenticated and (u.is_staff or u.is_superuser))

class IsStaff(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role in ("STAFF","ADMIN")

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user
        owner = getattr(obj, "user", None) or getattr(obj, "requester", None) or getattr(obj, "pensioner", None)
        return user and owner and owner == user

