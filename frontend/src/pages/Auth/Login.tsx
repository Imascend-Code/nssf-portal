// src/pages/Auth/Login.tsx
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../../api/hooks';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Container,
  CircularProgress,
  Link as MUILink,
  Alert,
  IconButton,
} from '@mui/material';

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
type FormData = z.infer<typeof schema>;

export default function Login() {
  const { mutateAsync, isPending } = useLogin();
  const nav = useNavigate();
  const loc = useLocation() as any;
  const returnTo: string | undefined = loc?.state?.returnTo;
  const fallback = '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const [apiError, setApiError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = async (values: FormData) => {
    setApiError(null);
    try {
      // useLogin returns the "me" payload after storing tokens
      const me: any = await mutateAsync(values);
      const isAdmin = !!(me?.is_superuser || me?.is_staff || me?.role === 'ADMIN');
      const target = isAdmin ? '/admin' : (returnTo || fallback);
      nav(target, { replace: true });
    } catch (err: any) {
      // Common failure shapes: AxiosError with response.data
      const status = err?.response?.status;
      const detail =
        err?.response?.data?.detail ||
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

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.default',
        backgroundImage: (t) =>
          t.palette.mode === 'light'
            ? 'linear-gradient(135deg, rgba(76,175,80,0.06), rgba(255,152,0,0.06))'
            : 'linear-gradient(135deg, rgba(76,175,80,0.12), rgba(255,152,0,0.12))',
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
          <Card elevation={6} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <CardHeader
              title={
                <Box textAlign="center">
                  <Box display="flex" justifyContent="center" mb={1.5}>
                    <SecurityIcon color="primary" sx={{ fontSize: 40 }} />
                  </Box>
                  <Typography variant="h5" component="h1">
                    Welcome back
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sign in to access your pension account
                  </Typography>
                </Box>
              }
            />
            <CardContent sx={{ pt: 0 }}>
              {apiError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {apiError}
                </Alert>
              )}

              <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ display: 'grid', gap: 2.5 }}>
                <TextField
                  id="email"
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  {...register('email')}
                />

                <TextField
                  id="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowPassword((s) => !s)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  {...register('password')}
                />

                <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                  <Button
                    color="inherit"
                    size="small"
                    sx={{ px: 0, minWidth: 0 }}
                    onClick={() => nav('/forgot-password')}
                  >
                    Forgot password?
                  </Button>
                </Box>

                <Button type="submit" size="large" variant="contained" disabled={isPending} sx={{ mt: 0.5 }}>
                  {isPending ? (
                    <Box display="inline-flex" alignItems="center" gap={1}>
                      <CircularProgress size={18} thickness={5} />
                      Signing in...
                    </Box>
                  ) : (
                    'Sign in'
                  )}
                </Button>

                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Don&apos;t have an account?{' '}
                  <MUILink component="button" type="button" onClick={() => nav('/register')} underline="hover">
                    Create one
                  </MUILink>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
}
