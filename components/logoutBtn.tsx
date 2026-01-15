"use client";

import React from 'react'
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";

import { cn } from "@/lib/utils";

const LogoutBtn = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ children, className, onClick, ...props }, ref) => {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();

  if (!isAuthenticated) return null;

  return (
    <button
      ref={ref}
      className={cn(
        "bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer",
        className
      )}
      onClick={(e) => {
        void signOut().then(() => {
          router.push("/");
        });
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
});

LogoutBtn.displayName = "LogoutBtn";

export default LogoutBtn;
