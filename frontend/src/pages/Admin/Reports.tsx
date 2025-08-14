import * as React from "react";
import {
    Container, Grid, Card, CardHeader, CardContent, Typography, Stack,
    CircularProgress, Alert, Divider, Table, TableBody, TableCell, TableHead, TableRow,
    Box, Chip, Button,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useReport } from "../../api/hooks";

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
                <Typography variant="caption" color="text.secondary">Updated moments ago</Typography>
            </CardContent>
        </Card>
    );
}

function Money({ v }: { v: number | string | null | undefined }) {
    if (v == null) return <>—</>;
    const n = typeof v === "string" ? Number(v) : v;
    if (Number.isNaN(n)) return <>{String(v)}</>;
    return <>{new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX" }).format(n)}</>;
}

export default function AdminReports() {
    const r = useReport();

    const paymentsTotal = React.useMemo(() => {
        const byStatus: Array<{ status: string; total: number }> = (r.data?.payments_by_status || []) as any;
        return byStatus.reduce((sum, row) => sum + (Number(row.total) || 0), 0);
    }, [r.data]);

    const requestsOpen = React.useMemo(() => {
        const rows: Array<{ status: string; count: number }> = (r.data?.requests_by_status || []) as any;
        return rows.reduce((sum, row) => {
            const s = (row.status || "").toLowerCase();
            if (["open", "pending", "in_progress"].includes(s)) return sum + (row.count || 0);
            return sum;
        }, 0);
    }, [r.data]);

    const usersTotal = r.data?.users_total ?? undefined; // keep here in case you extend API later

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={800}>Admin Reports</Typography>
                <Stack direction="row" spacing={1}>
                    {/* If you add export endpoints later, hook them up here */}
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => window.open("/api/v1/reports/summary/?format=csv", "_blank")}
                    >
                        Export CSV
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => window.open("/api/v1/reports/summary/?format=pdf", "_blank")}
                    >
                        Export PDF
                    </Button>
                </Stack>
            </Stack>

            {r.isLoading && (
                <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
                    <CircularProgress size={28} />
                </Stack>
            )}

            {r.isError && <Alert severity="error">Failed to load report summary.</Alert>}

            {!r.isLoading && !r.isError && (
                <>
                    {/* KPIs */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <KPI label="Total Payments (12 mo)" value={<Money v={paymentsTotal} />} icon={<AttachMoneyIcon />} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <KPI label="Open Requests" value={requestsOpen} icon={<AssignmentIcon />} />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <KPI label="Registered Users" value={usersTotal ?? "—"} icon={<PeopleAltIcon />} />
                        </Grid>
                    </Grid>

                    {/* Payments by status */}
                    <Card variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
                        <CardHeader title="Payments by status (last 12 months)" />
                        <Divider />
                        <CardContent>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Count</TableCell>
                                        <TableCell align="right">Total Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(r.data?.payments_by_status || []).map((row: any, i: number) => (
                                        <TableRow key={i} hover>
                                            <TableCell sx={{ textTransform: "capitalize" }}>{row.status || "—"}</TableCell>
                                            <TableCell align="right">{row.count ?? 0}</TableCell>
                                            <TableCell align="right"><Money v={row.total ?? 0} /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Payments by month */}
                    <Card variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
                        <CardHeader title="Payments by month" />
                        <Divider />
                        <CardContent>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Month</TableCell>
                                        <TableCell align="right">Total Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(r.data?.payments_by_month || {}).map(([month, total]: any) => (
                                        <TableRow key={month}>
                                            <TableCell>{month}</TableCell>
                                            <TableCell align="right"><Money v={total} /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Requests by status & category */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
                                <CardHeader title="Requests by status" />
                                <Divider />
                                <CardContent>
                                    <Stack spacing={1}>
                                        {(r.data?.requests_by_status || []).map((row: any, i: number) => (
                                            <Box key={i} display="flex" justifyContent="space-between" alignItems="center">
                                                <Chip size="small" label={row.status || "—"} />
                                                <Typography fontWeight={700}>{row.count ?? 0}</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
                                <CardHeader title="Top categories" />
                                <Divider />
                                <CardContent>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Category</TableCell>
                                                <TableCell align="right">Requests</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {(r.data?.requests_by_category || []).map((row: any, i: number) => (
                                                <TableRow key={i}>
                                                    <TableCell>{row.category__name || "—"}</TableCell>
                                                    <TableCell align="right">{row.count ?? 0}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Raw JSON (debug aid) */}
                    <Card variant="outlined" sx={{ borderRadius: 3, mt: 2 }}>
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
