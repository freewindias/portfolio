"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LogOut } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export function NavUser({
  user: initialUser,
}: {
  user?: {
    name?: string
    email?: string
    avatar?: string
  }
}) {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  
  const user = {
    name: session?.user.name || initialUser?.name || "User",
    email: session?.user.email || initialUser?.email || "",
    avatar: session?.user.image || initialUser?.avatar || "",
  }

  const handleLogout = async () => {
    await authClient.signOut()
    router.push("/")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-1 group/nav-user hover:bg-sidebar-accent/20 transition-all duration-300">
          <Avatar className="size-10 rounded-full grayscale shrink-0 border border-sidebar-border shadow-sm group-hover/nav-user:grayscale-0 transition-all duration-500">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-full bg-sidebar-primary text-sidebar-primary-foreground font-bold">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 text-left text-sm leading-tight min-w-0">
            <span className="truncate font-semibold text-sidebar-foreground">{user.name}</span>
            <span className="truncate text-[11px] text-sidebar-foreground/60 lowercase font-medium">
              {user.email}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="group/logout flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-sidebar-foreground/50 hover:bg-destructive/10 hover:text-destructive shrink-0 border border-transparent hover:border-destructive/20 active:scale-95"
            title="Log out"
          >
            <LogOut className="size-4" strokeWidth={2.5} />
            <span className="text-[8px] font-black uppercase tracking-tighter">Log Out</span>
          </button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
