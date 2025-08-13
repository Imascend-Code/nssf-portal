# reports/utils.py
from __future__ import annotations
import io
import json
from datetime import datetime
from decimal import Decimal
from typing import Iterable, Dict, Any, List

from django.core.files.base import ContentFile

try:
    import pandas as pd  # for CSV/XLSX convenience; optional
except Exception:
    pd = None

try:
    # Simple PDF using reportlab (pip install reportlab) — or swap for WeasyPrint
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen import canvas
    REPORTLAB_AVAILABLE = True
except Exception:
    REPORTLAB_AVAILABLE = False

from .models import Report, ReportFormat, ReportKind

# ----- Example domain imports (adapt to your project) -----
from django.contrib.auth import get_user_model
User = get_user_model()
try:
    from payments.models import Payment
except Exception:
    Payment = None

try:
    from services.models import ServiceRequest
except Exception:
    ServiceRequest = None


def _decimal_to_float(v):
    if isinstance(v, Decimal):
        return float(v)
    return v


def _payments_qs_for_user(user) -> Iterable:
    if Payment is None:
        return []
    qs = Payment.objects.all().order_by("-period_start")
    # if non-admin, restrict to the user's data (adjust filter to your schema)
    if not user.is_staff:
        qs = qs.filter(user=user)
    return qs


def _requests_qs_for_user(user) -> Iterable:
    if ServiceRequest is None:
        return []
    qs = ServiceRequest.objects.all().order_by("-created_at")
    if not user.is_staff:
        qs = qs.filter(requester=user)
    return qs


def build_dataset(kind: str, user, params: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Return rows for the requested report kind."""
    rows: List[Dict[str, Any]] = []
    if kind == ReportKind.ACCOUNT_SUMMARY:
        # Example: one-row statement summary for this user
        rows.append({
            "email": user.email,
            "full_name": getattr(user, "full_name", ""),
            "nssf_number": getattr(user, "nssf_number", ""),
            "balance": _decimal_to_float(getattr(user, "balance", 0)),
            "generated_at": datetime.utcnow().isoformat(),
        })

    elif kind == ReportKind.PAYMENTS:
        for p in _payments_qs_for_user(user):
            rows.append({
                "period_start": getattr(p, "period_start", ""),
                "period_end": getattr(p, "period_end", ""),
                "amount": _decimal_to_float(getattr(p, "amount", 0)),
                "status": getattr(p, "status", ""),
                "reference": getattr(p, "reference", ""),
                "paid_at": getattr(p, "paid_at", None),
            })

    elif kind == ReportKind.REQUESTS:
        for r in _requests_qs_for_user(user):
            rows.append({
                "id": r.id,
                "title": r.title,
                "category": getattr(getattr(r, "category", None), "name", ""),
                "status": r.status,
                "priority": r.priority,
                "created_at": r.created_at,
                "resolved_at": getattr(r, "resolved_at", None),
            })
    else:
        # Unknown kind -> still return something
        rows.append({"note": f"Unknown report kind: {kind}"})
    return rows


def write_report_file(report: Report, rows: List[Dict[str, Any]]) -> None:
    fmt = report.format

    if fmt == ReportFormat.JSON:
        payload = json.dumps(rows, default=str, indent=2).encode("utf-8")
        report.file.save(f"{report.kind}.json", ContentFile(payload), save=False)
        report.size_bytes = len(payload)
        return

    if fmt == ReportFormat.CSV:
        if pd is None:
            # basic CSV by hand
            if not rows:
                payload = b""
            else:
                headers = list(rows[0].keys())
                out = io.StringIO()
                out.write(",".join(headers) + "\n")
                for row in rows:
                    out.write(",".join([str(row.get(h, "")) for h in headers]) + "\n")
                payload = out.getvalue().encode("utf-8")
        else:
            df = pd.DataFrame(rows)
            payload = df.to_csv(index=False).encode("utf-8")
        report.file.save(f"{report.kind}.csv", ContentFile(payload), save=False)
        report.size_bytes = len(payload)
        return

    if fmt == ReportFormat.XLSX:
        if pd is None:
            # Fallback: write CSV but name as xlsx to avoid failing (or raise)
            payload = b"Install pandas/openpyxl for real XLSX."
            report.file.save(f"{report.kind}.xlsx", ContentFile(payload), save=False)
            report.size_bytes = len(payload)
            return
        else:
            bio = io.BytesIO()
            with pd.ExcelWriter(bio, engine="openpyxl") as writer:
                pd.DataFrame(rows).to_excel(writer, index=False, sheet_name="Report")
            payload = bio.getvalue()
            report.file.save(f"{report.kind}.xlsx", ContentFile(payload), save=False)
            report.size_bytes = len(payload)
            return

    if fmt == ReportFormat.PDF:
        if not REPORTLAB_AVAILABLE:
            payload = b"Install reportlab to enable PDF."
            report.file.save(f"{report.kind}.pdf", ContentFile(payload), save=False)
            report.size_bytes = len(payload)
            return
        bio = io.BytesIO()
        c = canvas.Canvas(bio, pagesize=A4)
        width, height = A4

        y = height - 50
        c.setFont("Helvetica-Bold", 14)
        c.drawString(50, y, report.title)
        y -= 20
        c.setFont("Helvetica", 10)
        c.drawString(50, y, f"Generated: {datetime.utcnow().isoformat()}  |  Owner: {report.owner.email}")
        y -= 24

        # write first N rows
        max_rows = 40
        keys = list(rows[0].keys()) if rows else []
        if rows:
            # header
            c.setFont("Helvetica-Bold", 9)
            c.drawString(50, y, " | ".join(keys)[:110])
            y -= 14
            c.setFont("Helvetica", 8)
            for i, row in enumerate(rows[:max_rows], start=1):
                line = " | ".join([str(row.get(k, "")) for k in keys])[:120]
                if y < 60:
                    c.showPage()
                    y = height - 50
                c.drawString(50, y, line)
                y -= 12
        else:
            c.drawString(50, y, "(No data)")
        c.showPage()
        c.save()
        payload = bio.getvalue()
        report.file.save(f"{report.kind}.pdf", ContentFile(payload), save=False)
        report.size_bytes = len(payload)
        return

    # Unknown format fallback
    payload = json.dumps({"detail": f"Unsupported format {fmt}"}).encode("utf-8")
    report.file.save(f"{report.kind}.txt", ContentFile(payload), save=False)
    report.size_bytes = len(payload)


def generate_report(report: Report, *, actor) -> Report:
    """
    Synchronously generate the report file.
    If you add Celery later, enqueue this function.
    """
    report.status = "running"
    report.error_message = ""
    report.save(update_fields=["status", "error_message"])

    try:
        rows = build_dataset(report.kind, actor if not actor.is_staff else report.owner, report.params or {})
        write_report_file(report, rows)
        report.status = "done"
        from django.utils import timezone
        report.generated_at = timezone.now()
        report.save(update_fields=["status", "generated_at", "file", "size_bytes"])
    except Exception as e:
        report.status = "error"
        report.error_message = str(e)
        report.save(update_fields=["status", "error_message"])
        raise
    return report
