import { useCategories, useCreateRequest, useUploadAttachment } from "@/api/hooks";
import { useState, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";

export default function NewRequest() {
  const cats = useCategories();
  const create = useCreateRequest();
  const [createdId, setCreatedId] = useState<number | undefined>();
  const [file, setFile] = useState<File | undefined>();
  const upload = useUploadAttachment(createdId || 0);

  if (cats.isLoading) return <div className="p-6">Loading…</div>;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const payload = {
      title: fd.get("title"),
      description: fd.get("description"),
      category: Number(fd.get("category")),
      priority: fd.get("priority"),
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
    <div className="mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader><CardTitle>New Service Request</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              {/* Using native select to keep payload simple */}
              <select name="category" id="category" className="w-full rounded-md border bg-background px-3 py-2">
                {(cats.data?.results || cats.data || []).map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={5} required />
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select name="priority" defaultValue="normal">
                <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Attachment</Label>
              <Input id="file" type="file" onChange={(e) => setFile(e.target.files?.[0])} />
            </div>

            <Button type="submit" disabled={create.isPending || upload.isPending}>
              {create.isPending ? "Submitting…" : "Submit"}
            </Button>
            {createdId && <p className="text-sm text-green-600">Submitted with ID #{createdId}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
