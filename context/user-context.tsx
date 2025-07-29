"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { authenticateUser, registerUser, getUserById } from "@/lib/auth"
import type { User, UserRole } from "@/lib/types"
import { useRouter } from "next/navigation"

type UserContextType = {
  currentUser: User | null
  isLoadingUser: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // On mount, try to load user from localStorage
    const storedUserId = localStorage.getItem("currentUserId")
    if (storedUserId) {
      const user = getUserById(storedUserId)
      if (user) {
        setCurrentUser(user)
      }
    }
    setIsLoadingUser(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoadingUser(true)
    const user = authenticateUser(email, password)
    if (user) {
      setCurrentUser(user)
      localStorage.setItem("currentUserId", user.id)
      setIsLoadingUser(false)
      return true
    }
    setIsLoadingUser(false)
    return false
  }, [])

  const signup = useCallback(async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoadingUser(true)
    const user = registerUser(name, email, password, role)
    if (user) {
      setCurrentUser(user)
      localStorage.setItem("currentUserId", user.id)
      setIsLoadingUser(false)
      return true
    }
    setIsLoadingUser(false)
    return false
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    localStorage.removeItem("currentUserId")
    router.push("/login")
  }, [router])

  return (
    <UserContext.Provider value={{ currentUser, isLoadingUser, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
