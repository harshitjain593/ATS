"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Briefcase,
  Users,
  CalendarCheck,
  Handshake,
  BarChart,
  FileText,
  LayoutDashboard,
  LogIn,
  UserPlus,
  User,
  Loader2,
  GitBranch,
  MoreHorizontal,
  Settings,
} from "lucide-react"

import { SearchForm } from "./search-form"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/user-context"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"

export function TopNavigation() {
  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const { logout } = useUser()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Show loading state during SSR and initial client render to prevent hydration mismatch
  if (!isClient || isLoadingUser) {
    return (
      <div className="flex h-16 items-center justify-center border-b px-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  const recruiterAdminNav = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      title: "Jobs",
      href: "/jobs",
      icon: Briefcase,
      active: pathname.startsWith("/jobs"),
    },
    {
      title: "Candidates",
      href: "/candidates",
      icon: Users,
      active: pathname.startsWith("/candidates"),
    },
    {
      title: "Interviews",
      href: "/interviews",
      icon: CalendarCheck,
      active: pathname.startsWith("/interviews"),
    },
    {
      title: "Offers",
      href: "/offers",
      icon: Handshake,
      active: pathname.startsWith("/offers"),
    },
    {
      title: "Pipeline Stages",
      href: "/stages",
      icon: GitBranch,
      active: pathname.startsWith("/stages"),
    },
    {
      title: "Resume Parser",
      href: "/resume-parser",
      icon: FileText,
      active: pathname.startsWith("/resume-parser"),
    },
    {
      title: "Agency Workflow",
      href: "/agency-workflow",
      icon: BarChart,
      active: pathname.startsWith("/agency-workflow"),
    },
  ]

  const candidateNav = [
    {
      title: "Find Jobs",
      href: "/my-jobs",
      icon: Briefcase,
      active: pathname.startsWith("/my-jobs"),
    },
    {
      title: "My Applications",
      href: "/my-applications",
      icon: Briefcase,
      active: pathname.startsWith("/my-applications"),
    },
    {
      title: "My Interviews",
      href: "/my-interviews",
      icon: CalendarCheck,
      active: pathname.startsWith("/my-interviews"),
    },
    {
      title: "My Offers",
      href: "/my-offers",
      icon: Handshake,
      active: pathname.startsWith("/my-offers"),
    },
    {
      title: "Resume Builder AI",
      href: "/resume-builder",
      icon: FileText,
      active: pathname.startsWith("/resume-builder"),
    },
  ]

  const authNav = [
    {
      title: "Login",
      href: "/login",
      icon: LogIn,
      active: pathname === "/login",
    },
    {
      title: "Sign Up",
      href: "/signup",
      icon: UserPlus,
      active: pathname === "/signup",
    },
  ]

  const getActiveNav = () => {
    if (!currentUser) return authNav
    return currentUser.role === "candidate" ? candidateNav : recruiterAdminNav
  }

  const activeNav = getActiveNav()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex items-center gap-4">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <h1 className="text-lg font-semibold">Crewpilot</h1>
        </Link>
        <Separator orientation="vertical" className="h-4" />
        
        {/* Main Navigation */}
        <nav className="flex items-center gap-1">
          {activeNav.slice(0, 4).map((item) => (
            <Button
              key={item.title}
              variant={item.active ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4 mr-2" />
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>

        {/* More dropdown for additional items */}
        {activeNav.length > 4 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>More Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {activeNav.slice(4).map((item) => (
                <DropdownMenuItem key={item.title} asChild>
                  <Link href={item.href} className="flex items-center">
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:block">
          <SearchForm />
        </div>
        
        <Separator orientation="vertical" className="h-4" />

        {/* User Menu */}
        {currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{currentUser.name || currentUser.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="flex items-center">
                <LogIn className="h-4 w-4 mr-2 rotate-180" />
                Logout
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                <div>Logged in as: {currentUser.email}</div>
                <div className="capitalize">Role: {currentUser.role}</div>
                <div className="mt-1">CrewPilot © {new Date().getFullYear()}</div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            {authNav.map((item) => (
              <Button key={item.title} variant="ghost" size="sm" asChild>
                <Link href={item.href}>
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
} 