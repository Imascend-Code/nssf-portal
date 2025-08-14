import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/layout/Navbar.tsx
import * as React from 'react';
import { Link as RouterLink, NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Button, Box, Stack, Typography, Avatar, Menu, MenuItem, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme, Tooltip, Container } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LockIcon from '@mui/icons-material/Lock';
import PaymentsIcon from '@mui/icons-material/Payments';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ThemeToggle from '../ui/ThemeToggle';
import { useAuthStore } from '@/store/auth';
/** Public-only items (hide when logged in) */
const PUBLIC_ONLY = [
    { to: '/features', label: 'Features', icon: _jsx(StarOutlineIcon, { fontSize: "small" }) },
    { to: '/support', label: 'Support', icon: _jsx(HelpOutlineIcon, { fontSize: "small" }) },
];
/** Common items (show for everyone) */
const COMMON = [
    { to: '/payments', label: 'Payments', icon: _jsx(PaymentsIcon, { fontSize: "small" }) },
    { to: '/requests', label: 'Requests', icon: _jsx(RequestPageIcon, { fontSize: "small" }) },
    { to: '/reports', label: 'Reports', icon: _jsx(ReceiptLongIcon, { fontSize: "small" }) },
];
/** Admin items (only for admins) */
const ADMIN_ONLY = [
    { to: '/admin', label: 'Admin', icon: _jsx(AdminPanelSettingsIcon, { fontSize: "small" }) },
    { to: '/admin/requests', label: 'Admin Requests', icon: _jsx(RequestPageIcon, { fontSize: "small" }) },
    { to: '/admin/users', label: 'Admin Users', icon: _jsx(PersonIcon, { fontSize: "small" }) },
    { to: '/admin/reports', label: 'Admin Reports', icon: _jsx(ReceiptLongIcon, { fontSize: "small" }) },
];
// Button that renders a NavLink with active styles
const NavLinkButton = ({ to, children }) => (_jsx(Button, { component: NavLink, to: to, disableElevation: true, sx: {
        px: 1.5, py: 0.75, borderRadius: 1.5, typography: 'body2',
        // style prop goes to NavLink (receives isActive)
        style: ({ isActive }) => ({
            backgroundColor: isActive ? 'rgba(0,0,0,0.08)' : 'transparent',
        }),
        color: 'text.secondary',
        '&.active, &:hover': { color: 'text.primary' },
    }, children: children }));
