# accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    # Table (changelist) config
    ordering = ("email",)
    list_display = (
        "email",
        "role",
        "full_name",
        "phone",
        "balance",          # visible in list
        "is_active",
        "is_staff",
        "is_superuser",
        "last_login",
    )
    list_filter = ("role", "is_active", "is_staff", "is_superuser")
    search_fields = ("email", "full_name", "nssf_number")

    # If you want to edit `balance` directly in the list view, keep the two lines below.
    # Note: fields in list_editable CANNOT be in list_display_links.
    list_display_links = ("email",)   # clicking opens the change form
    list_editable = ("balance",)      # <-- inline-editable in the table

    # Change form layout (edit page)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (_("Personal info"), {"fields": ("full_name", "phone")}),
        (_("Balance"), {"fields": ("balance",)}),  # <-- editable here
        (_("Permissions"), {
            "fields": ("role", "is_active", "is_staff", "is_superuser", "groups", "user_permissions")
        }),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )

    # Add form layout (create user in admin). Usually you don't set balance at creation,
    # but you can include it if you want to.
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "password1", "password2", "role", "is_staff", "is_superuser", "balance"),
        }),
    )
