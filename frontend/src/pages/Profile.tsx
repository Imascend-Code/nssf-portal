// src/pages/Profile.tsx
import * as React from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Avatar,
  TextField,
  Button,
  Stack,
  Divider,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useForm } from "react-hook-form";
import {
  useProfile,
  useUpdateProfile,
  useBeneficiaries,
  useAddBeneficiary,
} from "../api/hooks";

type ProfileForm = {
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  bank_name?: string;
  bank_account?: string;
};

export default function Profile() {
  const profile = useProfile();
  const updateProfile = useUpdateProfile();
  const beneficiaries = useBeneficiaries();
  const addBeneficiary = useAddBeneficiary();

  // form
  const { register, handleSubmit, reset } = useForm<ProfileForm>();

  // when profile loads/changes, populate the form
  React.useEffect(() => {
    if (profile.data) {
      reset({
        full_name: profile.data.full_name ?? "",
        phone: profile.data.phone ?? "",
        address: profile.data.address ?? "",
        city: profile.data.city ?? "",
        bank_name: profile.data.bank_name ?? "",
        bank_account: profile.data.bank_account ?? "",
      });
    }
  }, [profile.data, reset]);

  const onSubmit = (values: ProfileForm) => {
    updateProfile.mutate(values);
  };

  const displayName = profile.data?.full_name || "Member";
  const initials = (displayName || "N").slice(0, 1).toUpperCase();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Left: Identity */}
        <Grid item xs={12} md={4} lg={3}>
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Avatar sx={{ width: 56, height: 56 }}>{initials}</Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {displayName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profile.data?.nssf_number || "NSSF—"}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body2">
                  {profile.data?.phone || "—"}
                </Typography>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body2">
                  {profile.data?.address || "—"}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Forms */}
        <Grid item xs={12} md={8} lg={9}>
          <Stack spacing={3}>
            {/* Personal & Bank Details */}
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardHeader
                avatar={<AccountCircleIcon color="primary" />}
                title="Personal & Bank Details"
                subheader="Update your contact and payout information."
              />
              <CardContent>
                {profile.isLoading ? (
                  <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
                    <CircularProgress size={28} />
                  </Stack>
                ) : (
                  <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}
                  >
                    <TextField
                      label="Full name"
                      fullWidth
                      {...register("full_name")}
                    />
                    <TextField
                      label="Phone"
                      fullWidth
                      {...register("phone")}
                    />
                    <TextField
                      label="Address"
                      fullWidth
                      sx={{ gridColumn: { xs: "auto", sm: "1 / span 2" } }}
                      {...register("address")}
                    />
                    <TextField
                      label="City"
                      fullWidth
                      {...register("city")}
                    />
                    <TextField
                      label="Bank name"
                      fullWidth
                      {...register("bank_name")}
                    />
                    <TextField
                      label="Bank account"
                      fullWidth
                      sx={{ gridColumn: { xs: "auto", sm: "1 / span 2" } }}
                      {...register("bank_account")}
                    />

                    <Box sx={{ gridColumn: { xs: "auto", sm: "1 / span 2" }, display: "flex", justifyContent: "flex-end" }}>
                      <Button type="submit" variant="contained" disabled={updateProfile.isLoading} startIcon={<SaveIcon />}>
                        {updateProfile.isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Beneficiaries */}
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardHeader
                title="Beneficiaries"
                subheader="Your current beneficiaries and shares."
              />
              <CardContent>
                {beneficiaries.isLoading ? (
                  <Stack alignItems="center" justifyContent="center" sx={{ py: 4 }}>
                    <CircularProgress size={28} />
                  </Stack>
                ) : (beneficiaries.data || []).length ? (
                  <List dense sx={{ mb: 2 }}>
                    {(beneficiaries.data || []).map((b: any) => (
                      <ListItem
                        key={b.id}
                        divider
                        secondaryAction={<Chip label={`${b.percentage}%`} size="small" />}
                      >
                        <ListItemText
                          primary={b.full_name}
                          secondary={b.relationship}
                          primaryTypographyProps={{ fontWeight: 600 }}
                          secondaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    No beneficiaries yet.
                  </Typography>
                )}

                {/* Add beneficiary */}
                <AddBeneficiaryForm onAdd={async (values) => {
                  await addBeneficiary.mutateAsync(values);
                }} />
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}

function AddBeneficiaryForm({
  onAdd,
}: {
  onAdd: (payload: { full_name: string; relationship: string; percentage: number }) => Promise<any>;
}) {
  const formRef = React.useRef<HTMLFormElement | null>(null);

  return (
    <Box
      component="form"
      ref={formRef}
      onSubmit={async (e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget as HTMLFormElement);
        const payload = {
          full_name: String(fd.get("full_name") || ""),
          relationship: String(fd.get("relationship") || ""),
          percentage: Number(fd.get("percentage") || 0),
        };
        await onAdd(payload);
        (e.currentTarget as HTMLFormElement).reset();
      }}
    >
      <Grid container spacing={1.5}>
        <Grid item xs={12} sm={4}>
          <TextField name="full_name" label="Full name" fullWidth required />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField name="relationship" label="Relationship" fullWidth required />
        </Grid>
        <Grid item xs={8} sm={3}>
          <TextField
            name="percentage"
            label="Share (%)"
            type="number"
            inputProps={{ min: 0, max: 100, step: 1 }}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={4} sm={1} display="flex" alignItems="stretch">
          <Button
            type="submit"
            variant="contained"
            startIcon={<AddIcon />}
            fullWidth
            sx={{ minWidth: 0, whiteSpace: "nowrap" }}
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
