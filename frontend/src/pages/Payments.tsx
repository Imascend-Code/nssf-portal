// src/pages/Payments.tsx
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";

import {
  Box,
  Container,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  CircularProgress,
  Stack,
  Alert,
  Chip,
} from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";

type Payment = {
  id: number;
  period_start: string;
  period_end: string;
  amount: string | number;
  status: "processed" | "pending" | "on_hold" | string;
  paid_at?: string | null;
  reference: string | null;
};

function StatusChip({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  let color: "default" | "success" | "warning" | "error" = "default";
  if (["processed", "success", "completed"].includes(s)) color = "success";
  else if (["pending", "in_progress", "queued", "on_hold"].includes(s)) color = "warning";
  else if (["rejected", "failed", "error"].includes(s)) color = "error";
  return (
    <Chip
      label={status}
      color={color}
      size="small"
      variant="outlined"
      sx={{ textTransform: "capitalize" }}
    />
  );
}

export default function Payments() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => (await api.get<{ results?: Payment[] } | Payment[]>("/payments/")).data,
    staleTime: 60_000,
  });

  const items: Payment[] = Array.isArray(data) ? data : data?.results ?? [];

  const fmtUGX = (n: number | string) =>
    new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX" }).format(Number(n));

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString();

  const handleDownloadStatement = async () => {
    // Uses axios instance so Authorization header is sent
    const resp = await api.get("/documents/statement/", { responseType: "blob" });
    const blob = new Blob([resp.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "statement.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            My Payments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review your payment history and statuses.
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<GetAppIcon />} onClick={handleDownloadStatement}>
          Download Statement
        </Button>
      </Stack>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardHeader
          title={<Typography variant="h6">Payment History</Typography>}
          subheader={
            <Typography variant="body2" color="text.secondary">
              All your past and recent transactions.
            </Typography>
          }
        />
        <CardContent>
          {isLoading && (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <CircularProgress size={28} />
            </Stack>
          )}

          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load payments{(error as any)?.message ? ` — ${(error as any).message}` : ""}.
            </Alert>
          )}

          {!isLoading && !isError && items.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No payments found.
            </Typography>
          )}

          {!isLoading && !isError && items.length > 0 && (
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
                  {items.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell>
                        {fmtDate(p.period_start)} – {fmtDate(p.period_end)}
                      </TableCell>
                      <TableCell>{fmtUGX(p.amount)}</TableCell>
                      <TableCell>
                        <StatusChip status={p.status} />
                      </TableCell>
                      <TableCell>{p.reference || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
