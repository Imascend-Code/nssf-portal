import * as React from "react";
import { useState, FormEvent } from "react";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCategories, useCreateRequest, useUploadAttachment } from "../api/hooks";

export default function NewRequest() {
  const cats = useCategories();
  const create = useCreateRequest();

  const [createdId, setCreatedId] = useState<number | undefined>();
  const [file, setFile] = useState<File | null>(null);

  const upload = useUploadAttachment(createdId || 0);

  const catsList: any[] = Array.isArray(cats.data) ? cats.data : cats.data?.results ?? [];

  if (cats.isLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
          <CircularProgress size={28} />
        </Stack>
      </Container>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: String(fd.get("title") || ""),
      description: String(fd.get("description") || ""),
      category: Number(fd.get("category") || 0),
      priority: String(fd.get("priority") || "normal"),
    } as any;

    const r = await create.mutateAsync(payload);
    setCreatedId(r.id);

    if (file) {
      const f = new FormData();
      f.set("file", file);
      await upload.mutateAsync(f);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardHeader title={<Typography variant="h6">New Service Request</Typography>} />
        <CardContent>
          <form onSubmit={onSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    label="Category"
                    name="category"
                    defaultValue={catsList[0]?.id ?? ""}
                    required
                  >
                    {catsList.map((c: any) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField name="title" label="Title" fullWidth required />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  fullWidth
                  multiline
                  minRows={5}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="priority-label">Priority</InputLabel>
                  <Select
                    labelId="priority-label"
                    label="Priority"
                    name="priority"
                    defaultValue="normal"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Button variant="outlined" component="label" fullWidth>
                  {file ? `Selected: ${file.name}` : "Choose attachment"}
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={create.isPending || upload.isPending}
                  fullWidth
                >
                  {create.isPending ? "Submitting…" : "Submit"}
                </Button>
              </Grid>

              {createdId && (
                <Grid item xs={12}>
                  <Alert severity="success">Submitted with ID #{createdId}</Alert>
                </Grid>
              )}
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
