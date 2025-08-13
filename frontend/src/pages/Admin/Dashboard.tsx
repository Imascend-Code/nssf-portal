// src/pages/Admin/Dashboard.tsx
import * as React from "react";
import { useReport } from "@/api/hooks";
import {
  Container, Grid, Card, CardHeader, CardContent, Typography,
  Stack, CircularProgress, Alert, Divider
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

function KPI({ label, value, icon }: { label: string; value: React.ReactNode; icon: React.ReactNode }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
      <CardHeader
        title={<Typography variant="subtitle2">{label}</Typography>}
        action={<span style={{ opacity: 0.8 }}>{icon}</span>}
        sx={{ pb: 0.5 }}
      />
      <CardContent sx={{ pt: 1.5 }}>
        <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1 }}>
          {value ?? "—"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Updated moments ago
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const r = useReport();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
        Admin Dashboard
      </Typography>

      {r.isLoading && (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
          <CircularProgress size={28} />
        </Stack>
      )}

      {r.isError && <Alert severity="error">Failed to load report summary.</Alert>}

      {!r.isLoading && !r.isError && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <KPI label="Total Payments" value={r.data?.payments_total} icon={<AttachMoneyIcon />} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <KPI label="Open Requests" value={r.data?.requests_open} icon={<AssignmentIcon />} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <KPI label="Registered Users" value={r.data?.users_total} icon={<PeopleAltIcon />} />
            </Grid>
          </Grid>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardHeader title="Raw Summary (debug)" />
            <Divider />
            <CardContent>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                {JSON.stringify(r.data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
}
