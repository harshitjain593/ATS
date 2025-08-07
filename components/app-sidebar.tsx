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
} from "lucide-react"

import { SearchForm } from "./search-form"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
      <Sidebar {...props}>
        <SidebarHeader>
          <SearchForm />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Loading...</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-2 text-xs text-muted-foreground">
          Crewpilot © {new Date().getFullYear()}
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
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
    // {
    //   title: "Analytics",
    //   href: "/analytics",
    //   icon: BarChart,
    //   active: pathname.startsWith("/analytics"),
    // },
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

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {currentUser ? (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>
                {currentUser.role === "candidate" ? "My Journey" : "ATS Management"}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {(currentUser.role === "candidate" ? candidateNav : recruiterAdminNav).map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={item.active}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/profile">
                        <User />
                        <span>Profile</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Button variant="ghost" className="w-full justify-start gap-2" onClick={logout}>
                      <LogIn className="rotate-180" />
                      <span>Logout</span>
                    </Button>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel>Access</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {authNav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.active}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2 text-xs text-muted-foreground">
        Crewpilot © {new Date().getFullYear()}
          {currentUser && (
            <div className="mt-1">
              Logged in as: <span className="font-medium">{currentUser.email}</span> (
              <span className="capitalize">{currentUser.role}</span>)
            </div>
          )}
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
