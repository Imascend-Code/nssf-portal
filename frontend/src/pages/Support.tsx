// src/pages/Support.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Phone, Mail, HelpCircle } from "lucide-react"
import { Link } from "react-router-dom"

export default function Support() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Support</h1>
        <p className="text-muted-foreground">We’re here to help with your account and requests.</p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Self-help */}
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <CardTitle>Self-help</CardTitle>
            </div>
            <CardDescription>Find answers to common questions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>First-time login and account setup</li>
              <li>Updating bank details and beneficiaries</li>
              <li>Understanding payment schedules</li>
            </ul>
            <Button variant="outline" asChild>
              <Link to="/features">Browse Features</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              <CardTitle>Contact us</CardTitle>
            </div>
            <CardDescription>Get in touch with our help desk.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Phone: 0800 123 456 (toll-free)</p>
              <p>Email: support@nssf.example</p>
            </div>
            <Button>
              <Mail className="h-4 w-4 mr-2" /> Send an Email
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* CTA */}
      <Card className="rounded-2xl">
        <CardContent className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-semibold">Need official documentation?</div>
            <p className="text-sm text-muted-foreground">Generate a statement for any date range.</p>
          </div>
          <Button asChild>
            <Link to="/payments">Open Payments</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
