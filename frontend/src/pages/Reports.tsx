import * as React from "react";
import {
    Container, Card, CardHeader, CardContent, Typography, Grid, Stack,
    Table, TableBody, TableCell, TableHead, TableRow, TableContainer,
    CircularProgress, Button, Alert, Box
} from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import { useProfile, usePayments } from "@/api/hooks";

function Money({ v }: { v: number | string | null | undefined }) {
    if (v == null) return <>—</>;
    const n = typeof v === "string" ? Number(v) : v;
    if (Number.isNaN(n)) return <>{String(v)}</>;
    return <>{new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX" }).format(n)}</>;
}

export default function Reports() {
    const me = useProfile();
    const payments = usePayments({ page_size: 12, ordering: "-period_start" });

    const balance = me.data?.balance ?? 0;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>My Reports</Typography>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
                        <CardHeader
                            title="Current Balance"
                            action={<CreditScoreIcon color="primary" />}
                        />
                        <CardContent>
                            {me.isLoading ? (
                                <Stack alignItems="center" sx={{ py: 3 }}>
                                    <CircularProgress size={22} />
                                </Stack>
                            ) : me.isError ? (
                                <Alert severity="error">Failed to load profile.</Alert>
                            ) : (
                                <>
                                    <Typography variant="h4" fontWeight={800} sx={{ lineHeight: 1 }}>
                                        <Money v={balance} />
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">As per your account</Typography>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
                        <CardHeader
                            title="Statements"
                            action={<ReceiptLongIcon color="primary" />}
                        />
                        <CardContent>
                            <Stack spacing={1}>
                                <Typography variant="body2" color="text.secondary">
                                    Download a PDF statement for your records.
                                </Typography>
                                <Stack direction="row" spacing={1}>
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

                                <Typography variant="caption" color="text.secondary">
                                    Tip: you can print or save the PDF for any official use.
                                </Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardHeader title="Recent Payments" />
                <CardContent>
                    {payments.isLoading ? (
                        <Stack alignItems="center" sx={{ py: 3 }}>
                            <CircularProgress size={22} />
                        </Stack>
                    ) : payments.isError ? (
                        <Alert severity="error">Failed to load payments.</Alert>
                    ) : (payments.data || []).length === 0 ? (
                        <Typography variant="body2" color="text.secondary">No payments found.</Typography>
                    ) : (
                        <TableContainer sx={{ borderRadius: 1, border: 1, borderColor: "divider" }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Period</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Reference</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(payments.data || []).map((p: any) => (
                                        <TableRow key={p.id} hover>
                                            <TableCell>{p.period_start} – {p.period_end}</TableCell>
                                            <TableCell align="right"><Money v={p.amount} /></TableCell>
                                            <TableCell sx={{ textTransform: "capitalize" }}>{p.status || "—"}</TableCell>
                                            <TableCell>{p.reference || "—"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>

            {/* Debug: remove if not needed */}
            <Box mt={2}>
                <Typography variant="caption" color="text.secondary">
                    Having trouble? Ensure you’re logged in and the backend endpoints are reachable.
                </Typography>
            </Box>
        </Container>
    );
}
