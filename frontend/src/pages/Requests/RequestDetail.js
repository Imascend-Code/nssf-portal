import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "./../../api/client";
import { Container, Card, CardHeader, CardContent, Typography, Stack, Chip, Divider, Button, CircularProgress, Alert, Link as MUILink, } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
export default function RequestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const q = useQuery({
        queryKey: ["request", id],
        queryFn: async () => (await api.get(`/requests/${id}/`)).data,
        enabled: !!id,
    });
    if (q.isLoading) {
        return (_jsx(Container, { maxWidth: "md", sx: { py: 4 }, children: _jsx(Stack, { alignItems: "center", justifyContent: "center", sx: { py: 6 }, children: _jsx(CircularProgress, { size: 28 }) }) }));
    }
    if (q.isError) {
        return (_jsx(Container, { maxWidth: "md", sx: { py: 4 }, children: _jsx(Alert, { severity: "error", children: "Failed to load request." }) }));
    }
    const r = q.data;
    return (_jsx(Container, { maxWidth: "md", sx: { py: 4 }, children: _jsxs(Card, { variant: "outlined", sx: { borderRadius: 3 }, children: [_jsx(CardHeader, { title: _jsxs(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center", children: [_jsx(Typography, { variant: "h6", children: r.title }), _jsx(StatusChip, { value: r.status })] }) }), _jsxs(CardContent, { children: [_jsxs(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 1.5 }, children: ["Priority: ", _jsx("strong", { style: { textTransform: "capitalize" }, children: r.priority })] }), _jsx(Divider, { sx: { my: 1.5 } }), _jsx(Typography, { variant: "body1", sx: { whiteSpace: "pre-line", mb: 2 }, children: r.description }), _jsx(Divider, { sx: { my: 1.5 } }), _jsx(Typography, { variant: "subtitle2", sx: { mb: 1 }, children: "Attachments" }), _jsx(Stack, { component: "ul", sx: { pl: 2, m: 0 }, spacing: 0.5, children: (r.attachments || []).length > 0 ? ((r.attachments || []).map((a) => (_jsx("li", { children: _jsx(MUILink, { href: a.file, target: "_blank", rel: "noopener", children: "file" }) }, a.id)))) : (_jsx(Typography, { variant: "body2", color: "text.secondary", children: "No attachments" })) }), _jsx(Stack, { direction: "row", justifyContent: "flex-start", sx: { mt: 3 }, children: _jsx(Button, { variant: "outlined", startIcon: _jsx(ArrowBackIcon, {}), onClick: () => navigate(-1), children: "Back" }) })] })] }) }));
}
