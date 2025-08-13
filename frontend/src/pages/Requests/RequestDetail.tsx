import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/api/client";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Stack,
  Chip,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Link as MUILink,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function StatusChip({ value }: { value: string }) {
  const s = (value || "").toLowerCase();
  let color: "default" | "success" | "warning" | "error" = "default";
  if (["resolved", "closed", "completed", "success"].includes(s)) color = "success";
  else if (["pending", "in_progress", "queued"].includes(s)) color = "warning";
  else if (["rejected", "failed", "error"].includes(s)) color = "error";
  return <Chip size="small" variant="outlined" color={color} label={value} sx={{ textTransform: "capitalize" }} />;
}

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const q = useQuery({
    queryKey: ["request", id],
    queryFn: async () => (await api.get(`/requests/${id}/`)).data,
    enabled: !!id,
  });

  if (q.isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
          <CircularProgress size={28} />
        </Stack>
      </Container>
    );
  }

  if (q.isError) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Failed to load request.</Alert>
      </Container>
    );
  }

  const r = q.data;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardHeader
          title={
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">{r.title}</Typography>
              <StatusChip value={r.status} />
            </Stack>
          }
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            Priority: <strong style={{ textTransform: "capitalize" }}>{r.priority}</strong>
          </Typography>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="body1" sx={{ whiteSpace: "pre-line", mb: 2 }}>
            {r.description}
          </Typography>
          <Divider sx={{ my: 1.5 }} />

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Attachments
          </Typography>
          <Stack component="ul" sx={{ pl: 2, m: 0 }} spacing={0.5}>
            {(r.attachments || []).length > 0 ? (
              (r.attachments || []).map((a: any) => (
                <li key={a.id}>
                  <MUILink href={a.file} target="_blank" rel="noopener">
                    file
                  </MUILink>
                </li>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No attachments
              </Typography>
            )}
          </Stack>

          <Stack direction="row" justifyContent="flex-start" sx={{ mt: 3 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
              Back
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
