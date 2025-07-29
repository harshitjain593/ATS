"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

export default function HomePage() {
  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const router = useRouter()

  useEffect(() => {
    if (!isLoadingUser) {
      if (currentUser) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }
  }, [currentUser, isLoadingUser, router])

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
      <p className="text-muted-foreground">Loading application...</p>
    </div>
  )
}
