from rest_framework.permissions import BasePermission , SAFE_METHODS


class IsAdminManagerOrReadOwnData(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role in ['Admin', 'Manager']:
            return True
        if request.user.role == 'Employee' and request.method in SAFE_METHODS:
            return obj.user == request.user
        return False


class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['Admin', 'Manager']
