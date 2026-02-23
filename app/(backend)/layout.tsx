"use client";

import { AppSidebar } from "@/app/(backend)/_components/app-sidebar";
import { SiteHeader } from "@/app/(backend)/_components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import React from 'react';

export default function BackendLayout({ children }: { children: React.ReactNode }) {
  // Monitor user activity and auto-logout after 5 minutes of inactivity
  useInactivityLogout();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 px-4 py-6 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
