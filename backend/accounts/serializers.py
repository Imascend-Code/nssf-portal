# accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.validators import validate_email

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("id","email","password","full_name","phone")

    def validate_email(self, v):
        v = v.strip().lower()
        validate_email(v)
        if User.objects.filter(email=v).exists():
            raise serializers.ValidationError("Email already registered")
        return v

    def create(self, validated_data):  # <-- fixed name
        pwd = validated_data.pop("password")
        validate_password(pwd)
        user = User(**validated_data)
        user.email = user.email.lower()
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

    def validate_new_password(self, v):
        validate_password(v)
        return v
