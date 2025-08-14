import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import { Box, Container, Typography, Card, CardHeader, CardContent, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, CircularProgress, Stack, Alert, Chip, } from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
function StatusChip({ status }) {
    const s = (status || "").toLowerCase();
    let color = "default";
    if (["processed", "success", "completed"].includes(s))
        color = "success";
    else if (["pending", "in_progress", "queued", "on_hold"].includes(s))
        color = "warning";
    else if (["rejected", "failed", "error"].includes(s))
        color = "error";
    return (_jsx(Chip, { label: status, color: color, size: "small", variant: "outlined", sx: { textTransform: "capitalize" } }));
}
export default function Payments() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["payments"],
        queryFn: async () => (await api.get("/payments/")).data,
        staleTime: 60000,
    });
    const items = Array.isArray(data) ? data : data?.results ?? [];
    const fmtUGX = (n) => new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX" }).format(Number(n));
    const fmtDate = (iso) => new Date(iso).toLocaleDateString();
    const handleDownloadStatement = async () => {
        // Uses axios instance so Authorization header is sent
        const resp = await api.get("/documents/statement/", { responseType: "blob" });
        const blob = new Blob([resp.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "statement.pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };
    return (_jsxs(Container, { maxWidth: "lg", sx: { py: 4 }, children: [_jsxs(Stack, { direction: "row", justifyContent: "space-between", alignItems: "flex-end", sx: { mb: 2 }, children: [_jsxs(Box, { children: [_jsx(Typography, { variant: "h5", fontWeight: 700, children: "My Payments" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Review your payment history and statuses." })] }), _jsx(Button, { variant: "outlined", startIcon: _jsx(GetAppIcon, {}), onClick: handleDownloadStatement, children: "Download Statement" })] }), _jsxs(Card, { variant: "outlined", sx: { borderRadius: 3 }, children: [_jsx(CardHeader, { title: _jsx(Typography, { variant: "h6", children: "Payment History" }), subheader: _jsx(Typography, { variant: "body2", color: "text.secondary", children: "All your past and recent transactions." }) }), _jsxs(CardContent, { children: [isLoading && (_jsx(Stack, { alignItems: "center", justifyContent: "center", sx: { py: 4 }, children: _jsx(CircularProgress, { size: 28 }) })), isError && (_jsxs(Alert, { severity: "error", sx: { mb: 2 }, children: ["Failed to load payments", error?.message ? ` — ${error.message}` : "", "."] })), !isLoading && !isError && items.length === 0 && (_jsx(Typography, { variant: "body2", color: "text.secondary", children: "No payments found." })), !isLoading && !isError && items.length > 0 && (_jsx(TableContainer, { sx: { borderRadius: 2 }, children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Period" }), _jsx(TableCell, { children: "Amount" }), _jsx(TableCell, { children: "Status" }), _jsx(TableCell, { children: "Reference" })] }) }), _jsx(TableBody, { children: items.map((p) => (_jsxs(TableRow, { hover: true, children: [_jsxs(TableCell, { children: [fmtDate(p.period_start), " \u2013 ", fmtDate(p.period_end)] }), _jsx(TableCell, { children: fmtUGX(p.amount) }), _jsx(TableCell, { children: _jsx(StatusChip, { status: p.status }) }), _jsx(TableCell, { children: p.reference || "—" })] }, p.id))) })] }) }))] })] })] }));
}
