import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-sky-50 to-white">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <Badge className="mb-3 bg-sky-100 text-sky-700 hover:bg-sky-100">NSSF Pensioner Self-Service</Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">Manage your pension with ease</h1>
          <p className="mt-4 text-gray-600">
            View payments, manage your profile & beneficiaries, submit requests, and download statements — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild><Link to="/login">Sign in</Link></Button>
            <Button variant="outline" asChild><Link to="/register">Register</Link></Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-sky-100 blur-2xl opacity-70" />
          <Card className="relative">
            <CardContent className="pt-6 text-sm text-gray-700 space-y-3">
              <div>• View recent and historical payments</div>
              <div>• Update bank & contact details</div>
              <div>• Manage beneficiaries with percentages</div>
              <div>• Submit and track service requests</div>
              <div>• Download statements as PDF</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
