import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { api } from "@/api/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function RequestDetail() {
  const { id } = useParams();
  const q = useQuery({ queryKey: ["request", id], queryFn: async () => (await api.get(`/requests/${id}/`)).data });

  if (q.isLoading) return <div className="p-6">Loading…</div>;
  const r = q.data;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{r.title}</CardTitle>
          <StatusBadge value={r.status} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">Priority: <span className="capitalize">{r.priority}</span></div>
          <Separator />
          <p className="whitespace-pre-line">{r.description}</p>
          <Separator />
          <div>
            <h4 className="mb-2 font-semibold">Attachments</h4>
            <ul className="list-inside list-disc space-y-1">
              {(r.attachments || []).map((a: any) => (
                <li key={a.id}><a href={a.file} target="_blank" className="underline">file</a></li>
              ))}
              {(!r.attachments || r.attachments.length === 0) && <li className="text-muted-foreground">No attachments</li>}
            </ul>
          </div>
          {/* Optional: button to go back */}
          <Button variant="outline" onClick={() => window.history.back()}>Back</Button>
        </CardContent>
      </Card>
    </div>
  );
}
