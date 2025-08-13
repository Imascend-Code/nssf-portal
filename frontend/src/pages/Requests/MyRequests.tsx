import { Link } from "react-router-dom";
import { useMyRequests } from "@/api/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";

export default function MyRequests() {
  const q = useMyRequests();

  return (
    <div className="mx-auto max-w-6xl p-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>My Requests</CardTitle>
          <Button asChild><Link to="/requests/new">New request</Link></Button>
        </CardHeader>
        <CardContent>
          {q.isLoading ? (
            <p>Loading…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(q.data?.results || []).map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Link to={`/requests/${r.id}`} className="underline">{r.title}</Link>
                    </TableCell>
                    <TableCell><StatusBadge value={r.status} /></TableCell>
                  </TableRow>
                ))}
                {(!q.data?.results || q.data.results.length === 0) && (
                  <TableRow><TableCell colSpan={2} className="text-muted-foreground text-center">No requests yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
