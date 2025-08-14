import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
export default function Root() {
    return (_jsxs(Box, { sx: { minHeight: '100dvh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }, children: [_jsx(Navbar, {}), _jsx(Container, { maxWidth: "lg", component: "main", sx: { flex: 1, py: 3 }, children: _jsx(Outlet, {}) }), _jsx(Footer, {})] }));
}
