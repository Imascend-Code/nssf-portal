# profiles/admin.py
from django.contrib import admin
from django.contrib.admin.sites import NotRegistered
from .models import PensionerProfile, Beneficiary

class BeneficiaryInline(admin.TabularInline):
    model = Beneficiary
    extra = 1
    fields = ("full_name", "relationship", "percentage", "phone", "national_id")
    min_num = 0

# Be idempotent: if something registered it earlier, remove it so we can define ours cleanly.
try:
    admin.site.unregister(PensionerProfile)
except NotRegistered:
    pass

@admin.register(PensionerProfile)
class PensionerProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "nssf_number",
        "dob",
        "national_id",
        "bank_name",
        "bank_account",
        "last_verified_at",
    )
    search_fields = (
        "user__email",
        "nssf_number",
        "national_id",
        "bank_account",
    )
    list_filter = ("bank_name", "city")
    inlines = [BeneficiaryInline]

@admin.register(Beneficiary)
class BeneficiaryAdmin(admin.ModelAdmin):
    list_display = (
        "profile",
        "full_name",
        "relationship",
        "percentage",
        "phone",
        "national_id",
    )
    search_fields = ("full_name", "national_id", "phone")
    list_filter = ("relationship",)
