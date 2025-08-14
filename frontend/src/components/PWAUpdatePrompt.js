import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardActions, Typography, Button, IconButton, Divider, Slide, useTheme, } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SystemUpdateAltRoundedIcon from '@mui/icons-material/SystemUpdateAltRounded';
import { updateSW } from '@/swRegistration';
export default function PWAUpdateCard() {
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    useEffect(() => {
        const onReady = () => setOpen(true);
        window.addEventListener('pwa-update-ready', onReady);
        return () => window.removeEventListener('pwa-update-ready', onReady);
    }, []);
    const handleRefresh = () => {
        setOpen(false);
        updateSW(true); // activates and reloads
    };
    const handleClose = () => setOpen(false);
    return (_jsx(Slide, { in: open, direction: "up", mountOnEnter: true, unmountOnExit: true, children: _jsx(Box, { sx: {
                position: 'fixed',
                right: { xs: 12, sm: 16, md: 24 },
                bottom: { xs: 12, sm: 16, md: 24 },
                zIndex: (t) => t.zIndex.snackbar, // above content, below dialogs
            }, role: "dialog", "aria-label": "Application update available", children: _jsxs(Card, { elevation: 8, sx: {
                    minWidth: 320,
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    backdropFilter: 'blur(6px)',
                    background: theme.palette.mode === 'light'
                        ? 'rgba(255,255,255,0.9)'
                        : 'rgba(17,25,40,0.8)',
                }, children: [_jsxs(Box, { sx: { display: 'flex', alignItems: 'center', p: 1.25, pl: 1.5 }, children: [_jsx(Box, { sx: {
                                    display: 'grid',
                                    placeItems: 'center',
                                    width: 36,
                                    height: 36,
                                    borderRadius: 2,
                                    mr: 1.25,
                                    bgcolor: theme.palette.mode === 'light'
                                        ? 'primary.main'
                                        : 'primary.dark',
                                    color: 'primary.contrastText',
                                }, children: _jsx(SystemUpdateAltRoundedIcon, { fontSize: "small" }) }), _jsxs(Box, { sx: { flex: 1, minWidth: 0 }, children: [_jsx(Typography, { variant: "subtitle2", fontWeight: 700, noWrap: true, children: "Update available" }), _jsx(Typography, { variant: "caption", color: "text.secondary", noWrap: true, children: "A new version of the app is ready." })] }), _jsx(IconButton, { "aria-label": "Dismiss", onClick: handleClose, size: "small", edge: "end", children: _jsx(CloseRoundedIcon, { fontSize: "small" }) })] }), _jsx(Divider, {}), _jsx(CardContent, { sx: { pt: 1.25, pb: 0 }, children: _jsx(Typography, { variant: "body2", children: "Refresh to get the latest features and fixes." }) }), _jsxs(CardActions, { sx: { p: 1.25, pt: 0.75, justifyContent: 'flex-end' }, children: [_jsx(Button, { onClick: handleClose, size: "small", color: "inherit", children: "Later" }), _jsx(Button, { onClick: handleRefresh, size: "small", variant: "contained", startIcon: _jsx(SystemUpdateAltRoundedIcon, { fontSize: "small" }), children: "Refresh" })] })] }) }) }));
}
