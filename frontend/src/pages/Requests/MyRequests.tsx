import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useMyRequests } from "@/api/hooks";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Stack,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function StatusChip({ value }: { value: string }) {
  const s = (value || "").toLowerCase();
  let color: "default" | "success" | "warning" | "error" = "default";
  if (["resolved", "closed", "completed", "success"].includes(s)) color = "success";
  else if (["pending", "in_progress", "queued"].includes(s)) color = "warning";
  else if (["rejected", "failed", "error"].includes(s)) color = "error";
  return <Chip size="small" variant="outlined" color={color} label={value} sx={{ textTransform: "capitalize" }} />;
}

export default function MyRequests() {
  const q = useMyRequests();
  const items: any[] = Array.isArray(q.data) ? q.data : q.data?.results ?? [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardHeader
          title={<Typography variant="h6">My Requests</Typography>}
          action={
            <Button component={RouterLink} to="/requests/new" variant="contained" startIcon={<AddIcon />}>
              New request
            </Button>
          }
        />
        <CardContent>
          {q.isLoading && (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
              <CircularProgress size={28} />
            </Stack>
          )}

          {q.isError && <Alert severity="error">Failed to load your requests.</Alert>}

          {!q.isLoading && !q.isError && (
            <TableContainer sx={{ borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.length > 0 ? (
                    items.map((r: any) => (
                      <TableRow key={r.id} hover>
                        <TableCell>
                          <Button
                            component={RouterLink}
                            to={`/requests/${r.id}`}
                            variant="text"
                            size="small"
                            sx={{ textDecoration: "underline", px: 0 }}
                          >
                            {r.title}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <StatusChip value={r.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No requests yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
