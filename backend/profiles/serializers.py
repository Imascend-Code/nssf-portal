from rest_framework import serializers
from .models import PensionerProfile, Beneficiary

ALLOWED_EXT = {"image/png","image/jpeg"}

class PensionerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PensionerProfile
        fields = "__all__"
        read_only_fields = ("user","last_verified_at","nssf_number")

    def validate_bank_account(self, v):
        if v and len(v) < 6: raise serializers.ValidationError("Bank account too short")
        return v

    def validate_avatar(self, f):
        if f and f.size > 5*1024*1024: raise serializers.ValidationError("Avatar max 5MB")
        if f and f.content_type not in ALLOWED_EXT: raise serializers.ValidationError("Only png/jpg allowed")
        return f

class BeneficiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Beneficiary
        fields = "__all__"
        read_only_fields = ("profile",)
