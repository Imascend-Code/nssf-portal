// src/pages/Profile.tsx
import { useProfile, useUpdateProfile, useBeneficiaries, useAddBeneficiary } from "@/api/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, Save, Plus } from "lucide-react"
import { useForm } from "react-hook-form"

export default function Profile() {
  const profile = useProfile()
  const updateProfile = useUpdateProfile()
  const beneficiaries = useBeneficiaries()
  const addBeneficiary = useAddBeneficiary()

  const form = useForm({
    values: {
      full_name: profile.data?.full_name || "",
      phone: profile.data?.phone || "",
      address: profile.data?.address || "",
      city: profile.data?.city || "",
      bank_name: profile.data?.bank_name || "",
      bank_account: profile.data?.bank_account || "",
    },
  })

  const onSubmit = (values: any) => updateProfile.mutate(values)

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 grid gap-6 lg:grid-cols-3">
      {/* Left: Identity */}
      <Card className="rounded-2xl lg:col-span-1 h-fit">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback>
                {(profile.data?.full_name || "N").slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{profile.data?.full_name || "Member"}</div>
              <p className="text-sm text-muted-foreground">{profile.data?.nssf_number || "NSSF—"}</p>
            </div>
          </div>
          <div className="text-sm">
            <div className="text-muted-foreground">Phone</div>
            <div>{profile.data?.phone || "—"}</div>
          </div>
          <div className="text-sm">
            <div className="text-muted-foreground">Address</div>
            <div>{profile.data?.address || "—"}</div>
          </div>
        </CardContent>
      </Card>

      {/* Right: Forms */}
      <div className="lg:col-span-2 grid gap-6">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Personal & Bank Details</CardTitle>
            <CardDescription>Update your contact and payout information.</CardDescription>
          </CardHeader>
          <CardContent>
            {profile.isLoading ? (
              <div className="flex justify-center p-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input id="full_name" {...form.register("full_name")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...form.register("phone")} />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" {...form.register("address")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...form.register("city")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bank_name">Bank Name</Label>
                  <Input id="bank_name" {...form.register("bank_name")} />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="bank_account">Bank Account</Label>
                  <Input id="bank_account" {...form.register("bank_account")} />
                </div>

                <div className="sm:col-span-2 flex justify-end">
                  <Button type="submit" disabled={updateProfile.isLoading}>
                    {updateProfile.isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Beneficiaries */}
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Beneficiaries</CardTitle>
            <CardDescription>Your current beneficiaries and shares.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {beneficiaries.isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (beneficiaries.data || []).length ? (
              <ul className="grid gap-3">
                {(beneficiaries.data || []).map((b: any) => (
                  <li key={b.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="font-medium">{b.full_name}</div>
                      <div className="text-xs text-muted-foreground">{b.relationship}</div>
                    </div>
                    <div className="text-sm font-semibold">{b.percentage}%</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No beneficiaries yet.</p>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const fd = new FormData(e.currentTarget as HTMLFormElement)
                await addBeneficiary.mutateAsync({
                  full_name: String(fd.get("full_name") || ""),
                  relationship: String(fd.get("relationship") || ""),
                  percentage: Number(fd.get("percentage") || 0),
                })
                ;(e.currentTarget as HTMLFormElement).reset()
              }}
              className="grid gap-3 sm:grid-cols-3 pt-2"
            >
              <Input name="full_name" placeholder="Full name" required />
              <Input name="relationship" placeholder="Relationship" required />
              <div className="flex gap-2">
                <Input name="percentage" type="number" min={0} max={100} placeholder="%" className="w-full" required />
                <Button type="submit" className="shrink-0">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
