import * as React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '../../api/hooks';
import { useNavigate } from 'react-router-dom';

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
  Grid,
  Link as MUILink,
} from '@mui/material';

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

type FormData = z.infer<typeof schema>;

export default function Register() {
  const { mutateAsync, isPending } = useRegister();
  const nav = useNavigate();

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
                    Create an account
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get started with your pension management
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
                  nav('/dashboard');
                })}
                sx={{ display: 'grid', gap: 2.5 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="firstName"
                      label="First name"
                      fullWidth
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      {...register('firstName')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="lastName"
                      label="Last name"
                      fullWidth
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      {...register('lastName')}
                    />
                  </Grid>
                </Grid>

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
                  autoComplete="new-password"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message || 'Must be at least 8 characters with 1 uppercase and 1 number'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  {...register('password')}
                />

                <TextField
                  id="confirmPassword"
                  label="Confirm password"
                  type="password"
                  autoComplete="new-password"
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  {...register('confirmPassword')}
                />

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
                      Creating account...
                    </Box>
                  ) : (
                    'Create account'
                  )}
                </Button>

                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Already have an account?{' '}
                  <MUILink
                    component="button"
                    type="button"
                    onClick={() => nav('/login')}
                    underline="hover"
                  >
                    Sign in
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
