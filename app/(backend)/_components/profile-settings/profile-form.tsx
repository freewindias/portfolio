"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { updateProfileSchema, type UpdateProfileValues } from "@/lib/validations/auth"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { data: session, isPending } = authClient.useSession()
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  })

  useEffect(() => {
    if (session?.user) {
      reset({
        name: session.user.name || "",
        image: session.user.image || "",
      })
    }
  }, [session, reset])

  const onSubmit = async (values: UpdateProfileValues) => {
    setIsLoading(true)
    try {
      const { error } = await authClient.updateUser({
        name: values.name,
        image: values.image || undefined,
      })

      if (error) {
        toast.error(error.message || "Failed to update profile")
      } else {
        toast.success("Profile updated successfully")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (isPending) {
    return <div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Loading profile...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
          <AvatarFallback className="text-xl">
            {session?.user?.name ? getInitials(session.user.name) : "FR"}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">Profile Picture</h2>
          <p className="text-sm text-muted-foreground">Update your profile picture.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            value={session?.user?.email || ""}
            disabled
            className="bg-muted"
          />
          <FieldDescription>Email cannot be changed.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="name">Display Name</FieldLabel>
          <Input
            id="name"
            placeholder="John Doe"
            {...register("name")}
          />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="upload">Upload Profile Image</FieldLabel>
          <Input
            id="upload"
            type="file"
            accept="image/*"
            disabled // Placeholder for now as per better-auth limitations without custom storage
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="image">Profile Image URL (Alternative)</FieldLabel>
          <Input
            id="image"
            placeholder="https://example.com/image.jpg"
            {...register("image")}
          />
          <FieldDescription>
            You can either upload an image or provide a direct link.
          </FieldDescription>
          <FieldError errors={[errors.image]} />
        </Field>

        <Button type="submit" disabled={isLoading} className="bg-black text-white hover:bg-black/90">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Profile
        </Button>
      </form>
    </div>
  )
}
