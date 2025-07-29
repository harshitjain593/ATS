"use client"

import type React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { UserNav } from "@/components/user-nav"
import { useUser } from "@/context/user-context"
import { usePathname } from "next/navigation"
import { MobileSidebar } from "@/components/mobile-sidebar"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const pathname = usePathname()

  // Don't render layout for login/signup pages
  if (pathname === "/login" || pathname === "/signup") {
    return <>{children}</>
  }

  if (isLoadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading application layout...</p>
      </div>
    )
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <MobileSidebar />
          <SidebarTrigger className="-ml-1 md:hidden" /> {/* Only visible on mobile */}
          <Separator orientation="vertical" className="mr-2 h-4 hidden md:block" />
          <h1 className="text-lg font-semibold">ATS System</h1>
          <div className="ml-auto">
            <UserNav />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
