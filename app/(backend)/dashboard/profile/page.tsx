import { ProfileForm } from "../../_components/settings/profile-form"
import { ChangePasswordForm } from "../../_components/settings/change-password-form"
import { Separator } from "@/components/ui/separator"

export default function Page() {
  return (
    <div className="container max-w-4xl py-6 space-y-10">
      <div className="space-y-0.5">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile information.
        </p>
      </div>
      <Separator />
      <ProfileForm />
      <Separator />
      <ChangePasswordForm />
    </div>
  );
}
