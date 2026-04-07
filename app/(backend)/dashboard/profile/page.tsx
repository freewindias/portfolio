import { ProfileForm } from "../../_components/profile-settings/profile-form"
import { ChangePasswordForm } from "../../_components/profile-settings/change-password-form"
import { Separator } from "@/components/ui/separator"

export default function Page() {
  return (
    <div className="container max-w-4xl space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile information.
        </p>
      <Separator />
      <ProfileForm />
      <Separator />
      <ChangePasswordForm />
    </div>
  );
}
