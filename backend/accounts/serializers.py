# accounts/serializers.py
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


# ---------- Public / general-purpose ----------
class UserSerializer(serializers.ModelSerializer):
    """
    General-purpose user serializer.
    Uses the model's `full_name` field directly (your User does not have first/last names).
    """
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
            "phone",
            "role",
            "nssf_number",
            "balance",        # DRF will serialize Decimal as string by default
            "is_staff",
            "is_superuser",
            "is_active",
            "date_joined",
        ]
        read_only_fields = [
            "id", "email", "is_staff", "is_superuser", "is_active", "date_joined",
        ]


# ---------- /users/me/ ----------
class UserMeSerializer(serializers.ModelSerializer):
    """
    What the logged-in user sees. `balance` is read-only here.
    """
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
            "phone",
            "role",
            "nssf_number",
            "balance",
            "is_staff",
            "is_superuser",
            "date_joined",
        ]
        read_only_fields = fields  # everything read-only for /me


class MeUpdateSerializer(serializers.Serializer):
    """
    Fields a user is allowed to update on their own account.
    """
    full_name = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    phone = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    nssf_number = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    def update(self, instance, validated_data):
        for k, v in validated_data.items():
            setattr(instance, k, v)
        instance.save(update_fields=list(validated_data.keys()))
        return instance


# ---------- Registration ----------
class RegisterSerializer(serializers.ModelSerializer):
    """
    Minimal registration: your User uses `email` as USERNAME_FIELD.
    Accept optional full_name/phone; do NOT include `username` / first_name / last_name.
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "password", "full_name", "phone", "nssf_number"]
        extra_kwargs = {
            "full_name": {"required": False, "allow_blank": True, "allow_null": True},
            "phone": {"required": False, "allow_blank": True, "allow_null": True},
            "nssf_number": {"required": False, "allow_blank": True, "allow_null": True},
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        # use your custom manager to ensure proper defaults (is_active, etc.)
        user = User.objects.create_user(password=password, **validated_data)
        return user


# ---------- Admin management of members ----------
class AdminMemberSerializer(serializers.ModelSerializer):
    """
    Admin can view/edit member, including `balance`.
    """
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
            "phone",
            "role",
            "nssf_number",
            "balance",      # editable by admin
            "is_active",
            "date_joined",

        ]
        read_only_fields = ["id", "email", "date_joined"]
