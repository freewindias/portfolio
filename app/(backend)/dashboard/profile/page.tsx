"use client";

import ProfileForm from "@/app/(backend)/_components/profile-form";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export default function ProfilePage() {
  const user = useQuery(api.users.currentUser);

  if (user === undefined) {
    return <div className="p-8">Loading...</div>;
  }

  if (user === null) {
    return <div className="p-8">Please sign in to view your profile.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile information.
        </p>
      </div>
      <Separator />
      <ProfileForm initialData={user} />
    </div>
  );
}
