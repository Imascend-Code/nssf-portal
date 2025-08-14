import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '../../api/hooks';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, CardHeader, Typography, TextField, Button, InputAdornment, Container, CircularProgress, Grid, Link as MUILink, } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
import { motion } from 'framer-motion';
const schema = z
    .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});
export default function Register() {
    const { mutateAsync, isPending } = useRegister();
    const nav = useNavigate();
    const { register, handleSubmit, formState: { errors }, } = useForm({ resolver: zodResolver(schema) });
    return (_jsx(Box, { sx: {
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            bgcolor: 'background.default',
            backgroundImage: (t) => t.palette.mode === 'light'
                ? 'linear-gradient(135deg, rgba(76,175,80,0.06), rgba(255,152,0,0.06))'
                : 'linear-gradient(135deg, rgba(76,175,80,0.12), rgba(255,152,0,0.12))',
        }, children: _jsx(Container, { maxWidth: "sm", children: _jsx(motion.div, { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.28 }, children: _jsxs(Card, { elevation: 6, sx: { borderRadius: 3, border: '1px solid', borderColor: 'divider' }, children: [_jsx(CardHeader, { title: _jsxs(Box, { textAlign: "center", children: [_jsx(Box, { display: "flex", justifyContent: "center", mb: 1.5, children: _jsx(SecurityIcon, { color: "primary", sx: { fontSize: 40 } }) }), _jsx(Typography, { variant: "h5", component: "h1", children: "Create an account" }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: "Get started with your pension management" })] }) }), _jsx(CardContent, { sx: { pt: 0 }, children: _jsxs(Box, { component: "form", noValidate: true, onSubmit: handleSubmit(async (values) => {
                                    await mutateAsync(values);
                                    nav('/dashboard');
                                }), sx: { display: 'grid', gap: 2.5 }, children: [_jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { id: "firstName", label: "First name", fullWidth: true, error: !!errors.firstName, helperText: errors.firstName?.message, InputProps: {
                                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(PersonIcon, { fontSize: "small" }) })),
                                                    }, ...register('firstName') }) }), _jsx(Grid, { item: true, xs: 12, sm: 6, children: _jsx(TextField, { id: "lastName", label: "Last name", fullWidth: true, error: !!errors.lastName, helperText: errors.lastName?.message, InputProps: {
                                                        startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(PersonIcon, { fontSize: "small" }) })),
                                                    }, ...register('lastName') }) })] }), _jsx(TextField, { id: "email", label: "Email address", type: "email", autoComplete: "email", fullWidth: true, error: !!errors.email, helperText: errors.email?.message, InputProps: {
                                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(MailIcon, { fontSize: "small" }) })),
                                        }, ...register('email') }), _jsx(TextField, { id: "password", label: "Password", type: "password", autoComplete: "new-password", fullWidth: true, error: !!errors.password, helperText: errors.password?.message || 'Must be at least 8 characters with 1 uppercase and 1 number', InputProps: {
                                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(LockIcon, { fontSize: "small" }) })),
                                        }, ...register('password') }), _jsx(TextField, { id: "confirmPassword", label: "Confirm password", type: "password", autoComplete: "new-password", fullWidth: true, error: !!errors.confirmPassword, helperText: errors.confirmPassword?.message, InputProps: {
                                            startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(LockIcon, { fontSize: "small" }) })),
                                        }, ...register('confirmPassword') }), _jsx(Button, { type: "submit", size: "large", variant: "contained", disabled: isPending, sx: { mt: 0.5 }, children: isPending ? (_jsxs(Box, { display: "inline-flex", alignItems: "center", gap: 1, children: [_jsx(CircularProgress, { size: 18, thickness: 5 }), "Creating account..."] })) : ('Create account') }), _jsxs(Typography, { variant: "body2", color: "text.secondary", textAlign: "center", children: ["Already have an account?", ' ', _jsx(MUILink, { component: "button", type: "button", onClick: () => nav('/login'), underline: "hover", children: "Sign in" })] })] }) })] }) }) }) }));
}
