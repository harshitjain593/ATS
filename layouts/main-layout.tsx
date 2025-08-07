"use client"

import type React from "react"

import { TopNavigation } from "@/components/top-navigation"
import { usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { useState, useEffect } from "react"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Don't render layout for login/signup pages
  if (pathname === "/login" || pathname === "/signup") {
    return <>{children}</>
  }

  // Show loading state during SSR and initial client render
  if (!isClient || isLoadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading application layout...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavigation />
      <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        {children}
      </main>
    </div>
  )
}
