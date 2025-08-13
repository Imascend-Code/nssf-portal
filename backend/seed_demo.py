import os, django, random
from datetime import date, timedelta
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings"); django.setup()

from accounts.models import User, Roles
from profiles.models import PensionerProfile, Beneficiary
from payments.models import Payment
from services.models import ServiceCategory, ServiceRequest, Priority

def run():
    admin, _ = User.objects.get_or_create(email="admin@nssf.test", defaults={"role":Roles.ADMIN})
    admin.set_password("Pass123!"); admin.is_superuser=True; admin.is_staff=True; admin.save()

    staff, _ = User.objects.get_or_create(email="staff@nssf.test", defaults={"role":Roles.STAFF})
    staff.set_password("Pass123!"); staff.is_staff=True; staff.save()

    p1, _ = User.objects.get_or_create(email="p1@nssf.test", defaults={"role":Roles.PENSIONER,"full_name":"Pensioner One"})
    p1.set_password("Pass123!"); p1.save()
    p2, _ = User.objects.get_or_create(email="p2@nssf.test", defaults={"role":Roles.PENSIONER,"full_name":"Pensioner Two"})
    p2.set_password("Pass123!"); p2.save()

    for u in (p1,p2):
        prof, _ = PensionerProfile.objects.get_or_create(user=u, defaults={"nssf_number":f"NSSF-{u.id}"})
        Beneficiary.objects.get_or_create(profile=prof, full_name="Next of Kin", relationship="Spouse", percentage=100)
        # 12 months payments
        start = date.today().replace(day=1)
        for i in range(12):
            s = (start - timedelta(days=30*i)).replace(day=1)
            e = s.replace(day=28)
            Payment.objects.get_or_create(pensioner=u, period_start=s, period_end=e, amount=350000, reference=f"REF{u.id}{i}")

    c1,_=ServiceCategory.objects.get_or_create(name="Benefit Update", defaults={"description":"Update benefit details"})
    c2,_=ServiceCategory.objects.get_or_create(name="Certificate Request")
    for i in range(2):
        ServiceRequest.objects.get_or_create(requester=p1, category=c2, title=f"Certificate #{i+1}", description="Need letter", priority=Priority.NORMAL)

if __name__ == "__main__":
    run()
