// src/pages/Payments.tsx
import { usePayments } from "@/api/hooks"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"

export default function Payments() {
  const { data: payments, isLoading } = usePayments()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Payments</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review all your payment transactions and statuses.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>All your past and recent transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-6">
              <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
            </div>
          ) : payments && payments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment: any) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {format(new Date(payment.date), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell>{payment.reference || "—"}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("en-UG", {
                          style: "currency",
                          currency: "UGX",
                        }).format(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.status === "COMPLETED"
                              ? "success"
                              : payment.status === "PENDING"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground p-4 text-center">
              No payments found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
