from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from .serializers import RegisterSerializer, MeSerializer, PasswordChangeSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = MeSerializer
    def get_object(self): return self.request.user

@api_view(["POST"])
def change_password(request):
    ser = PasswordChangeSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    user = request.user
    if not user.check_password(ser.validated_data["old_password"]):
        return Response({"detail":"Old password incorrect"}, status=400)
    user.set_password(ser.validated_data["new_password"])
    user.save()
    return Response({"detail":"Password updated"})
