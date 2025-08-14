import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link as RouterLink } from "react-router-dom";
import { useMyRequests } from "../../api/hooks";
import { Container, Card, CardHeader, CardContent, Typography, Button, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Stack, CircularProgress, Alert, Chip, } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
function StatusChip({ value }) {
    const s = (value || "").toLowerCase();
    let color = "default";
    if (["resolved", "closed", "completed", "success"].includes(s))
        color = "success";
    else if (["pending", "in_progress", "queued"].includes(s))
        color = "warning";
    else if (["rejected", "failed", "error"].includes(s))
        color = "error";
    return _jsx(Chip, { size: "small", variant: "outlined", color: color, label: value, sx: { textTransform: "capitalize" } });
}
export default function MyRequests() {
    const q = useMyRequests();
    const items = Array.isArray(q.data) ? q.data : q.data?.results ?? [];
    return (_jsx(Container, { maxWidth: "lg", sx: { py: 4 }, children: _jsxs(Card, { variant: "outlined", sx: { borderRadius: 3 }, children: [_jsx(CardHeader, { title: _jsx(Typography, { variant: "h6", children: "My Requests" }), action: _jsx(Button, { component: RouterLink, to: "/requests/new", variant: "contained", startIcon: _jsx(AddIcon, {}), children: "New request" }) }), _jsxs(CardContent, { children: [q.isLoading && (_jsx(Stack, { alignItems: "center", justifyContent: "center", sx: { py: 4 }, children: _jsx(CircularProgress, { size: 28 }) })), q.isError && _jsx(Alert, { severity: "error", children: "Failed to load your requests." }), !q.isLoading && !q.isError && (_jsx(TableContainer, { sx: { borderRadius: 2 }, children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Title" }), _jsx(TableCell, { children: "Status" })] }) }), _jsx(TableBody, { children: items.length > 0 ? (items.map((r) => (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { children: _jsx(Button, { component: RouterLink, to: `/requests/${r.id}`, variant: "text", size: "small", sx: { textDecoration: "underline", px: 0 }, children: r.title }) }), _jsx(TableCell, { children: _jsx(StatusChip, { value: r.status }) })] }, r.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 2, children: _jsx(Typography, { variant: "body2", color: "text.secondary", align: "center", children: "No requests yet." }) }) })) })] }) }))] })] }) }));
}
