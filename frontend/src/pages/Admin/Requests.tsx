import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function StatusChip({ value }: { value: string }) {
  const s = (value || "").toLowerCase();
  let color: "default" | "success" | "warning" | "error" = "default";
  if (["resolved", "closed", "completed", "success"].includes(s)) color = "success";
  else if (["pending", "in_progress", "queued"].includes(s)) color = "warning";
  else if (["rejected", "failed", "error"].includes(s)) color = "error";
  return <Chip size="small" variant="outlined" color={color} label={value} sx={{ textTransform: "capitalize" }} />;
}

type AdminRequest = {
  id: number;
  title: string;
  status: string;
  priority: string;
  category?: { id: number; name: string } | null;
  requester?: { id: number; full_name?: string; email?: string } | null;
  created_at?: string;
};

export default function AdminRequests() {
  const [page, setPage] = React.useState(1);
  const [pageSize] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<string>("");

  const q = useQuery({
     queryKey: ['admin-requests', { page, page_size, search, status }],
  queryFn: fetchAdminRequests,
  placeholderData: (prev) => prev, // ← replaces keepPreviousData
})
  const items: AdminRequest[] = Array.isArray(q.data) ? (q.data as any) : (q.data?.results ?? [])

  // const items: AdminRequest[] = Array.isArray(q.data) ? (q.data as any) : q.data?.results ?? [];
  const total = (q.data as any)?.count ?? items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardHeader title={<Typography variant="h6">All Requests</Typography>} />
        <CardContent>
          {/* Filters */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2 }}>
            <TextField
              placeholder="Search title, requester…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {q.isLoading && (
            <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
              <CircularProgress size={28} />
            </Stack>
          )}

          {q.isError && <Alert severity="error">Failed to load requests.</Alert>}

          {!q.isLoading && !q.isError && (
            <>
              <TableContainer sx={{ borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Requester</TableCell>
                      <TableCell>Created</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.length > 0 ? (
                      items.map((r) => (
                        <TableRow key={r.id} hover>
                          <TableCell>{r.title}</TableCell>
                          <TableCell><StatusChip value={r.status} /></TableCell>
                          <TableCell sx={{ textTransform: "capitalize" }}>{r.priority}</TableCell>
                          <TableCell>{r.category?.name || "—"}</TableCell>
                          <TableCell>
                            {r.requester?.full_name || r.requester?.email || "—"}
                          </TableCell>
                          <TableCell>
                            {r.created_at ? new Date(r.created_at).toLocaleString() : "—"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <Typography variant="body2" color="text.secondary" align="center">
                            No results.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(_, p) => setPage(p)}
                  color="primary"
                  size="small"
                />
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
