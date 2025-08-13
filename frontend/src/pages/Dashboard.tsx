// src/pages/Dashboard.tsx
import { useProfile } from "@/api/hooks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, ArrowUpRight, CreditCard, FileText, Users } from "lucide-react"

export default function Dashboard() {
  const { data: profile, isLoading } = useProfile()

  const stats = [
    { label: "Total Contributions", value: "UGX 12,500,000", icon: CreditCard },
    { label: "Pending Requests", value: "3", icon: FileText },
    { label: "Beneficiaries", value: "2", icon: Users },
  ]

  const recentActivity = [
    { id: 1, title: "Monthly Contribution", amount: "UGX 500,000", date: "2025-08-05", status: "COMPLETED" },
    { id: 2, title: "Withdrawal Request", amount: "UGX 2,000,000", date: "2025-07-20", status: "PENDING" },
    { id: 3, title: "Added Beneficiary", amount: "-", date: "2025-07-15", status: "COMPLETED" },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}!</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here’s an overview of your account activity and contributions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                View details <ArrowUpRight className="h-3 w-3" />
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest transactions and updates in your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-6">
              <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.date}</TableCell>
                      <TableCell>{activity.title}</TableCell>
                      <TableCell>{activity.amount}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            activity.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {activity.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
