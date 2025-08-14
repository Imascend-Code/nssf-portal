import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Box, Container, Typography } from '@mui/material';
export default function Footer() {
    const year = new Date().getFullYear();
    return (_jsx(Box, { component: "footer", sx: {
            mt: 12,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: (t) => (t.palette.mode === 'light' ? 'background.paper' : 'background.default'),
        }, children: _jsxs(Container, { maxWidth: "lg", sx: { py: 4, textAlign: 'center' }, children: [_jsxs(Typography, { variant: "body2", color: "text.secondary", children: ["\u00A9 ", year, " National Social Security Fund \u2014 Pensioner Self-Service Portal"] }), _jsx(Typography, { variant: "caption", color: "text.secondary", display: "block", sx: { mt: 0.5 }, children: "Secure \u2022 Accessible \u2022 Reliable" })] }) }));
}
