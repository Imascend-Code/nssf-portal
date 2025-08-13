from io import BytesIO
from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime
from .models import Payment

def statement_pdf(request):
    user = request.user
    start = request.GET.get("start")
    end = request.GET.get("end")
    qs = Payment.objects.filter(pensioner=user)
    if start: qs = qs.filter(period_start__gte=start)
    if end: qs = qs.filter(period_end__lte=end)

    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    p.setTitle("Pension Statement")
    p.drawString(50, 800, f"Pension Statement for {user.full_name or user.email}")
    y = 770
    for item in qs[:100]:
        p.drawString(50, y, f"{item.period_start} - {item.period_end} | {item.amount} | {item.status}")
        y -= 18
        if y < 50: p.showPage(); y = 800
    p.showPage()
    p.save()
    buffer.seek(0)
    resp = HttpResponse(buffer, content_type="application/pdf")
    resp["Content-Disposition"] = 'attachment; filename="statement.pdf"'
    return resp
