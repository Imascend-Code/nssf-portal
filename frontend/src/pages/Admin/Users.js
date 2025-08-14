import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Admin/Users.tsx
import * as React from "react";
import { Container, Card, CardHeader, CardContent, Typography, Stack, Alert, TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, IconButton, Switch, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, TablePagination, Box, Tooltip, CircularProgress, } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/client";
import { useAuthStore } from "../../store/auth";
const EP = {
    MEMBERS: "/members/",
};
function asArray(payload) {
    if (!payload)
        return [];
    if (Array.isArray(payload))
        return payload;
    return payload.results ?? [];
}
function formatMoney(v) {
    if (v === null || v === undefined || v === "")
        return "—";
    const num = typeof v === "string" ? Number(v) : v;
    if (Number.isNaN(num))
        return String(v);
    // UGX formatting by default; change as needed
    return new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX" }).format(num);
}
export default function AdminUsers() {
    const user = useAuthStore((s) => s.user);
    const isAdmin = !!user && (user.is_superuser || user.is_staff || user.role === "ADMIN");
    // Local state for filters & pagination
    const [search, setSearch] = React.useState("");
    const [role, setRole] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    // Build params for API
    const params = React.useMemo(() => {
        const p = {
            page: page + 1, // DRF pages are 1-indexed
            page_size: rowsPerPage,
        };
        if (search.trim())
            p.search = search.trim();
        if (role)
            p.role = role;
        if (status)
            p.is_active = status === "active" ? "true" : "false";
        return p;
    }, [search, role, status, page, rowsPerPage]);
    // Query users
    const q = useQuery({
        queryKey: ['users', filters],
        queryFn: fetchUsers,
        placeholderData: (prev) => prev,
    });
    function asArray(v) {
        if (Array.isArray(v))
            return v;
        if (v && typeof v === 'object' && 'results' in v)
            return v.results ?? [];
        return [];
    }
    const items = asArray(q.data);
    const qc = useQueryClient();
    // Mutations
    const toggleActive = useMutation({
        mutationFn: async (payload) => (await api.patch(`${EP.MEMBERS}${payload.id}/`, { is_active: payload.is_active })).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-members"] }),
    });
    const saveBalance = useMutation({
        mutationFn: async (payload) => (await api.patch(`${EP.MEMBERS}${payload.id}/`, { balance: payload.balance })).data,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-members"] }),
    });
    // Inline balance editing state
    const [editing, setEditing] = React.useState({});
    const items = asArray(q.data);
    const total = q.data?.count ?? items.length;
    // Handlers
    const handleChangePage = (_, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };
    if (!isAdmin) {
        return (_jsx(Container, { maxWidth: "md", sx: { py: 4 }, children: _jsx(Alert, { severity: "error", children: "Admin access required." }) }));
    }
    return (_jsx(Container, { maxWidth: "lg", sx: { py: 4 }, children: _jsxs(Card, { variant: "outlined", sx: { borderRadius: 3 }, children: [_jsx(CardHeader, { title: _jsx(Typography, { variant: "h6", children: "Users" }), action: _jsx(Tooltip, { title: "Refresh", children: _jsx("span", { children: _jsx(IconButton, { onClick: () => qc.invalidateQueries({ queryKey: ["admin-members"] }), disabled: q.isFetching, children: q.isFetching ? _jsx(CircularProgress, { size: 18 }) : _jsx(RefreshIcon, {}) }) }) }) }), _jsxs(CardContent, { children: [_jsxs(Stack, { direction: { xs: "column", sm: "row" }, spacing: 1.5, sx: { mb: 2 }, children: [_jsx(TextField, { size: "small", placeholder: "Search email or name", value: search, onChange: (e) => {
                                        setSearch(e.target.value);
                                        setPage(0);
                                    }, InputProps: {
                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(SearchIcon, { fontSize: "small" }) })),
                                    }, sx: { minWidth: 240 } }), _jsxs(FormControl, { size: "small", sx: { minWidth: 160 }, children: [_jsx(InputLabel, { id: "role-label", children: "Role" }), _jsxs(Select, { labelId: "role-label", label: "Role", value: role, onChange: (e) => {
                                                setRole(e.target.value);
                                                setPage(0);
                                            }, children: [_jsx(MenuItem, { value: "", children: "All" }), _jsx(MenuItem, { value: "PENSIONER", children: "Pensioner" }), _jsx(MenuItem, { value: "STAFF", children: "Staff" }), _jsx(MenuItem, { value: "ADMIN", children: "Admin" })] })] }), _jsxs(FormControl, { size: "small", sx: { minWidth: 160 }, children: [_jsx(InputLabel, { id: "status-label", children: "Status" }), _jsxs(Select, { labelId: "status-label", label: "Status", value: status, onChange: (e) => {
                                                setStatus(e.target.value);
                                                setPage(0);
                                            }, children: [_jsx(MenuItem, { value: "", children: "All" }), _jsx(MenuItem, { value: "active", children: "Active" }), _jsx(MenuItem, { value: "inactive", children: "Inactive" })] })] })] }), q.isError && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: "Failed to load users." })), _jsx(TableContainer, { sx: { borderRadius: 1, border: 1, borderColor: "divider" }, children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Email" }), _jsx(TableCell, { children: "Name" }), _jsx(TableCell, { children: "Role" }), _jsx(TableCell, { children: "NSSF #" }), _jsx(TableCell, { align: "right", children: "Balance" }), _jsx(TableCell, { align: "center", children: "Active" }), _jsx(TableCell, { children: "Joined" })] }) }), _jsxs(TableBody, { children: [q.isLoading && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 7, align: "center", children: _jsx(Box, { sx: { py: 3 }, children: _jsx(CircularProgress, { size: 22 }) }) }) })), !q.isLoading && items.length === 0 && (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 7, align: "center", children: _jsx(Box, { sx: { py: 3, color: "text.secondary" }, children: "No users found." }) }) })), items.map((u) => {
                                                const name = u.full_name || [u.first_name, u.last_name].filter(Boolean).join(" ") || "—";
                                                const balanceDraft = editing[u.id] ?? (u.balance ?? "").toString();
                                                return (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { sx: { maxWidth: 260, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: u.email }), _jsx(TableCell, { children: name }), _jsx(TableCell, { children: u.role || "—" }), _jsx(TableCell, { children: u.nssf_number || "—" }), _jsxs(TableCell, { align: "right", sx: { minWidth: 220 }, children: [_jsxs(Stack, { direction: "row", spacing: 1, justifyContent: "flex-end", alignItems: "center", children: [_jsx(TextField, { size: "small", type: "number", inputProps: { step: "0.01" }, value: balanceDraft, onChange: (e) => setEditing((s) => ({
                                                                                ...s,
                                                                                [u.id]: e.target.value,
                                                                            })), sx: { maxWidth: 140 } }), _jsx(Tooltip, { title: "Save balance", children: _jsx("span", { children: _jsx(IconButton, { color: "primary", onClick: () => {
                                                                                        const val = Number(balanceDraft);
                                                                                        if (Number.isNaN(val))
                                                                                            return;
                                                                                        saveBalance.mutate({ id: u.id, balance: val });
                                                                                    }, disabled: saveBalance.isLoading, children: saveBalance.isLoading ? _jsx(CircularProgress, { size: 18 }) : _jsx(SaveIcon, { fontSize: "small" }) }) }) })] }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: formatMoney(u.balance ?? 0) })] }), _jsx(TableCell, { align: "center", children: _jsx(Switch, { checked: u.is_active, onChange: (e) => toggleActive.mutate({ id: u.id, is_active: e.target.checked }), disabled: toggleActive.isLoading }) }), _jsx(TableCell, { children: u.date_joined ? new Date(u.date_joined).toLocaleDateString() : "—" })] }, u.id));
                                            })] })] }) }), _jsxs(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1, children: [_jsx(Typography, { variant: "caption", color: "text.secondary", children: q.isFetching ? "Refreshing…" : `${total} total` }), _jsx(TablePagination, { component: "div", count: total, page: page, onPageChange: handleChangePage, rowsPerPage: rowsPerPage, onRowsPerPageChange: handleChangeRowsPerPage, rowsPerPageOptions: [5, 10, 25, 50] })] })] })] }) }));
}
