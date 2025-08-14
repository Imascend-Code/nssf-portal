import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/notifications/NotificationsDrawer.tsx
import * as React from "react";
import { Drawer, Box, Typography, IconButton, Stack, List, ListItem, ListItemText, ListItemSecondaryAction, Button, Chip, Divider, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { fetchNotifications, markRead, markAllRead, markManyRead } from "../api/notifications";
export default function NotificationsDrawer({ open, onClose }) {
    const [loading, setLoading] = React.useState(true);
    const [items, setItems] = React.useState([]);
    const [selected, setSelected] = React.useState(new Set());
    const load = React.useCallback(async () => {
        setLoading(true);
        try {
            const d = await fetchNotifications();
            const list = Array.isArray(d) ? d : d.results ?? [];
            setItems(list);
        }
        finally {
            setLoading(false);
        }
    }, []);
    React.useEffect(() => { if (open)
        load(); }, [open, load]);
    const toggleSelect = (id) => setSelected((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });
    const handleMark = async (id) => {
        await markRead(id);
        setItems((xs) => xs.map((x) => (x.id === id ? { ...x, was_read: true } : x)));
    };
    const handleMarkAll = async () => {
        await markAllRead();
        setItems((xs) => xs.map((x) => ({ ...x, was_read: true })));
        setSelected(new Set());
    };
    const handleMarkSelected = async () => {
        const ids = Array.from(selected);
        if (ids.length === 0)
            return;
        await markManyRead(ids);
        setItems((xs) => xs.map((x) => (selected.has(x.id) ? { ...x, was_read: true } : x)));
        setSelected(new Set());
    };
    return (_jsx(Drawer, { anchor: "right", open: open, onClose: onClose, children: _jsxs(Box, { sx: { width: { xs: 320, sm: 380 }, p: 2, display: "grid", gap: 1.5 }, children: [_jsxs(Stack, { direction: "row", justifyContent: "space-between", alignItems: "center", children: [_jsx(Typography, { variant: "h6", children: "Notifications" }), _jsx(IconButton, { onClick: onClose, size: "small", children: _jsx(CloseIcon, {}) })] }), _jsxs(Stack, { direction: "row", spacing: 1, sx: { mb: 1 }, children: [_jsx(Button, { onClick: load, size: "small", variant: "outlined", children: "Refresh" }), _jsx(Button, { onClick: handleMarkSelected, size: "small", disabled: !selected.size, startIcon: _jsx(DoneIcon, {}), children: "Mark selected read" }), _jsx(Button, { onClick: handleMarkAll, size: "small", startIcon: _jsx(DoneIcon, {}), children: "Mark all read" })] }), _jsx(Divider, {}), loading ? (_jsx(Stack, { alignItems: "center", justifyContent: "center", sx: { py: 6 }, children: _jsx(CircularProgress, { size: 24 }) })) : items.length === 0 ? (_jsx(Typography, { variant: "body2", color: "text.secondary", children: "No notifications yet." })) : (_jsx(List, { dense: true, sx: { py: 0 }, children: items.map((n) => (_jsxs(ListItem, { button: true, onClick: () => toggleSelect(n.id), selected: selected.has(n.id), sx: { alignItems: "flex-start" }, children: [_jsx(ListItemText, { primary: _jsxs(Stack, { direction: "row", spacing: 1, alignItems: "center", children: [_jsx(Typography, { variant: "subtitle2", children: n.subject }), !n.was_read && _jsx(Chip, { size: "small", label: "NEW", color: "primary", variant: "outlined" })] }), secondary: _jsxs(_Fragment, { children: [_jsx(Typography, { variant: "body2", color: "text.secondary", children: n.message }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: new Date(n.sent_at).toLocaleString() })] }) }), _jsx(ListItemSecondaryAction, { children: !n.was_read && (_jsx(IconButton, { edge: "end", "aria-label": "mark read", onClick: () => handleMark(n.id), size: "small", children: _jsx(DoneIcon, { fontSize: "small" }) })) })] }, n.id))) }))] }) }));
}
