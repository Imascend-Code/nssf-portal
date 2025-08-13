import { Badge } from "@/components/ui/badge";

export function StatusBadge({ value }: { value: string }) {
  const v = (value || "").toLowerCase();
  let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
  if (["processed", "resolved", "closed"].includes(v)) variant = "default";
  else if (["pending", "submitted", "under_review", "in_progress", "on_hold"].includes(v)) variant = "secondary";
  else if (["rejected"].includes(v)) variant = "destructive";
  return <Badge variant={variant} className="capitalize">{value}</Badge>;
}
