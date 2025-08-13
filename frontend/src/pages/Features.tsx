import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Button,
  Stack,
} from "@mui/material";

import GroupsIcon from "@mui/icons-material/Groups";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DescriptionIcon from "@mui/icons-material/Description";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Link as RouterLink } from "react-router-dom";

const features = [
  {
    icon: <GroupsIcon />,
    title: "Profile & Beneficiaries",
    desc: "Keep personal data and beneficiaries up to date securely.",
  },
  {
    icon: <CreditCardIcon />,
    title: "Payments",
    desc: "See history, statuses, breakdowns, and download statements.",
  },
  {
    icon: <DescriptionIcon />,
    title: "Service Requests",
    desc: "Submit requests, upload documents, track status, and receive responses.",
  },
  {
    icon: <LockOutlinedIcon />,
    title: "Security",
    desc: "MFA-ready, device management, and privacy-by-design defaults.",
  },
];

export default function Features() {
  return (
    <Box sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        <Stack spacing={1} alignItems="center" textAlign="center" sx={{ mb: 4 }}>
          <ShieldOutlinedIcon color="primary" sx={{ fontSize: 36 }} />
          <Typography variant="h4" fontWeight={800}>
            Platform Features
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
            Everything you need to manage your pension—securely and efficiently.
          </Typography>
        </Stack>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {features.map(({ icon, title, desc }) => (
            <Grid item xs={12} sm={6} md={3} key={title}>
              <Card variant="outlined" sx={{ height: "100%", "&:hover": { boxShadow: 3 } }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "primary.main", color: "primary.contrastText" }}>
                      <Box sx={{ "& svg": { fontSize: 22 } }}>{icon}</Box>
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

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Accessibility & Compliance
                </Typography>
                <Stack spacing={1}>
                  <FeatureCheck text="WCAG 2.1 AA alignment" />
                  <FeatureCheck text="ISO-aligned processes" />
                  <FeatureCheck text="Data minimization & encryption at rest/in-transit" />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Get Started
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Sign in to access your account or explore the portal features.
                </Typography>
                <Stack direction="row" spacing={1.5}>
                  <Button component={RouterLink} to="/login" variant="contained">
                    Access your account
                  </Button>
                  <Button component={RouterLink} to="/requests" variant="outlined">
                    Make a request
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function FeatureCheck({ text }: { text: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <CheckCircleOutlineIcon color="primary" fontSize="small" />
      <Typography variant="body2">{text}</Typography>
    </Stack>
  );
}
