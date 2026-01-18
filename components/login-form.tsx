"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthActions } from "@convex-dev/auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input" 


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { signIn } = useAuthActions();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    formData.set("flow", "signIn"); // Hardcode flow to signIn
    void signIn("password", formData)
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      })
      .then(() => {
        window.sessionStorage.setItem("active_session", "true");
        router.push("/dashboard");
      });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
             {/* Logo */}
            <div className="flex size-20 items-center justify-center rounded-md overflow-hidden mb-2">
                <Image 
                    src="/logo.jpeg" 
                    alt="Logo" 
                    width={80} 
                    height={80} 
                    className="object-cover"
                />
            </div>
            
            <h1 className="text-xl font-bold">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Login to your account
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              minLength={8}
              required
            />
          </Field>

          <Field>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Loading..." : "Login"}
            </Button>
          </Field>

          {error && (
            <div className="text-destructive text-sm text-center">
              {error}
            </div>
          )}


          <div className="text-center w-full">
            <Button variant="outline" asChild className="rounded-full px-6 py-5 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 text-base font-normal">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4 ml-1" />Back to Home
              </Link>
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}
