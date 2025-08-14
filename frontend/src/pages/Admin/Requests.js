import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import { Container, Card, CardHeader, CardContent, Typography, TextField, InputAdornment, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Stack, CircularProgress, Alert, Chip, MenuItem, Select, FormControl, InputLabel, Pagination, Box, } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
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
export default function AdminRequests() {
    const [page, setPage] = React.useState(1);
    const [pageSize] = React.useState(10);
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState("");
    const q = useQuery({
        queryKey: ["requests-admin", { page, page_size: pageSize, search, status }],
        queryFn: async () => (await api.get("/requests/", {
            params: {
                page,
                page_size: pageSize,
                search: search || undefined,
                status: status || undefined,
            },
        })).data,
        keepPreviousData: true,
        staleTime: 30000,
    });
    const items = Array.isArray(q.data) ? q.data : q.data?.results ?? [];
    const total = q.data?.count ?? items.length;
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    return (_jsx(Container, { maxWidth: "lg", sx: { py: 4 }, children: _jsxs(Card, { variant: "outlined", sx: { borderRadius: 3 }, children: [_jsx(CardHeader, { title: _jsx(Typography, { variant: "h6", children: "All Requests" }) }), _jsxs(CardContent, { children: [_jsxs(Stack, { direction: { xs: "column", sm: "row" }, spacing: 1.5, sx: { mb: 2 }, children: [_jsx(TextField, { placeholder: "Search title, requester\u2026", value: search, onChange: (e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }, fullWidth: true, InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(SearchIcon, { fontSize: "small" }) })),
                                    } }), _jsxs(FormControl, { sx: { minWidth: 180 }, children: [_jsx(InputLabel, { id: "status-label", children: "Status" }), _jsxs(Select, { labelId: "status-label", label: "Status", value: status, onChange: (e) => {
                                                setStatus(e.target.value);
                                                setPage(1);
                                            }, children: [_jsx(MenuItem, { value: "", children: "All" }), _jsx(MenuItem, { value: "pending", children: "Pending" }), _jsx(MenuItem, { value: "in_progress", children: "In progress" }), _jsx(MenuItem, { value: "resolved", children: "Resolved" }), _jsx(MenuItem, { value: "rejected", children: "Rejected" }), _jsx(MenuItem, { value: "closed", children: "Closed" })] })] })] }), q.isLoading && (_jsx(Stack, { alignItems: "center", justifyContent: "center", sx: { py: 6 }, children: _jsx(CircularProgress, { size: 28 }) })), q.isError && _jsx(Alert, { severity: "error", children: "Failed to load requests." }), !q.isLoading && !q.isError && (_jsxs(_Fragment, { children: [_jsx(TableContainer, { sx: { borderRadius: 2 }, children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Title" }), _jsx(TableCell, { children: "Status" }), _jsx(TableCell, { children: "Priority" }), _jsx(TableCell, { children: "Category" }), _jsx(TableCell, { children: "Requester" }), _jsx(TableCell, { children: "Created" })] }) }), _jsx(TableBody, { children: items.length > 0 ? (items.map((r) => (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { children: r.title }), _jsx(TableCell, { children: _jsx(StatusChip, { value: r.status }) }), _jsx(TableCell, { sx: { textTransform: "capitalize" }, children: r.priority }), _jsx(TableCell, { children: r.category?.name || "—" }), _jsx(TableCell, { children: r.requester?.full_name || r.requester?.email || "—" }), _jsx(TableCell, { children: r.created_at ? new Date(r.created_at).toLocaleString() : "—" })] }, r.id)))) : (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 6, children: _jsx(Typography, { variant: "body2", color: "text.secondary", align: "center", children: "No results." }) }) })) })] }) }), _jsx(Box, { sx: { display: "flex", justifyContent: "flex-end", mt: 2 }, children: _jsx(Pagination, { count: pageCount, page: page, onChange: (_, p) => setPage(p), color: "primary", size: "small" }) })] }))] })] }) }));
}
