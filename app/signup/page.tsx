"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useUser } from "@/context/user-context"
import { useToast } from "@/components/ui/use-toast"
import type { UserRole } from "@/lib/types"
import { createUser } from "@/redux/usersThunk"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "@/redux/store"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("candidate")
  const [isRegistering, setIsRegistering] = useState(false)
  const { signup, currentUser, isLoadingUser } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>()
  
  useEffect(() => {
    if (!isLoadingUser && currentUser) {
      router.push("/dashboard")
    }
  }, [currentUser, isLoadingUser, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
  
    const [firstName, ...rest] = name.trim().split(" ");
    const lastName = rest.join(" ") || "";
  
    try {
      const resultAction = await dispatch(createUser({
        firstName,
        lastName,
        email,
        mobile: "1234567890", // placeholder or add phone input later
        password,
        role,
      }));
  
      if (createUser.fulfilled.match(resultAction)) {
        toast({
          title: "Registration Successful",
          description: "Your account has been created. Welcome!",
        });
        router.push("/dashboard");
      } else {
        throw new Error("Signup failed");
      }
    } catch {
      toast({
        title: "Registration Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  
    setIsRegistering(false);
  };

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
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Create your account to get started.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <div className="grid gap-2">
              <Label htmlFor="role">Account Type</Label>
              <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="candidate">Candidate</SelectItem>
                  <SelectItem value="recruiter">Recruiter</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={isRegistering}>
              {isRegistering ? "Registering..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium hover:text-primary underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
