// src/pages/Admin/Users.tsx
import * as React from "react";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Stack,
  Alert,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  Box,
  Tooltip,
  CircularProgress,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/client";
import { useAuthStore } from "@/store/auth";

type Role = "PENSIONER" | "STAFF" | "ADMIN";
type AdminMember = {
  id: number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  role?: Role | string;
  nssf_number?: string | null;
  balance?: string | number | null;
  is_active: boolean;
  date_joined?: string;
};

type Paged<T> = {
  results?: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
};

const EP = {
  MEMBERS: "/members/",
};

function asArray<T>(payload: Paged<T> | T[] | undefined | null): T[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  return payload.results ?? [];
}

function formatMoney(v: string | number | null | undefined) {
  if (v === null || v === undefined || v === "") return "—";
  const num = typeof v === "string" ? Number(v) : v;
  if (Number.isNaN(num)) return String(v);
  // UGX formatting by default; change as needed
  return new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX" }).format(num);
}

export default function AdminUsers() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = !!user && (user.is_superuser || user.is_staff || user.role === "ADMIN");

  // Local state for filters & pagination
  const [search, setSearch] = React.useState("");
  const [role, setRole] = React.useState<"" | Role>("");
  const [status, setStatus] = React.useState<"" | "active" | "inactive">("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Build params for API
  const params = React.useMemo(() => {
    const p: Record<string, any> = {
      page: page + 1, // DRF pages are 1-indexed
      page_size: rowsPerPage,
    };
    if (search.trim()) p.search = search.trim();
    if (role) p.role = role;
    if (status) p.is_active = status === "active" ? "true" : "false";
    return p;
  }, [search, role, status, page, rowsPerPage]);

  // Query users
  const q = useQuery({
    queryKey: ["admin-members", params],
    enabled: isAdmin, // only admins should hit this
    queryFn: async () => (await api.get<Paged<AdminMember>>(EP.MEMBERS, { params })).data,
    keepPreviousData: true,
  });

  const qc = useQueryClient();

  // Mutations
  const toggleActive = useMutation({
    mutationFn: async (payload: { id: number; is_active: boolean }) =>
      (await api.patch(`${EP.MEMBERS}${payload.id}/`, { is_active: payload.is_active })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-members"] }),
  });

  const saveBalance = useMutation({
    mutationFn: async (payload: { id: number; balance: number }) =>
      (await api.patch(`${EP.MEMBERS}${payload.id}/`, { balance: payload.balance })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-members"] }),
  });

  // Inline balance editing state
  const [editing, setEditing] = React.useState<Record<number, string>>({});
  const items = asArray(q.data);
  const total = (q.data as Paged<AdminMember> | undefined)?.count ?? items.length;

  // Handlers
  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  if (!isAdmin) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Admin access required.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardHeader
          title={<Typography variant="h6">Users</Typography>}
          action={
            <Tooltip title="Refresh">
              <span>
                <IconButton onClick={() => qc.invalidateQueries({ queryKey: ["admin-members"] })} disabled={q.isFetching}>
                  {q.isFetching ? <CircularProgress size={18} /> : <RefreshIcon />}
                </IconButton>
              </span>
            </Tooltip>
          }
        />
        <CardContent>
          {/* Filters */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder="Search email or name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 240 }}
            />

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                label="Role"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value as any);
                  setPage(0);
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="PENSIONER">Pensioner</MenuItem>
                <MenuItem value="STAFF">Staff</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as any);
                  setPage(0);
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {/* Errors */}
          {q.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to load users.
            </Alert>
          )}

          {/* Table */}
          <TableContainer sx={{ borderRadius: 1, border: 1, borderColor: "divider" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>NSSF #</TableCell>
                  <TableCell align="right">Balance</TableCell>
                  <TableCell align="center">Active</TableCell>
                  <TableCell>Joined</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {q.isLoading && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box sx={{ py: 3 }}>
                        <CircularProgress size={22} />
                      </Box>
                    </TableCell>
                  </TableRow>
                )}

                {!q.isLoading && items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box sx={{ py: 3, color: "text.secondary" }}>No users found.</Box>
                    </TableCell>
                  </TableRow>
                )}

                {items.map((u) => {
                  const name = u.full_name || [u.first_name, u.last_name].filter(Boolean).join(" ") || "—";
                  const balanceDraft = editing[u.id] ?? (u.balance ?? "").toString();

                  return (
                    <TableRow key={u.id} hover>
                      <TableCell sx={{ maxWidth: 260, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {u.email}
                      </TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{u.role || "—"}</TableCell>
                      <TableCell>{u.nssf_number || "—"}</TableCell>

                      {/* Inline balance editor */}
                      <TableCell align="right" sx={{ minWidth: 220 }}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="center">
                          <TextField
                            size="small"
                            type="number"
                            inputProps={{ step: "0.01" }}
                            value={balanceDraft}
                            onChange={(e) =>
                              setEditing((s) => ({
                                ...s,
                                [u.id]: e.target.value,
                              }))
                            }
                            sx={{ maxWidth: 140 }}
                          />
                          <Tooltip title="Save balance">
                            <span>
                              <IconButton
                                color="primary"
                                onClick={() => {
                                  const val = Number(balanceDraft);
                                  if (Number.isNaN(val)) return;
                                  saveBalance.mutate({ id: u.id, balance: val });
                                }}
                                disabled={saveBalance.isLoading}
                              >
                                {saveBalance.isLoading ? <CircularProgress size={18} /> : <SaveIcon fontSize="small" />}
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                          {formatMoney(u.balance ?? 0)}
                        </Typography>
                      </TableCell>

                      {/* Active toggle */}
                      <TableCell align="center">
                        <Switch
                          checked={u.is_active}
                          onChange={(e) => toggleActive.mutate({ id: u.id, is_active: e.target.checked })}
                          disabled={toggleActive.isLoading}
                        />
                      </TableCell>

                      <TableCell>
                        {u.date_joined ? new Date(u.date_joined).toLocaleDateString() : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
            <Typography variant="caption" color="text.secondary">
              {q.isFetching ? "Refreshing…" : `${total} total`}
            </Typography>
            <TablePagination
              component="div"
              count={total}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
