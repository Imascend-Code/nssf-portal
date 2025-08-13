// src/pages/Home.tsx
import * as React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Stack,
  Avatar,
  Paper,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';

import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DescriptionIcon from '@mui/icons-material/Description';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import InsightsIcon from '@mui/icons-material/Insights';
import DevicesIcon from '@mui/icons-material/Devices';

type Feature = {
  icon: React.ReactNode;
  title: string;
  desc: string;
};

const featureCards: Feature[] = [
  { icon: <GroupsIcon />, title: 'Profile & Beneficiaries', desc: 'Keep your details up to date securely.' },
  { icon: <CreditCardIcon />, title: 'Payments', desc: 'See history, statuses, and statements.' },
  { icon: <DescriptionIcon />, title: 'Service Requests', desc: 'Submit, track, and download responses.' },
  { icon: <LockOutlinedIcon />, title: 'Security', desc: 'MFA-ready, privacy by design.' },
];

export default function Home() {
  const nav = useNavigate();
  const theme = useTheme();

  const bgLight = 'linear-gradient(135deg, rgba(76,175,80,0.06), rgba(255,152,0,0.06))';
  const bgDark = 'linear-gradient(135deg, rgba(76,175,80,0.12), rgba(255,152,0,0.12))';

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        bgcolor: 'background.default',
        backgroundImage: theme.palette.mode === 'light' ? bgLight : bgDark,
      }}
    >
      {/* HERO (upgraded) */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        {/* Decorative blobs */}
        <Box
          sx={{
            position: 'absolute',
            inset: -120,
            background: `radial-gradient(600px 300px at 10% -10%, ${alpha(theme.palette.primary.main, 0.25)}, transparent 70%),
                         radial-gradient(500px 250px at 110% 20%, ${alpha(theme.palette.warning.main, 0.18)}, transparent 70%)`,
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <Container sx={{ position: 'relative', py: { xs: 6, md: 10 } }}>
          <Grid container spacing={4} alignItems="center">
            {/* Left: Copy */}
            <Grid item xs={12} md={7}>
              <Stack spacing={2.5} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Stack direction="row" spacing={1.5} justifyContent={{ xs: 'center', md: 'flex-start' }} alignItems="center">
                  <ShieldOutlinedIcon color="primary" sx={{ fontSize: 40 }} />
                  <Chip label="Official NSSF Portal" variant="outlined" />
                </Stack>

                <Typography
                  component="h1"
                  sx={{
                    fontWeight: 900,
                    lineHeight: 1.1,
                    letterSpacing: { xs: -0.5, md: -0.8 },
                    fontSize: { xs: 34, sm: 44, md: 52 },
                  }}
                >
                  Manage your pension <Box component="span" sx={{ color: 'primary.main' }}>with confidence</Box>
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ maxWidth: 680, mx: { xs: 'auto', md: 0 } }}
                >
                  Securely access payments, requests, and your profile — anywhere, on any device.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent={{ xs: 'center', md: 'flex-start' }}>
                  <Button size="large" variant="contained" onClick={() => nav('/login')}>
                    Access your account
                  </Button>
                  <Button size="large" variant="outlined" onClick={() => nav('/features')}>
                    Explore features
                  </Button>
                </Stack>

                {/* Trust chips */}
                <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', md: 'flex-start' }} flexWrap="wrap">
                  {['ISO-aligned', 'WCAG AA', 'Data privacy'].map((label) => (
                    <Chip
                      key={label}
                      variant="outlined"
                      icon={<CheckCircleOutlineIcon />}
                      label={label}
                      sx={{ '& .MuiChip-icon': { color: 'primary.main' } }}
                    />
                  ))}
                </Stack>
              </Stack>
            </Grid>

            {/* Right: Visual panel */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={6}
                sx={{
                  borderRadius: 3,
                  p: 3,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <VerifiedUserIcon color="primary" />
                    <Typography variant="subtitle1" fontWeight={700}>
                      Secure by design
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Multi-factor ready, session protection, and encrypted transport for your data.
                  </Typography>
                  <Divider />
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', width: 40, height: 40 }}>
                      <DevicesIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>Access anywhere</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Desktop • Mobile • Tablet
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'warning.main', color: 'warning.contrastText', width: 40, height: 40 }}>
                      <InsightsIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>Real-time status</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Requests and payments, always up to date
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container sx={{ pb: { xs: 6, md: 10 } }}>
        <Grid container spacing={3}>
          {featureCards.map(({ icon, title, desc }) => (
            <Grid item xs={12} sm={6} lg={3} key={title}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  transition: 'box-shadow .2s, transform .2s',
                  '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        width: 40,
                        height: 40,
                      }}
                    >
                      <Box sx={{ '& svg': { fontSize: 22 } }}>{icon}</Box>
                    </Avatar>
                  }
                  title={<Typography variant="subtitle1">{title}</Typography>}
                  subheader={
                    <Typography variant="body2" color="text.secondary">
                      {desc}
                    </Typography>
                  }
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      
    </Box>
  );
}
