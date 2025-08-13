// src/pages/Home.tsx
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShieldCheck, CreditCard, FileText, Users, HelpCircle, ArrowRight } from "lucide-react"

export default function Home() {
  const features = [
    {
      title: "Payments",
      description: "View contributions and download statements anytime.",
      icon: CreditCard,
      link: "/payments",
    },
    {
      title: "Requests",
      description: "Submit and track your service requests with ease.",
      icon: FileText,
      link: "/requests",
    },
    {
      title: "Beneficiaries",
      description: "Manage and update your beneficiaries securely.",
      icon: Users,
      link: "/profile",
    },
    {
      title: "Support",
      description: "Find answers or contact our support team.",
      icon: HelpCircle,
      link: "/support",
    },
  ]

  const stats = [
    { kpi: "98%", label: "Member Satisfaction" },
    { kpi: "24h", label: "Avg. Response Time" },
    { kpi: "10M+", label: "Secure Transactions" },
  ]

  return (
    <div className="min-h-[calc(100vh-140px)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="container max-w-6xl mx-auto px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Your financial security is our priority
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Welcome to the NSSF Member Portal
            </h1>
            <p className="text-muted-foreground">
              Manage your social security contributions with our secure, intuitive platform designed for your
              convenience.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link to="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link to="/profile">Update Profile</Link>
              </Button>
            </div>
          </div>

          {/* KPI cards */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {stats.map((s, i) => (
              <Card key={i} className="rounded-2xl">
                <CardContent className="py-6 text-center">
                  <div className="text-3xl font-bold">{s.kpi}</div>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick access */}
      <section className="container max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold">Quick Access</h2>
          <p className="text-muted-foreground mt-1">
            Everything you need to manage your social security, all in one place
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow rounded-2xl">
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <f.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-base">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription>{f.description}</CardDescription>
                <Button asChild variant="ghost" className="px-0 h-auto">
                  <Link to={f.link} className="inline-flex items-center gap-1 font-medium">
                    Get started <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-12" />

        {/* CTA banner */}
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
            <div>
              <div className="text-lg font-semibold">Ready to make a request?</div>
              <p className="text-sm text-muted-foreground">Create a new service request in a few clicks.</p>
            </div>
            <Button asChild>
              <Link to="/requests/new">New Request</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
