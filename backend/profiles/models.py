from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError

def avatar_path(instance, filename): return f"avatars/{instance.user_id}/{filename}"

class PensionerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    nssf_number = models.CharField(max_length=50, unique=True)
    dob = models.DateField(null=True, blank=True)
    national_id = models.CharField(max_length=50, blank=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=120, blank=True)
    bank_name = models.CharField(max_length=120, blank=True)
    bank_account = models.CharField(max_length=50, blank=True)
    next_of_kin_name = models.CharField(max_length=120, blank=True)
    next_of_kin_phone = models.CharField(max_length=30, blank=True)
    avatar = models.ImageField(upload_to=avatar_path, blank=True, null=True)
    last_verified_at = models.DateTimeField(null=True, blank=True)
    def __str__(self): return f"{self.user.email} profile"

class Beneficiary(models.Model):
    profile = models.ForeignKey(PensionerProfile, on_delete=models.CASCADE, related_name="beneficiaries")
    full_name = models.CharField(max_length=120)
    relationship = models.CharField(max_length=60)
    percentage = models.PositiveIntegerField()
    phone = models.CharField(max_length=30, blank=True)
    national_id = models.CharField(max_length=50, blank=True)
    def clean(self):
        if self.percentage > 100: raise ValidationError("percentage must be <= 100")
        total = sum(b.percentage for b in self.profile.beneficiaries.exclude(pk=self.pk)) + self.percentage
        if total > 100: raise ValidationError("Total beneficiary percentage cannot exceed 100")
    def save(self,*a,**k):
        self.full_clean()
        return super().save(*a,**k)
