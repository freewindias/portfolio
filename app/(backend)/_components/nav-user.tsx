"use client"

import {
    IconLogout
} from "@tabler/icons-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar"

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar"

import LogoutBtn from "@/components/logoutBtn"

import { api } from "@/convex/_generated/api"
import { useQuery } from "convex/react"

export function NavUser() {
  const user = useQuery(api.users.currentUser)

  if (!user) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
           <SidebarMenuButton size="lg">
             <div className="h-8 w-8 rounded-lg bg-sidebar-accent animate-pulse" />
             <div className="flex-1 space-y-2">
               <div className="h-4 w-20 bg-sidebar-accent animate-pulse rounded" />
               <div className="h-3 w-16 bg-sidebar-accent animate-pulse rounded" />
             </div>
           </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          asChild
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar ring-0 hover:text-sidebar-foreground"
        >
          <div>
            <Avatar className="h-8 w-8 rounded-lg grayscale">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </div>
            <LogoutBtn className="bg-transparent hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground shadow-none hover:shadow-none p-1 h-auto flex flex-col items-center justify-center gap-0.5 rounded-md">
              <IconLogout className="size-4" />
              <span className="text-[10px] leading-none font-medium">logout</span>
            </LogoutBtn>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
