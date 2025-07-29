"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useUser } from "@/context/user-context"
import { useToast } from "@/components/ui/use-toast"
import { authenticateUser } from "@/redux/usersThunk"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "@/redux/store"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const { login, currentUser, isLoadingUser } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>()
  const authUser = useSelector((state: RootState) => state.users.authUser)
  const loadingAuth = useSelector((state: RootState) => state.users.loadingAuth)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAuthenticating(true)

    try {
      const resultAction = await dispatch(authenticateUser({ mobileOrEmail: email, password }))
      if (authenticateUser.fulfilled.match(resultAction)) {
        const token = resultAction.payload.token
        localStorage.setItem("authToken", token)
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        })
        if (window.location.pathname !== "/dashboard") {
          router.push("/dashboard")
        }
        console.log("Login success, token:", token)
      } else {
        throw new Error("Login failed")
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials or server error.",
        variant: "destructive",
      })
    } finally {
      setIsAuthenticating(false)
    }
  }


  if (isLoadingUser || currentUser) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isAuthenticating}>
              {isAuthenticating ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium hover:text-primary underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
