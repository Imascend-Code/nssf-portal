import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Container, Typography, Grid, Card, CardHeader, CardContent, Avatar, Button, Stack, } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DescriptionIcon from "@mui/icons-material/Description";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Link as RouterLink } from "react-router-dom";
const features = [
    {
        icon: _jsx(GroupsIcon, {}),
        title: "Profile & Beneficiaries",
        desc: "Keep personal data and beneficiaries up to date securely.",
    },
    {
        icon: _jsx(CreditCardIcon, {}),
        title: "Payments",
        desc: "See history, statuses, breakdowns, and download statements.",
    },
    {
        icon: _jsx(DescriptionIcon, {}),
        title: "Service Requests",
        desc: "Submit requests, upload documents, track status, and receive responses.",
    },
    {
        icon: _jsx(LockOutlinedIcon, {}),
        title: "Security",
        desc: "MFA-ready, device management, and privacy-by-design defaults.",
    },
];
export default function Features() {
    return (_jsx(Box, { sx: { py: { xs: 4, md: 8 } }, children: _jsxs(Container, { maxWidth: "lg", children: [_jsxs(Stack, { spacing: 1, alignItems: "center", textAlign: "center", sx: { mb: 4 }, children: [_jsx(ShieldOutlinedIcon, { color: "primary", sx: { fontSize: 36 } }), _jsx(Typography, { variant: "h4", fontWeight: 800, children: "Platform Features" }), _jsx(Typography, { variant: "body1", color: "text.secondary", sx: { maxWidth: 720 }, children: "Everything you need to manage your pension\u2014securely and efficiently." })] }), _jsx(Grid, { container: true, spacing: 3, sx: { mb: 4 }, children: features.map(({ icon, title, desc }) => (_jsx(Grid, { item: true, xs: 12, sm: 6, md: 3, children: _jsx(Card, { variant: "outlined", sx: { height: "100%", "&:hover": { boxShadow: 3 } }, children: _jsx(CardHeader, { avatar: _jsx(Avatar, { sx: { bgcolor: "primary.main", color: "primary.contrastText" }, children: _jsx(Box, { sx: { "& svg": { fontSize: 22 } }, children: icon }) }), title: _jsx(Typography, { variant: "subtitle1", children: title }), subheader: _jsx(Typography, { variant: "body2", color: "text.secondary", children: desc }) }) }) }, title))) }), _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { variant: "outlined", children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Accessibility & Compliance" }), _jsxs(Stack, { spacing: 1, children: [_jsx(FeatureCheck, { text: "WCAG 2.1 AA alignment" }), _jsx(FeatureCheck, { text: "ISO-aligned processes" }), _jsx(FeatureCheck, { text: "Data minimization & encryption at rest/in-transit" })] })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 6, children: _jsx(Card, { variant: "outlined", children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h6", gutterBottom: true, children: "Get Started" }), _jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 }, children: "Sign in to access your account or explore the portal features." }), _jsxs(Stack, { direction: "row", spacing: 1.5, children: [_jsx(Button, { component: RouterLink, to: "/login", variant: "contained", children: "Access your account" }), _jsx(Button, { component: RouterLink, to: "/requests", variant: "outlined", children: "Make a request" })] })] }) }) })] })] }) }));
}
function FeatureCheck({ text }) {
    return (_jsxs(Stack, { direction: "row", spacing: 1, alignItems: "center", children: [_jsx(CheckCircleOutlineIcon, { color: "primary", fontSize: "small" }), _jsx(Typography, { variant: "body2", children: text })] }));
}
