import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Auth/Login.tsx
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../../api/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, CardHeader, Typography, TextField, Button, InputAdornment, Container, CircularProgress, Link as MUILink, Alert, IconButton, } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { motion } from 'framer-motion';
const schema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
export default function Login() {
    const { mutateAsync, isPending } = useLogin();
    const nav = useNavigate();
    const loc = useLocation();
    const returnTo = loc?.state?.returnTo;
    const fallback = '/dashboard';
    const { register, handleSubmit, formState: { errors }, setError, } = useForm({ resolver: zodResolver(schema) });
    const [apiError, setApiError] = React.useState(null);
    const [showPassword, setShowPassword] = React.useState(false);
    const onSubmit = async (values) => {
        setApiError(null);
        try {
            // useLogin returns the "me" payload after storing tokens
            const me = await mutateAsync(values);
            const isAdmin = !!(me?.is_superuser || me?.is_staff || me?.role === 'ADMIN');
            const target = isAdmin ? '/admin' : (returnTo || fallback);
            nav(target, { replace: true });
        }
        catch (err) {
            // Common failure shapes: AxiosError with response.data
            const status = err?.response?.status;
            const detail = err?.response?.data?.detail ||
                err?.response?.data?.non_field_errors?.[0] ||
                err?.message ||
                'Login failed. Please try again.';
            // Show a top banner + mark fields
            setApiError(detail);
            if (status === 400 || status === 401) {
                setError('email', { type: 'server', message: 'Check your email or password' }, { shouldFocus: true });
                setError('password', { type: 'server', message: 'Check your email or password' });
            }
        }
    };
    return (_jsx(Box, { sx: {
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'background.default',
            backgroundImage: (t) => t.palette.mode === 'light'
                ? 'linear-gradient(135deg, rgba(76,175,80,0.06), rgba(255,152,0,0.06))'
                : 'linear-gradient(135deg, rgba(76,175,80,0.12), rgba(255,152,0,0.12))',
            px: 2,
        }, children: _jsx(Container, { maxWidth: "sm", children: _jsx(motion.div, { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.28 }, children: _jsxs(Card, { elevation: 6, sx: { borderRadius: 3, border: '1px solid', borderColor: 'divider' }, children: [_jsx(CardHeader, { title: _jsxs(Box, { textAlign: "center", children: [_jsx(Box, { display: "flex", justifyContent: "center", mb: 1.5, children: _jsx(SecurityIcon, { color: "primary", sx: { fontSize: 40 } }) }), _jsx(Typography, { variant: "h5", component: "h1", children: "Welcome back" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Sign in to access your pension account" })] }) }), _jsxs(CardContent, { sx: { pt: 0 }, children: [apiError && (_jsx(Alert, { severity: "error", sx: { mb: 2 }, children: apiError })), _jsxs(Box, { component: "form", noValidate: true, onSubmit: handleSubmit(onSubmit), sx: { display: 'grid', gap: 2.5 }, children: [_jsx(TextField, { id: "email", label: "Email address", type: "email", autoComplete: "email", fullWidth: true, error: !!errors.email, helperText: errors.email?.message, InputProps: {
                                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(MailIcon, { fontSize: "small" }) })),
                                            }, ...register('email') }), _jsx(TextField, { id: "password", label: "Password", type: showPassword ? 'text' : 'password', autoComplete: "current-password", fullWidth: true, error: !!errors.password, helperText: errors.password?.message, InputProps: {
                                                startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(LockIcon, { fontSize: "small" }) })),
                                                endAdornment: (_jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { "aria-label": showPassword ? 'Hide password' : 'Show password', onClick: () => setShowPassword((s) => !s), edge: "end", children: showPassword ? _jsx(VisibilityOff, {}) : _jsx(Visibility, {}) }) })),
                                            }, ...register('password') }), _jsx(Box, { display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.5, children: _jsx(Button, { color: "inherit", size: "small", sx: { px: 0, minWidth: 0 }, onClick: () => nav('/forgot-password'), children: "Forgot password?" }) }), _jsx(Button, { type: "submit", size: "large", variant: "contained", disabled: isPending, sx: { mt: 0.5 }, children: isPending ? (_jsxs(Box, { display: "inline-flex", alignItems: "center", gap: 1, children: [_jsx(CircularProgress, { size: 18, thickness: 5 }), "Signing in..."] })) : ('Sign in') }), _jsxs(Typography, { variant: "body2", color: "text.secondary", textAlign: "center", children: ["Don't have an account?", ' ', _jsx(MUILink, { component: "button", type: "button", onClick: () => nav('/register'), underline: "hover", children: "Create one" })] })] })] })] }) }) }) }));
}
