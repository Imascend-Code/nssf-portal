import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useReport } from "../../api/hooks";
import { Container, Grid, Card, CardHeader, CardContent, Typography, Stack, CircularProgress, Alert, Divider } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
function KPI({ label, value, icon }) {
    return (_jsxs(Card, { variant: "outlined", sx: { borderRadius: 3, height: "100%" }, children: [_jsx(CardHeader, { title: _jsx(Typography, { variant: "subtitle2", children: label }), action: _jsx("span", { style: { opacity: 0.8 }, children: icon }), sx: { pb: 0.5 } }), _jsxs(CardContent, { sx: { pt: 1.5 }, children: [_jsx(Typography, { variant: "h4", fontWeight: 800, sx: { lineHeight: 1 }, children: value ?? "—" }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "Updated moments ago" })] })] }));
}
export default function AdminDashboard() {
    const r = useReport();
    return (_jsxs(Container, { maxWidth: "lg", sx: { py: 4 }, children: [_jsx(Typography, { variant: "h5", fontWeight: 800, sx: { mb: 2 }, children: "Admin Dashboard" }), r.isLoading && (_jsx(Stack, { alignItems: "center", justifyContent: "center", sx: { py: 6 }, children: _jsx(CircularProgress, { size: 28 }) })), r.isError && _jsx(Alert, { severity: "error", children: "Failed to load report summary." }), !r.isLoading && !r.isError && (_jsxs(_Fragment, { children: [_jsxs(Grid, { container: true, spacing: 2, sx: { mb: 3 }, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(KPI, { label: "Total Payments", value: r.data?.payments_total, icon: _jsx(AttachMoneyIcon, {}) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(KPI, { label: "Open Requests", value: r.data?.requests_open, icon: _jsx(AssignmentIcon, {}) }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, md: 4, children: _jsx(KPI, { label: "Registered Users", value: r.data?.users_total, icon: _jsx(PeopleAltIcon, {}) }) })] }), _jsxs(Card, { variant: "outlined", sx: { borderRadius: 3 }, children: [_jsx(CardHeader, { title: "Raw Summary (debug)" }), _jsx(Divider, {}), _jsx(CardContent, { children: _jsx("pre", { style: { margin: 0, whiteSpace: "pre-wrap" }, children: JSON.stringify(r.data, null, 2) }) })] })] }))] }));
}
