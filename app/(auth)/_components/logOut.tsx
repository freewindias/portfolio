"use client"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

export function LogOutButton() {
    const router = useRouter();
    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/");
    }
    return (
        <button className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer" onClick={handleLogout}>
            Log Out
        </button>
    )
}