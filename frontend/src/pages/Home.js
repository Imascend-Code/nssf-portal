import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Card, CardHeader, Chip, Stack, Avatar, Paper, Divider, useTheme, alpha, } from '@mui/material';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DescriptionIcon from '@mui/icons-material/Description';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import InsightsIcon from '@mui/icons-material/Insights';
import DevicesIcon from '@mui/icons-material/Devices';
const featureCards = [
    { icon: _jsx(GroupsIcon, {}), title: 'Profile & Beneficiaries', desc: 'Keep your details up to date securely.' },
    { icon: _jsx(CreditCardIcon, {}), title: 'Payments', desc: 'See history, statuses, and statements.' },
    { icon: _jsx(DescriptionIcon, {}), title: 'Service Requests', desc: 'Submit, track, and download responses.' },
    { icon: _jsx(LockOutlinedIcon, {}), title: 'Security', desc: 'MFA-ready, privacy by design.' },
];
export default function Home() {
    const nav = useNavigate();
    const theme = useTheme();
    const bgLight = 'linear-gradient(135deg, rgba(76,175,80,0.06), rgba(255,152,0,0.06))';
    const bgDark = 'linear-gradient(135deg, rgba(76,175,80,0.12), rgba(255,152,0,0.12))';
    return (_jsxs(Box, { sx: {
            minHeight: '100dvh',
            bgcolor: 'background.default',
            backgroundImage: theme.palette.mode === 'light' ? bgLight : bgDark,
        }, children: [_jsxs(Box, { sx: { position: 'relative', overflow: 'hidden' }, children: [_jsx(Box, { sx: {
                            position: 'absolute',
                            inset: -120,
                            background: `radial-gradient(600px 300px at 10% -10%, ${alpha(theme.palette.primary.main, 0.25)}, transparent 70%),
                         radial-gradient(500px 250px at 110% 20%, ${alpha(theme.palette.warning.main, 0.18)}, transparent 70%)`,
                            filter: 'blur(40px)',
                            pointerEvents: 'none',
                        } }), _jsx(Container, { sx: { position: 'relative', py: { xs: 6, md: 10 } }, children: _jsxs(Grid, { container: true, spacing: 4, alignItems: "center", children: [_jsx(Grid, { item: true, xs: 12, md: 7, children: _jsxs(Stack, { spacing: 2.5, sx: { textAlign: { xs: 'center', md: 'left' } }, children: [_jsxs(Stack, { direction: "row", spacing: 1.5, justifyContent: { xs: 'center', md: 'flex-start' }, alignItems: "center", children: [_jsx(ShieldOutlinedIcon, { color: "primary", sx: { fontSize: 40 } }), _jsx(Chip, { label: "Official NSSF Portal", variant: "outlined" })] }), _jsxs(Typography, { component: "h1", sx: {
                                                    fontWeight: 900,
                                                    lineHeight: 1.1,
                                                    letterSpacing: { xs: -0.5, md: -0.8 },
                                                    fontSize: { xs: 34, sm: 44, md: 52 },
                                                }, children: ["Manage your pension ", _jsx(Box, { component: "span", sx: { color: 'primary.main' }, children: "with confidence" })] }), _jsx(Typography, { variant: "body1", color: "text.secondary", sx: { maxWidth: 680, mx: { xs: 'auto', md: 0 } }, children: "Securely access payments, requests, and your profile \u2014 anywhere, on any device." }), _jsxs(Stack, { direction: { xs: 'column', sm: 'row' }, spacing: 1.5, justifyContent: { xs: 'center', md: 'flex-start' }, children: [_jsx(Button, { size: "large", variant: "contained", onClick: () => nav('/login'), children: "Access your account" }), _jsx(Button, { size: "large", variant: "outlined", onClick: () => nav('/features'), children: "Explore features" })] }), _jsx(Stack, { direction: "row", spacing: 1, justifyContent: { xs: 'center', md: 'flex-start' }, flexWrap: "wrap", children: ['ISO-aligned', 'WCAG AA', 'Data privacy'].map((label) => (_jsx(Chip, { variant: "outlined", icon: _jsx(CheckCircleOutlineIcon, {}), label: label, sx: { '& .MuiChip-icon': { color: 'primary.main' } } }, label))) })] }) }), _jsx(Grid, { item: true, xs: 12, md: 5, children: _jsx(Paper, { elevation: 6, sx: {
                                            borderRadius: 3,
                                            p: 3,
                                            bgcolor: 'background.paper',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                        }, children: _jsxs(Stack, { spacing: 2, children: [_jsxs(Stack, { direction: "row", spacing: 1.5, alignItems: "center", children: [_jsx(VerifiedUserIcon, { color: "primary" }), _jsx(Typography, { variant: "subtitle1", fontWeight: 700, children: "Secure by design" })] }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Multi-factor ready, session protection, and encrypted transport for your data." }), _jsx(Divider, {}), _jsxs(Stack, { direction: "row", spacing: 2, alignItems: "center", children: [_jsx(Avatar, { sx: { bgcolor: 'primary.main', color: 'primary.contrastText', width: 40, height: 40 }, children: _jsx(DevicesIcon, {}) }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", fontWeight: 600, children: "Access anywhere" }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "Desktop \u2022 Mobile \u2022 Tablet" })] })] }), _jsxs(Stack, { direction: "row", spacing: 2, alignItems: "center", children: [_jsx(Avatar, { sx: { bgcolor: 'warning.main', color: 'warning.contrastText', width: 40, height: 40 }, children: _jsx(InsightsIcon, {}) }), _jsxs(Box, { children: [_jsx(Typography, { variant: "body2", fontWeight: 600, children: "Real-time status" }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "Requests and payments, always up to date" })] })] })] }) }) })] }) })] }), _jsx(Container, { sx: { pb: { xs: 6, md: 10 } }, children: _jsx(Grid, { container: true, spacing: 3, children: featureCards.map(({ icon, title, desc }) => (_jsx(Grid, { item: true, xs: 12, sm: 6, lg: 3, children: _jsx(Card, { variant: "outlined", sx: {
                                height: '100%',
                                transition: 'box-shadow .2s, transform .2s',
                                '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                            }, children: _jsx(CardHeader, { avatar: _jsx(Avatar, { sx: {
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        width: 40,
                                        height: 40,
                                    }, children: _jsx(Box, { sx: { '& svg': { fontSize: 22 } }, children: icon }) }), title: _jsx(Typography, { variant: "subtitle1", children: title }), subheader: _jsx(Typography, { variant: "body2", color: "text.secondary", children: desc }) }) }) }, title))) }) })] }));
}
