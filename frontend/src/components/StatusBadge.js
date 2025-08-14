import { jsx as _jsx } from "react/jsx-runtime";
import { Badge } from "@/components/ui/badge";
export function StatusBadge({ value }) {
    const v = (value || "").toLowerCase();
    let variant = "secondary";
    if (["processed", "resolved", "closed"].includes(v))
        variant = "default";
    else if (["pending", "submitted", "under_review", "in_progress", "on_hold"].includes(v))
        variant = "secondary";
    else if (["rejected"].includes(v))
        variant = "destructive";
    return _jsx(Badge, { variant: variant, className: "capitalize", children: value });
}
