import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Dashboard.tsx
import * as React from 'react';
import { useProfile, usePayments, useMyRequests } from '../api/hooks';
import { useQuery } from '@tanstack/react-query';
import { api } from './../api/client';
import { Box, Container, Grid, Card, CardHeader, CardContent, Typography, Tabs, Tab, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Chip, CircularProgress, Stack, Avatar, } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
function StatusChip({ status }) {
    const s = (status || '').toLowerCase();
    let color = 'default';
    if (['processed', 'resolved', 'closed', 'success', 'completed'].includes(s))
        color = 'success';
    else if (['pending', 'in_progress', 'queued'].includes(s))
        color = 'warning';
    else if (['rejected', 'failed', 'error'].includes(s))
        color = 'error';
    return _jsx(Chip, { label: status, color: color, size: "small", variant: "outlined", sx: { textTransform: 'capitalize' } });
}
const fmtUGX = (n) => new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(typeof n === 'string' ? Number(n) : n ?? 0);
export default function Dashboard() {
    // Profile (beneficiaries, etc.)
    const { data: profile } = useProfile();
    // NEW: Users/me for balance (read from /api/v1/users/me/)
    const me = useQuery({
        queryKey: ['users-me'],
        queryFn: async () => (await api.get('/users/me/')).data,
        staleTime: 5 * 60 * 1000,
    });
    // Data
    const payments = usePayments({ page_size: 5 });
    const requests = useMyRequests({ page_size: 5 });
    const pendingRequestsCount = (requests.data?.results || []).filter((r) => r.status !== 'resolved' && r.status !== 'closed').length;
    const kpis = [
        { title: 'Balance', value: fmtUGX(me.data?.balance ?? 0), icon: _jsx(AccountBalanceWalletIcon, {}) },
        { title: 'Total Payments', value: payments.data?.length ?? 0, icon: _jsx(CreditCardIcon, {}) },
        { title: 'Pending Requests', value: pendingRequestsCount, icon: _jsx(DescriptionIcon, {}) },
        { title: 'Beneficiaries', value: profile?.beneficiaries_count ?? 0, icon: _jsx(GroupsIcon, {}) },
    ];
    const [tab, setTab] = React.useState('payments');
    return (_jsxs(Container, { maxWidth: "lg", sx: { py: 4 }, children: [_jsxs(Box, { sx: { mb: 3 }, children: [_jsxs(Typography, { variant: "h5", fontWeight: 700, children: ["Welcome back", (me.data?.full_name || profile?.full_name) ? `, ${me.data?.full_name ?? profile?.full_name}` : '', "!"] }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mt: 0.5 }, children: "Overview of your account activity and contributions." })] }), _jsx(Grid, { container: true, spacing: 2, sx: { mb: 3 }, children: kpis.map((k, i) => (_jsx(Grid, { item: true, xs: 12, sm: 6, lg: 3, children: _jsxs(Card, { variant: "outlined", sx: { borderRadius: 3, height: '100%' }, children: [_jsx(CardHeader, { title: _jsx(Typography, { variant: "subtitle2", children: k.title }), action: _jsx(Avatar, { sx: { width: 28, height: 28, bgcolor: 'action.hover' }, children: k.icon }), sx: { pb: 0.5 } }), _jsxs(CardContent, { sx: { pt: 1.5 }, children: [_jsx(Typography, { variant: "h4", fontWeight: 800, sx: { lineHeight: 1 }, children: k.value }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "Updated just now" })] })] }) }, i))) }), _jsxs(Card, { variant: "outlined", sx: { borderRadius: 3 }, children: [_jsx(CardHeader, { title: _jsxs(Tabs, { value: tab, onChange: (_, v) => setTab(v), "aria-label": "dashboard tabs", sx: { minHeight: 0, '& .MuiTab-root': { py: 1, textTransform: 'none' } }, children: [_jsx(Tab, { value: "payments", label: "Recent Payments" }), _jsx(Tab, { value: "requests", label: "Recent Requests" })] }), sx: { pb: 0 } }), _jsxs(CardContent, { children: [tab === 'payments' && (_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", fontWeight: 700, sx: { mb: 0.5 }, children: "Payments" }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 }, children: "Your latest transactions" }), payments.isLoading ? (_jsx(Stack, { alignItems: "center", justifyContent: "center", sx: { py: 4 }, children: _jsx(CircularProgress, { size: 28 }) })) : payments.data?.length ? (_jsx(TableContainer, { sx: { borderRadius: 2 }, children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Period" }), _jsx(TableCell, { children: "Amount" }), _jsx(TableCell, { children: "Status" }), _jsx(TableCell, { children: "Reference" })] }) }), _jsx(TableBody, { children: payments.data.map((p) => (_jsxs(TableRow, { hover: true, children: [_jsxs(TableCell, { children: [p.period_start, " \u2013 ", p.period_end] }), _jsx(TableCell, { children: fmtUGX(p.amount) }), _jsx(TableCell, { children: _jsx(StatusChip, { status: p.status }) }), _jsx(TableCell, { children: p.reference || '—' })] }, p.id))) })] }) })) : (_jsx(Typography, { variant: "body2", color: "text.secondary", children: "No payments found." }))] })), tab === 'requests' && (_jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", fontWeight: 700, sx: { mb: 0.5 }, children: "Requests" }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 }, children: "Latest service requests" }), requests.isLoading ? (_jsx(Stack, { alignItems: "center", justifyContent: "center", sx: { py: 4 }, children: _jsx(CircularProgress, { size: 28 }) })) : (requests.data?.results || []).length ? (_jsx(TableContainer, { sx: { borderRadius: 2 }, children: _jsxs(Table, { size: "small", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Title" }), _jsx(TableCell, { children: "Category" }), _jsx(TableCell, { children: "Status" }), _jsx(TableCell, { children: "Priority" })] }) }), _jsx(TableBody, { children: requests.data.results.map((r) => (_jsxs(TableRow, { hover: true, children: [_jsx(TableCell, { sx: { fontWeight: 600 }, children: r.title }), _jsx(TableCell, { children: r.category?.name || '—' }), _jsx(TableCell, { children: _jsx(StatusChip, { status: r.status }) }), _jsx(TableCell, { sx: { textTransform: 'capitalize' }, children: r.priority })] }, r.id))) })] }) })) : (_jsx(Typography, { variant: "body2", color: "text.secondary", children: "No requests yet." }))] }))] })] })] }));
}
