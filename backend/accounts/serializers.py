from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ("id","email","password","full_name","phone")
    def create(self, validated):
        pwd = validated.pop("password")
        validate_password(pwd)
        user = User(**validated)
        user.set_password(pwd)
        user.save()
        return user

class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id","email","role","full_name","phone")
        read_only_fields=("email","role","id",)

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
