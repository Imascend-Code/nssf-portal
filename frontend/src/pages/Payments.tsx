// src/pages/Payments.tsx
import { usePayments } from "@/api/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Download } from "lucide-react"

export default function Payments() {
  const { data: payments, isLoading } = usePayments()

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Payments</h1>
          <p className="text-muted-foreground text-sm mt-1">Review your payment history and statuses.</p>
        </div>
        <Button variant="outline" onClick={() => (window.location.href = "/documents/statement")}>
          <Download className="h-4 w-4 mr-2" />
          Download Statement
        </Button>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>All your past and recent transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : payments && payments.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        {p.period_start} – {p.period_end}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX" }).format(p.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={p.status === "processed" ? "default" : p.status === "pending" ? "secondary" : "destructive"}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{p.reference || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No payments found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
