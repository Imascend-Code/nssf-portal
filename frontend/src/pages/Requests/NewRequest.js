import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Container, Card, CardHeader, CardContent, Typography, TextField, Button, Grid, Stack, Select, MenuItem, InputLabel, FormControl, Alert, CircularProgress, } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useCategories, useCreateRequest, useUploadAttachment } from "../../api/hooks";
export default function NewRequest() {
    const cats = useCategories();
    const create = useCreateRequest();
    const [createdId, setCreatedId] = useState();
    const [file, setFile] = useState(null);
    const upload = useUploadAttachment(createdId || 0);
    const catsList = Array.isArray(cats.data) ? cats.data : cats.data?.results ?? [];
    if (cats.isLoading) {
        return (_jsx(Container, { maxWidth: "sm", sx: { py: 4 }, children: _jsx(Stack, { alignItems: "center", justifyContent: "center", sx: { py: 6 }, children: _jsx(CircularProgress, { size: 28 }) }) }));
    }
    async function onSubmit(e) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const payload = {
            title: String(fd.get("title") || ""),
            description: String(fd.get("description") || ""),
            category: Number(fd.get("category") || 0),
            priority: String(fd.get("priority") || "normal"),
        };
        const r = await create.mutateAsync(payload);
        setCreatedId(r.id);
        if (file) {
            const f = new FormData();
            f.set("file", file);
            await upload.mutateAsync(f);
        }
    }
    return (_jsx(Container, { maxWidth: "sm", sx: { py: 4 }, children: _jsxs(Card, { variant: "outlined", sx: { borderRadius: 3 }, children: [_jsx(CardHeader, { title: _jsx(Typography, { variant: "h6", children: "New Service Request" }) }), _jsx(CardContent, { children: _jsx("form", { onSubmit: onSubmit, children: _jsxs(Grid, { container: true, spacing: 2, children: [_jsx(Grid, { item: true, xs: 12, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { id: "category-label", children: "Category" }), _jsx(Select, { labelId: "category-label", label: "Category", name: "category", defaultValue: catsList[0]?.id ?? "", required: true, children: catsList.map((c) => (_jsx(MenuItem, { value: c.id, children: c.name }, c.id))) })] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { name: "title", label: "Title", fullWidth: true, required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(TextField, { name: "description", label: "Description", fullWidth: true, multiline: true, minRows: 5, required: true }) }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { id: "priority-label", children: "Priority" }), _jsxs(Select, { labelId: "priority-label", label: "Priority", name: "priority", defaultValue: "normal", children: [_jsx(MenuItem, { value: "low", children: "Low" }), _jsx(MenuItem, { value: "normal", children: "Normal" }), _jsx(MenuItem, { value: "high", children: "High" })] })] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsxs(Button, { variant: "outlined", component: "label", fullWidth: true, children: [file ? `Selected: ${file.name}` : "Choose attachment", _jsx("input", { type: "file", hidden: true, onChange: (e) => setFile(e.target.files?.[0] ?? null) })] }) }), _jsx(Grid, { item: true, xs: 12, children: _jsx(Button, { type: "submit", variant: "contained", startIcon: _jsx(AddIcon, {}), disabled: create.isPending || upload.isPending, fullWidth: true, children: create.isPending ? "Submitting…" : "Submit" }) }), createdId && (_jsx(Grid, { item: true, xs: 12, children: _jsxs(Alert, { severity: "success", children: ["Submitted with ID #", createdId] }) }))] }) }) })] }) }));
}
