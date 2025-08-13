from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for returning user profile details."""

    class Meta:
        model = User
        fields = ["id", "email", "role", "full_name", "phone", "date_joined", "is_active"]
        read_only_fields = ["id", "role", "is_active", "email"]


class MeUpdateSerializer(serializers.Serializer):
    """Serializer for updating the logged-in user's profile."""

    full_name = serializers.CharField(required=False, allow_blank=True, max_length=255)
    phone = serializers.CharField(required=False, allow_blank=True, max_length=50)
    password = serializers.CharField(required=False, write_only=True)

    def validate_password(self, value):
        if value:
            validate_password(value)
        return value

    def update(self, instance, validated_data):
        if "full_name" in validated_data:
            instance.full_name = validated_data["full_name"]
        if "phone" in validated_data:
            instance.phone = validated_data["phone"]
        if validated_data.get("password"):
            instance.set_password(validated_data["password"])
        instance.save()
        return instance


class RegisterSerializer(serializers.Serializer):
    """Serializer for registering a new user."""

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    full_name = serializers.CharField(required=False, allow_blank=True, max_length=255)
    phone = serializers.CharField(required=False, allow_blank=True, max_length=50)

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        # Create the user without requiring a username
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            full_name=validated_data.get("full_name", ""),
            phone=validated_data.get("phone", ""),
            role=getattr(User, "Roles", None).PENSIONER if hasattr(User, "Roles") else "PENSIONER",
        )
        return user
