// src/pages/Dashboard.tsx
import { useProfile, usePayments, useMyRequests } from "@/api/hooks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, CreditCard, FileText, Users } from "lucide-react"

export default function Dashboard() {
  const { data: profile } = useProfile()
  const payments = usePayments({ page_size: 5 })
  const requests = useMyRequests({ page_size: 5 })

  const kpis = [
    { title: "Total Payments", value: payments.data?.length ?? 0, icon: CreditCard },
    { title: "Pending Requests", value: (requests.data?.results || []).filter((r: any) => r.status !== "resolved" && r.status !== "closed").length, icon: FileText },
    { title: "Beneficiaries", value: profile?.beneficiaries_count ?? 0, icon: Users },
  ]

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}!</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your account activity and contributions.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k, i) => (
          <Card key={i} className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{k.title}</CardTitle>
              <k.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{k.value}</div>
              <p className="text-xs text-muted-foreground">Updated just now</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Data Tabs */}
      <Tabs defaultValue="payments" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="payments">Recent Payments</TabsTrigger>
          <TabsTrigger value="requests">Recent Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>Your latest transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {payments.isLoading ? (
                <div className="flex justify-center p-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : payments.data?.length ? (
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
                      {payments.data.map((p: any) => (
                        <TableRow key={p.id}>
                          <TableCell>
                            {p.period_start} – {p.period_end}
                          </TableCell>
                          <TableCell>{new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX" }).format(p.amount)}</TableCell>
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
        </TabsContent>

        <TabsContent value="requests">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Requests</CardTitle>
              <CardDescription>Latest service requests</CardDescription>
            </CardHeader>
            <CardContent>
              {requests.isLoading ? (
                <div className="flex justify-center p-6">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (requests.data?.results || []).length ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.data.results.map((r: any) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">{r.title}</TableCell>
                          <TableCell>{r.category?.name || "—"}</TableCell>
                          <TableCell>
                            <Badge variant={r.status === "resolved" ? "default" : r.status === "rejected" ? "destructive" : "secondary"}>
                              {r.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">{r.priority}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No requests yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
