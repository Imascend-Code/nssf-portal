import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { Container, Grid, Card, CardHeader, CardContent, Typography, Stack, CircularProgress, Alert, Divider, Table, TableBody, TableCell, TableHead, TableRow, Box, Chip, Button, } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useReport } from "../../api/hooks";
function KPI({ label, value, icon }) {
    return (_jsxs(Card, { variant: "outlined", sx: { borderRadius: 3, height: "100%" }, children: [_jsx(CardHeader, { title: _jsx(Typography, { variant: "subtitle2", children: label }), action: _jsx("span", { style: { opacity: 0.8 }, children: icon }), sx: { pb: 0.5 } }), _jsxs(CardContent, { sx: { pt: 1.5 }, children: [_jsx(Typography, { variant: "h4", fontWeight: 800, sx: { lineHeight: 1 }, children: value ?? "—" }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "Updated moments ago" })] })] }));
}
function Money({ v }) {
    if (v == null)
        return _jsx(_Fragment, { children: "\u2014" });
    const n = typeof v === "string" ? Number(v) : v;
    if (Number.isNaN(n))
        return _jsx(_Fragment, { children: String(v) });
    return _jsx(_Fragment, { children: new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX" }).format(n) });
}
export default function AdminReports() {
    const r = useReport();
    const paymentsTotal = React.useMemo(() => {
        const byStatus = (r.data?.payments_by_status || []);
        return byStatus.reduce((sum, row) => sum + (Number(row.total) || 0), 0);
    }, [r.data]);
    const requestsOpen = React.useMemo(() => {
        const rows = (r.data?.requests_by_status || []);
        return rows.reduce((sum, row) => {
            const s = (row.status || "").toLowerCase();
            if (["open", "pending", "in_progress"].includes(s))
                return sum + (row.count || 0);
            return sum;
        }, 0);
    }, [r.data]);
    const usersTotal = r.data?.users_total ?? undefined; // keep here in case you extend API later
    return (_jsxs(Container, { maxWidth: "lg", sx: { py: 4 }, children: [_jsxs(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center", sx: { mb: 2 }, children: [_jsx(Typography, { variant: "h5", fontWeight: 800, children: "Admin Reports" }), _jsxs(Stack, { direction: "row", spacing: 1, children: [_jsx(Button, { variant: "outlined", size: "small", onClick: () => window.open("/api/v1/reports/summary/?format=csv", "_blank"), children: "Export CSV" }), _jsx(Button, { variant: "outlined", size: "small", onClick: () => window.open("/api/v1/reports/summary/?format=pdf", "_blank"), children: "Export PDF" })] })] }), r.isLoading && (_jsx(Stack, { alignItems: "center", justifyContent: "center", sx: { py: 6 }, children: _jsx(CircularProgress, { size: 28 }) })), r.isError && _jsx(Alert, { severity: "error", children: "Failed to load report summary." }), !r.isLoading && !r.isError && (_jsxs(_Fragment, { children: [_jsxs(Grid, { container: true, spacing: 2, sx: { mb: 3 }, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(KPI, { label: "Total Payments (12 mo)", value: _jsx(Money, { v: paymentsTotal }), icon: _jsx(AttachMoneyIcon, {}) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(KPI, { label: "Open Requests", value: requestsOpen, icon: _jsx(AssignmentIcon, {}) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(KPI, { label: "Registered Users", value: usersTotal ?? "—", icon: _jsx(PeopleAltIcon, {}) }) })] }), _jsxs(Card, { variant: "outlined", sx: { borderRadius: 3, mb: 2 }, children: [_jsx(CardHeader, { title: "Payments by status (last 12 months)" }), _jsx(Divider, {}), _jsx(CardContent, { children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Status" }), _jsx(TableCell, { align: "right", children: "Count" }), _jsx(TableCell, { align: "right", children: "Total Amount" })] }) }), _jsx(TableBody, { children: (r.data?.payments_by_status || []).map((row, i) => (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { sx: { textTransform: "capitalize" }, children: row.status || "—" }), _jsx(TableCell, { align: "right", children: row.count ?? 0 }), _jsx(TableCell, { align: "right", children: _jsx(Money, { v: row.total ?? 0 }) })] }, i))) })] }) })] }), _jsxs(Card, { variant: "outlined", sx: { borderRadius: 3, mb: 2 }, children: [_jsx(CardHeader, { title: "Payments by month" }), _jsx(Divider, {}), _jsx(CardContent, { children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Month" }), _jsx(TableCell, { align: "right", children: "Total Amount" })] }) }), _jsx(TableBody, { children: Object.entries(r.data?.payments_by_month || {}).map(([month, total]) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: month }), _jsx(TableCell, { align: "right", children: _jsx(Money, { v: total }) })] }, month))) })] }) })] }), _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Card, { variant: "outlined", sx: { borderRadius: 3, height: "100%" }, children: [_jsx(CardHeader, { title: "Requests by status" }), _jsx(Divider, {}), _jsx(CardContent, { children: _jsx(Stack, { spacing: 1, children: (r.data?.requests_by_status || []).map((row, i) => (_jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", children: [_jsx(Chip, { size: "small", label: row.status || "—" }), _jsx(Typography, { fontWeight: 700, children: row.count ?? 0 })] }, i))) }) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsxs(Card, { variant: "outlined", sx: { borderRadius: 3, height: "100%" }, children: [_jsx(CardHeader, { title: "Top categories" }), _jsx(Divider, {}), _jsx(CardContent, { children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Category" }), _jsx(TableCell, { align: "right", children: "Requests" })] }) }), _jsx(TableBody, { children: (r.data?.requests_by_category || []).map((row, i) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: row.category__name || "—" }), _jsx(TableCell, { align: "right", children: row.count ?? 0 })] }, i))) })] }) })] }) })] }), _jsxs(Card, { variant: "outlined", sx: { borderRadius: 3, mt: 2 }, children: [_jsx(CardHeader, { title: "Raw Summary (debug)" }), _jsx(Divider, {}), _jsx(CardContent, { children: _jsx("pre", { style: { margin: 0, whiteSpace: "pre-wrap" }, children: JSON.stringify(r.data, null, 2) }) })] })] }))] }));
}
