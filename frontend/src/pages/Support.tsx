import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Support() {
  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Support</h1>
        <p className="text-muted-foreground">
          We’re here to help with any questions about your pension.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Self-help */}
        <Card>
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

        {/* Contact Us */}
        <Card>
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
    </div>
  );
}
