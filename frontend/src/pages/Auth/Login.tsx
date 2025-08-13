import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/api/hooks';
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
} from '@mui/material';

import SecurityIcon from '@mui/icons-material/Security';
import MailIcon from '@mui/icons-material/Mail';
import LockIcon from '@mui/icons-material/Lock';
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
  const returnTo = loc?.state?.returnTo || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

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
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
        >
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
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit(async (values) => {
                  await mutateAsync(values);
                  nav(returnTo, { replace: true });
                })}
                sx={{ display: 'grid', gap: 2.5 }}
              >
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
                  type="password"
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

                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  disabled={isPending}
                  sx={{ mt: 0.5 }}
                >
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
                  <MUILink
                    component="button"
                    type="button"
                    onClick={() => nav('/register')}
                    underline="hover"
                  >
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
