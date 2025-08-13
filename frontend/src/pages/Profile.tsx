// src/pages/Profile.tsx
import { useProfile, useUpdateProfile } from "@/api/hooks"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { Loader2, Save } from "lucide-react"

export default function Profile() {
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()

  const form = useForm({
    defaultValues: {
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      city: profile?.city || "",
      bank_name: profile?.bank_name || "",
      bank_account: profile?.bank_account || "",
    },
  })

  const onSubmit = (values: any) => {
    updateProfile.mutate(values)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          View and update your account details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your name, contact info, and address.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-6">
              <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div className="grid gap-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  {...form.register("full_name")}
                  placeholder="John Doe"
                />
              </div>

              {/* Phone */}
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...form.register("phone")}
                  placeholder="+256..."
                />
              </div>

              {/* Address */}
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  {...form.register("address")}
                  placeholder="Street, Block, etc."
                />
              </div>

              {/* City */}
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...form.register("city")}
                  placeholder="Kampala"
                />
              </div>

              {/* Bank Details */}
              <div className="grid gap-2">
                <Label htmlFor="bank_name">Bank Name</Label>
                <Input
                  id="bank_name"
                  {...form.register("bank_name")}
                  placeholder="Bank of Africa"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bank_account">Bank Account Number</Label>
                <Input
                  id="bank_account"
                  {...form.register("bank_account")}
                  placeholder="0000 0000 0000"
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={updateProfile.isLoading}>
                  {updateProfile.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
