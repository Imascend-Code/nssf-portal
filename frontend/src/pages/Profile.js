import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Profile.tsx
import * as React from "react";
import { Box, Container, Grid, Card, CardHeader, CardContent, Typography, Avatar, TextField, Button, Stack, Divider, CircularProgress, Chip, List, ListItem, ListItemText, } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useForm } from "react-hook-form";
import { useProfile, useUpdateProfile, useBeneficiaries, useAddBeneficiary, } from "../api/hooks";
export default function Profile() {
    const profile = useProfile();
    const updateProfile = useUpdateProfile();
    const beneficiaries = useBeneficiaries();
    const addBeneficiary = useAddBeneficiary();
    // form
    const { register, handleSubmit, reset } = useForm();
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
    const onSubmit = (values) => {
        updateProfile.mutate(values);
    };
    const displayName = profile.data?.full_name || "Member";
    const initials = (displayName || "N").slice(0, 1).toUpperCase();
    return (_jsx(Container, { maxWidth: "lg", sx: { py: 4 }, children: _jsxs(Grid, { container: true, spacing: 3, children: [_jsx(Grid, { item: true, xs: 12, md: 4, lg: 3, children: _jsx(Card, { variant: "outlined", sx: { borderRadius: 3 }, children: _jsxs(CardContent, { children: [_jsxs(Stack, { direction: "row", spacing: 2, alignItems: "center", sx: { mb: 2 }, children: [_jsx(Avatar, { sx: { width: 56, height: 56 }, children: initials }), _jsxs(Box, { children: [_jsx(Typography, { variant: "subtitle1", fontWeight: 700, children: displayName }), _jsx(Typography, { variant: "body2", color: "text.secondary", children: profile.data?.nssf_number || "NSSF—" })] })] }), _jsx(Divider, { sx: { my: 2 } }), _jsxs(Stack, { spacing: 1, children: [_jsx(Typography, { variant: "caption", color: "text.secondary", children: "Phone" }), _jsx(Typography, { variant: "body2", children: profile.data?.phone || "—" })] }), _jsx(Divider, { sx: { my: 2 } }), _jsxs(Stack, { spacing: 1, children: [_jsx(Typography, { variant: "caption", color: "text.secondary", children: "Address" }), _jsx(Typography, { variant: "body2", children: profile.data?.address || "—" })] })] }) }) }), _jsx(Grid, { item: true, xs: 12, md: 8, lg: 9, children: _jsxs(Stack, { spacing: 3, children: [_jsxs(Card, { variant: "outlined", sx: { borderRadius: 3 }, children: [_jsx(CardHeader, { avatar: _jsx(AccountCircleIcon, { color: "primary" }), title: "Personal & Bank Details", subheader: "Update your contact and payout information." }), _jsx(CardContent, { children: profile.isLoading ? (_jsx(Stack, { alignItems: "center", justifyContent: "center", sx: { py: 4 }, children: _jsx(CircularProgress, { size: 28 }) })) : (_jsxs(Box, { component: "form", onSubmit: handleSubmit(onSubmit), noValidate: true, sx: { display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }, children: [_jsx(TextField, { label: "Full name", fullWidth: true, ...register("full_name") }), _jsx(TextField, { label: "Phone", fullWidth: true, ...register("phone") }), _jsx(TextField, { label: "Address", fullWidth: true, sx: { gridColumn: { xs: "auto", sm: "1 / span 2" } }, ...register("address") }), _jsx(TextField, { label: "City", fullWidth: true, ...register("city") }), _jsx(TextField, { label: "Bank name", fullWidth: true, ...register("bank_name") }), _jsx(TextField, { label: "Bank account", fullWidth: true, sx: { gridColumn: { xs: "auto", sm: "1 / span 2" } }, ...register("bank_account") }), _jsx(Box, { sx: { gridColumn: { xs: "auto", sm: "1 / span 2" }, display: "flex", justifyContent: "flex-end" }, children: _jsx(Button, { type: "submit", variant: "contained", disabled: updateProfile.isLoading, startIcon: _jsx(SaveIcon, {}), children: updateProfile.isLoading ? "Saving..." : "Save Changes" }) })] })) })] }), _jsxs(Card, { variant: "outlined", sx: { borderRadius: 3 }, children: [_jsx(CardHeader, { title: "Beneficiaries", subheader: "Your current beneficiaries and shares." }), _jsxs(CardContent, { children: [beneficiaries.isLoading ? (_jsx(Stack, { alignItems: "center", justifyContent: "center", sx: { py: 4 }, children: _jsx(CircularProgress, { size: 28 }) })) : (beneficiaries.data || []).length ? (_jsx(List, { dense: true, sx: { mb: 2 }, children: (beneficiaries.data || []).map((b) => (_jsx(ListItem, { divider: true, secondaryAction: _jsx(Chip, { label: `${b.percentage}%`, size: "small" }), children: _jsx(ListItemText, { primary: b.full_name, secondary: b.relationship, primaryTypographyProps: { fontWeight: 600 }, secondaryTypographyProps: { variant: "caption", color: "text.secondary" } }) }, b.id))) })) : (_jsx(Typography, { variant: "body2", color: "text.secondary", sx: { mb: 2 }, children: "No beneficiaries yet." })), _jsx(AddBeneficiaryForm, { onAdd: async (values) => {
                                                    await addBeneficiary.mutateAsync(values);
                                                } })] })] })] }) })] }) }));
}
function AddBeneficiaryForm({ onAdd, }) {
    const formRef = React.useRef(null);
    return (_jsx(Box, { component: "form", ref: formRef, onSubmit: async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const payload = {
                full_name: String(fd.get("full_name") || ""),
                relationship: String(fd.get("relationship") || ""),
                percentage: Number(fd.get("percentage") || 0),
            };
            await onAdd(payload);
            e.currentTarget.reset();
        }, children: _jsxs(Grid, { container: true, spacing: 1.5, children: [_jsx(Grid, { item: true, xs: 12, sm: 4, children: _jsx(TextField, { name: "full_name", label: "Full name", fullWidth: true, required: true }) }), _jsx(Grid, { item: true, xs: 12, sm: 4, children: _jsx(TextField, { name: "relationship", label: "Relationship", fullWidth: true, required: true }) }), _jsx(Grid, { item: true, xs: 8, sm: 3, children: _jsx(TextField, { name: "percentage", label: "Share (%)", type: "number", inputProps: { min: 0, max: 100, step: 1 }, fullWidth: true, required: true }) }), _jsx(Grid, { item: true, xs: 4, sm: 1, display: "flex", alignItems: "stretch", children: _jsx(Button, { type: "submit", variant: "contained", startIcon: _jsx(AddIcon, {}), fullWidth: true, sx: { minWidth: 0, whiteSpace: "nowrap" }, children: "Add" }) })] }) }));
}
