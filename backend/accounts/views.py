from rest_framework import permissions, status, views
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, MeUpdateSerializer, RegisterSerializer

User = get_user_model()

class MeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        ser = MeUpdateSerializer(data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.update(request.user, ser.validated_data)
        return Response(UserSerializer(request.user).data)

class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        ser = RegisterSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = ser.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
