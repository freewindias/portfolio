"use client";

import * as React from "react";

import { NavUser } from "@/app/(backend)/_components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { House } from "lucide-react";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Home",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Update Frontend Data",
      items: [
        {
          title: "Hero Section",
          url: "/dashboard/update/hero",
        },
        {
          title: "Experience Section",
          url: "/dashboard/update/experience",
        },
        {
          title: "Projects Section",
          url: "/dashboard/update/projects",
        },
      ],
    },
    {
      title: "Finance",
      items: [
        {
          title: "Expense Tracker",
          url: "/dashboard/expense-tracker",
        },
      ],
    },
    {
      title: "Resume",
      items: [
        {
          title: "Resume Editor",
          url: "/dashboard/resume-editor",
        },
      ],
    },
    {
      title: "Important",
      items: [
        {
          title: "Notes",
          url: "/dashboard/notes",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Profile",
          url: "/dashboard/profile",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href="/" />}
            >
              <House
                strokeWidth={2}
                className="size-5!"
              />
              <span className="text-base font-semibold">Freewin Dias Portfolio</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton>
                  <span>{item.title}</span>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton render={<Link href={item.url} />}>
                          {item.title}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
