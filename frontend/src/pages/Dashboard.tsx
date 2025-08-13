// src/pages/Dashboard.tsx
import * as React from 'react';
import { useProfile, usePayments, useMyRequests } from '@/api/hooks';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';

import {
  Box,
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Chip,
  CircularProgress,
  Stack,
  Avatar,
} from '@mui/material';

import CreditCardIcon from '@mui/icons-material/CreditCard';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

function StatusChip({ status }: { status: string }) {
  const s = (status || '').toLowerCase();
  let color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' = 'default';
  if (['processed', 'resolved', 'closed', 'success', 'completed'].includes(s)) color = 'success';
  else if (['pending', 'in_progress', 'queued'].includes(s)) color = 'warning';
  else if (['rejected', 'failed', 'error'].includes(s)) color = 'error';
  return <Chip label={status} color={color} size="small" variant="outlined" sx={{ textTransform: 'capitalize' }} />;
}

const fmtUGX = (n: number | string) =>
  new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(
    typeof n === 'string' ? Number(n) : n ?? 0
  );

export default function Dashboard() {
  // Profile (beneficiaries, etc.)
  const { data: profile } = useProfile();

  // NEW: Users/me for balance (read from /api/v1/users/me/)
  const me = useQuery({
    queryKey: ['users-me'],
    queryFn: async () => (await api.get('/users/me/')).data as { full_name?: string; balance?: number | string },
    staleTime: 5 * 60 * 1000,
  });

  // Data
  const payments = usePayments({ page_size: 5 });
  const requests = useMyRequests({ page_size: 5 });

  const pendingRequestsCount = (requests.data?.results || []).filter(
    (r: any) => r.status !== 'resolved' && r.status !== 'closed'
  ).length;

  const kpis = [
    { title: 'Balance', value: fmtUGX(me.data?.balance ?? 0), icon: <AccountBalanceWalletIcon /> },
    { title: 'Total Payments', value: payments.data?.length ?? 0, icon: <CreditCardIcon /> },
    { title: 'Pending Requests', value: pendingRequestsCount, icon: <DescriptionIcon /> },
    { title: 'Beneficiaries', value: profile?.beneficiaries_count ?? 0, icon: <GroupsIcon /> },
  ];

  const [tab, setTab] = React.useState<'payments' | 'requests'>('payments');

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Welcome back{(me.data?.full_name || profile?.full_name) ? `, ${me.data?.full_name ?? profile?.full_name}` : ''}!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Overview of your account activity and contributions.
        </Typography>
      </Box>

      {/* KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {kpis.map((k, i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            <Card variant="outlined" sx={{ borderRadius: 3, height: '100%' }}>
              <CardHeader
                title={<Typography variant="subtitle2">{k.title}</Typography>}
                action={<Avatar sx={{ width: 28, height: 28, bgcolor: 'action.hover' }}>{k.icon}</Avatar>}
                sx={{ pb: 0.5 }}
              />
              <CardContent sx={{ pt: 1.5 }}>
                <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1 }}>
                  {k.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Updated just now
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardHeader
          title={
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              aria-label="dashboard tabs"
              sx={{ minHeight: 0, '& .MuiTab-root': { py: 1, textTransform: 'none' } }}
            >
              <Tab value="payments" label="Recent Payments" />
              <Tab value="requests" label="Recent Requests" />
            </Tabs>
          }
          sx={{ pb: 0 }}
        />

        <CardContent>
          {/* Payments Tab */}
          {tab === 'payments' && (
            <Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                Payments
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Your latest transactions
              </Typography>

              {payments.isLoading ? (
                <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
                  <CircularProgress size={28} />
                </Stack>
              ) : payments.data?.length ? (
                <TableContainer sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Period</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Reference</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {payments.data.map((p: any) => (
                        <TableRow key={p.id} hover>
                          <TableCell>
                            {p.period_start} – {p.period_end}
                          </TableCell>
                          <TableCell>{fmtUGX(p.amount)}</TableCell>
                          <TableCell>
                            <StatusChip status={p.status} />
                          </TableCell>
                          <TableCell>{p.reference || '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No payments found.
                </Typography>
              )}
            </Box>
          )}

          {/* Requests Tab */}
          {tab === 'requests' && (
            <Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                Requests
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Latest service requests
              </Typography>

              {requests.isLoading ? (
                <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
                  <CircularProgress size={28} />
                </Stack>
              ) : (requests.data?.results || []).length ? (
                <TableContainer sx={{ borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Priority</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {requests.data.results.map((r: any) => (
                        <TableRow key={r.id} hover>
                          <TableCell sx={{ fontWeight: 600 }}>{r.title}</TableCell>
                          <TableCell>{r.category?.name || '—'}</TableCell>
                          <TableCell>
                            <StatusChip status={r.status} />
                          </TableCell>
                          <TableCell sx={{ textTransform: 'capitalize' }}>{r.priority}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No requests yet.
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
