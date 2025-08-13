# accounts/views.py
from django.contrib.auth import get_user_model
from rest_framework import permissions, status, views, viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import (
    UserSerializer,
    UserMeSerializer,
    MeUpdateSerializer,
    RegisterSerializer,
    AdminMemberSerializer,
)

User = get_user_model()

class MeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserMeSerializer(request.user).data)

    def patch(self, request):
        ser = MeUpdateSerializer(data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.update(request.user, ser.validated_data)
        return Response(UserMeSerializer(request.user).data)


class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        ser = RegisterSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = ser.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class AdminMemberViewSet(viewsets.ModelViewSet):
    """
    Admin endpoints:
      - GET   /api/v1/members/
      - GET   /api/v1/members/{id}/
      - PATCH /api/v1/members/{id}/           (update member fields incl. balance, if you allow)
      - POST  /api/v1/members/{id}/set_balance/     { "balance": "12345.67" }
      - POST  /api/v1/members/{id}/adjust_balance/  { "delta": "100.00", "reason": "optional note" }
    """
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = AdminMemberSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        qs = super().get_queryset()
        search = self.request.query_params.get("search")
        if search:
            qs = qs.filter(email__icontains=search) | qs.filter(first_name__icontains=search) \
                 | qs.filter(last_name__icontains=search) | qs.filter(nssf_number__icontains=search)
        return qs

    @action(detail=True, methods=["post"])
    def set_balance(self, request, pk=None):
        user = self.get_object()
        balance = request.data.get("balance")
        if balance is None:
            return Response({"detail": "balance is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            # cast to same type as model field
            user.balance = type(user.balance)(balance)
            user.save(update_fields=["balance"])
            return Response(AdminMemberSerializer(user).data)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["post"])
    def adjust_balance(self, request, pk=None):
        user = self.get_object()
        delta = request.data.get("delta")
        if delta is None:
            return Response({"detail": "delta is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user.balance = (user.balance or type(user.balance)(0)) + type(user.balance)(delta)
            user.save(update_fields=["balance"])
            # TODO: add an audit log entry here if you have an Audit model
            return Response(AdminMemberSerializer(user).data)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