export default function Navbar() {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    // User menu
    const [menuEl, setMenuEl] = React.useState(null);
    const menuOpen = Boolean(menuEl);
    const handleAvatarClick = (e) => setMenuEl(e.currentTarget);
    const closeMenu = () => setMenuEl(null);
    // Mobile drawer
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const displayName = user?.full_name || user?.email || '';
    const initials = (displayName || 'NA').slice(0, 2).toUpperCase();
    const isAdmin = !!user && (user.is_superuser || user.is_staff || user.role === 'ADMIN');
    /** Build nav items based on auth/admin status */
    const navItems = React.useMemo(() => {
        const base = [...COMMON];
        if (!user)
            base.unshift(...PUBLIC_ONLY);
        if (isAdmin)
            base.push(...ADMIN_ONLY);
        return base;
    }, [user, isAdmin]);
    return (_jsxs(AppBar, { position: "sticky", elevation: 0, sx: {
            backdropFilter: 'blur(8px)',
            backgroundColor: (t) => t.palette.mode === 'light'
                ? 'rgba(255,255,255,0.7)'
                : 'rgba(10,37,64,0.7)',
            borderBottom: '1px solid',
            borderColor: 'divider',
        }, children: [_jsx(Container, { maxWidth: "lg", children: _jsxs(Toolbar, { disableGutters: true, sx: { minHeight: 64, gap: 1 }, children: [_jsx(Button, { component: RouterLink, to: "/", color: "inherit", startIcon: _jsx(SecurityIcon, {}), sx: { fontWeight: 600, letterSpacing: 0.2 }, children: "NSSF Pensioner" }), isDesktop && (_jsx(Stack, { direction: "row", spacing: 0.5, sx: { ml: 1 }, children: navItems.map((item) => (_jsx(NavLinkButton, { to: item.to, children: item.label }, item.to))) })), _jsx(Box, { sx: { flex: 1 } }), isDesktop ? (_jsx(Stack, { direction: "row", spacing: 1, alignItems: "center", children: user ? (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "outlined", size: "small", onClick: () => navigate('/dashboard'), startIcon: _jsx(DashboardIcon, {}), children: "Dashboard" }), _jsx(Button, { variant: "outlined", size: "small", onClick: () => navigate(isAdmin ? '/admin/reports' : '/reports'), startIcon: _jsx(ReceiptLongIcon, {}), children: "Reports" }), _jsx(ThemeToggle, {}), _jsx(Typography, { variant: "body2", sx: {
                                            maxWidth: 220,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }, title: displayName, children: displayName }), _jsx(Tooltip, { title: displayName, children: _jsx(IconButton, { onClick: handleAvatarClick, size: "small", "aria-label": "account menu", children: _jsx(Avatar, { sx: { width: 32, height: 32 }, children: initials }) }) }), _jsxs(Menu, { anchorEl: menuEl, open: menuOpen, onClose: closeMenu, transformOrigin: { horizontal: 'right', vertical: 'top' }, anchorOrigin: { horizontal: 'right', vertical: 'bottom' }, children: [_jsxs(MenuItem, { onClick: () => {
                                                    closeMenu();
                                                    navigate('/profile');
                                                }, children: [_jsx(ListItemIcon, { children: _jsx(PersonIcon, { fontSize: "small" }) }), "Profile"] }), _jsxs(MenuItem, { onClick: () => {
                                                    closeMenu();
                                                    navigate('/dashboard');
                                                }, children: [_jsx(ListItemIcon, { children: _jsx(DashboardIcon, { fontSize: "small" }) }), "Dashboard"] }), _jsxs(MenuItem, { onClick: () => {
                                                    closeMenu();
                                                    navigate(isAdmin ? '/admin/reports' : '/reports');
                                                }, children: [_jsx(ListItemIcon, { children: _jsx(ReceiptLongIcon, { fontSize: "small" }) }), "Reports"] })] }), _jsx(Button, { variant: "text", color: "error", size: "small", startIcon: _jsx(LogoutIcon, {}), onClick: () => {
                                            logout();
                                            navigate('/login', { replace: true });
                                        }, children: "Logout" })] })) : (_jsxs(_Fragment, { children: [_jsx(ThemeToggle, {}), _jsx(Button, { size: "small", variant: "contained", onClick: () => navigate('/login'), startIcon: _jsx(LockIcon, {}), children: "Sign in" })] })) })) : (
                        // Mobile: theme toggle + hamburger
                        _jsxs(Stack, { direction: "row", spacing: 0.5, alignItems: "center", children: [_jsx(ThemeToggle, {}), _jsx(IconButton, { onClick: () => setDrawerOpen(true), "aria-label": "open menu", children: _jsx(MenuIcon, {}) })] }))] }) }), _jsx(Drawer, { open: drawerOpen, onClose: () => setDrawerOpen(false), children: _jsxs(Box, { sx: { width: 300, p: 1.5 }, children: [_jsxs(Box, { sx: { px: 1, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }, children: [_jsx(SecurityIcon, { color: "primary" }), _jsx(Typography, { variant: "h6", sx: { flex: 1 }, children: "NSSF Pensioner" })] }), user && (_jsxs(Box, { sx: { px: 1.5, pb: 1.5, display: 'flex', alignItems: 'center', gap: 1.25 }, children: [_jsx(Avatar, { children: initials }), _jsxs(Box, { sx: { minWidth: 0 }, children: [_jsx(Typography, { variant: "body2", sx: { fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }, title: displayName, children: displayName }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "Signed in" })] })] })), _jsx(Divider, { sx: { my: 1 } }), _jsx(List, { sx: { pt: 0 }, children: navItems.map((item) => (_jsxs(ListItemButton, { component: NavLink, to: item.to, onClick: () => setDrawerOpen(false), 
                                // style receives isActive from NavLink
                                style: ({ isActive }) => ({
                                    background: isActive ? 'rgba(0,0,0,0.06)' : 'transparent',
                                }), children: [item.icon && _jsx(ListItemIcon, { children: item.icon }), _jsx(ListItemText, { primary: item.label })] }, item.to))) }), _jsx(Divider, { sx: { my: 1 } }), _jsx(Box, { sx: { px: 1.5, py: 1 }, children: user ? (_jsxs(Stack, { spacing: 1, children: [_jsx(Button, { fullWidth: true, variant: "contained", startIcon: _jsx(DashboardIcon, {}), onClick: () => {
                                            setDrawerOpen(false);
                                            navigate('/dashboard');
                                        }, children: "Dashboard" }), _jsx(Button, { fullWidth: true, variant: "outlined", startIcon: _jsx(ReceiptLongIcon, {}), onClick: () => {
                                            setDrawerOpen(false);
                                            navigate(isAdmin ? '/admin/reports' : '/reports');
                                        }, children: "Reports" }), _jsx(Button, { fullWidth: true, variant: "outlined", startIcon: _jsx(PersonIcon, {}), onClick: () => {
                                            setDrawerOpen(false);
                                            navigate('/profile');
                                        }, children: "Profile" }), _jsx(Button, { fullWidth: true, color: "error", variant: "text", startIcon: _jsx(LogoutIcon, {}), onClick: () => {
                                            setDrawerOpen(false);
                                            logout();
                                            navigate('/login', { replace: true });
                                        }, children: "Logout" })] })) : (_jsx(Button, { fullWidth: true, variant: "contained", startIcon: _jsx(LockIcon, {}), onClick: () => {
                                    setDrawerOpen(false);
                                    navigate('/login');
                                }, children: "Sign in" })) })] }) })] }));
}
