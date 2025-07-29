"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Briefcase, Users, Handshake, CalendarCheck } from "lucide-react"
import { mockJobs, mockCandidates, mockInterviews, mockOffers } from "@/data/mock-data"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function DashboardPage() {
  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const router = useRouter()

  useEffect(() => {
    if (!isLoadingUser && !currentUser) {
      router.push("/login")
    }

    console.log(currentUser, "  " , isLoadingUser)
  }, [currentUser, isLoadingUser, router])

  const filteredData = useMemo(() => {
    if (!currentUser) return { jobs: [], candidates: [], interviews: [], offers: [] }

    const jobs =
      currentUser.role === "candidate"
        ? mockJobs.filter((job) =>
            mockCandidates.find((c) => c.id === currentUser.id)?.appliedJobs.some((aj) => aj.jobId === job.id),
          )
        : mockJobs

    const candidates =
      currentUser.role === "candidate" ? mockCandidates.filter((c) => c.id === currentUser.id) : mockCandidates

    const interviews =
      currentUser.role === "candidate"
        ? mockInterviews.filter((interview) => interview.candidateId === currentUser.id)
        : mockInterviews

    const offers =
      currentUser.role === "candidate" ? mockOffers.filter((offer) => offer.candidateId === currentUser.id) : mockOffers

    return { jobs, candidates, interviews, offers }
  }, [currentUser])

  const { jobs, candidates, interviews, offers } = filteredData

  const stats = useMemo(() => {
    const baseStats = [
      {
        title: "Total Jobs",
        value: jobs.length,
        icon: Briefcase,
        description: `${jobs.filter((job) => job.status === "Open").length} open positions`,
        roles: ["admin", "recruiter"],
      },
      {
        title: "Total Candidates",
        value: candidates.length,
        icon: Users,
        description: `${candidates.filter((candidate) => candidate.status === "New").length} new candidates`,
        roles: ["admin", "recruiter"],
      },
      {
        title: "Total Interviews",
        value: interviews.length,
        icon: CalendarCheck,
        description: `${interviews.filter((interview) => interview.status === "Scheduled").length} scheduled`,
        roles: ["admin", "recruiter"],
      },
      {
        title: "Total Offers",
        value: offers.length,
        icon: Handshake,
        description: `${offers.filter((offer) => offer.status === "Pending").length} pending`,
        roles: ["admin", "recruiter"],
      },
    ]

    if (currentUser?.role === "candidate") {
      return [
        {
          title: "My Applications",
          value: jobs.length,
          icon: Briefcase,
          description: "Jobs you have applied for",
          roles: ["candidate"],
        },
        {
          title: "My Interviews",
          value: interviews.length,
          icon: CalendarCheck,
          description: `${interviews.filter((i) => i.status === "Scheduled").length} scheduled`,
          roles: ["candidate"],
        },
        {
          title: "My Offers",
          value: offers.length,
          icon: Handshake,
          description: `${offers.filter((o) => o.status === "Pending").length} pending`,
          roles: ["candidate"],
        },
      ]
    }
    return baseStats
  }, [jobs, candidates, interviews, offers, currentUser])

  const jobsByStatusData = useMemo(() => {
    const statusCounts = jobs.reduce(
      (acc, job) => {
        acc[job.status] = (acc[job.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      count,
      fill: `hsl(var(--chart-${Object.keys(statusCounts).indexOf(status) + 1}))`,
    }))
  }, [jobs])

  const candidatesByStatusData = useMemo(() => {
    const statusCounts = candidates.reduce(
      (acc, candidate) => {
        acc[candidate.status] = (acc[candidate.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      count,
      fill: `hsl(var(--chart-${Object.keys(statusCounts).indexOf(status) + 1}))`,
    }))
  }, [candidates])

  const interviewsOverTimeData = useMemo(() => {
    const monthlyCounts = interviews.reduce(
      (acc, interview) => {
        const month = new Date(interview.date).toLocaleString("en-US", { month: "short", year: "2-digit" })
        acc[month] = (acc[month] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Sort by month (simple alphabetical for now, could be improved for chronological)
    return Object.entries(monthlyCounts)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }, [interviews])

  if (isLoadingUser || !currentUser) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your ATS activities.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {(currentUser.role === "admin" || currentUser.role === "recruiter") && (
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Jobs by Status</CardTitle>
              <CardDescription>Current status of all job postings.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  count: { label: "Jobs" },
                  Open: { color: "hsl(var(--chart-1))" },
                  Closed: { color: "hsl(var(--chart-2))" },
                  Draft: { color: "hsl(var(--chart-3))" },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={jobsByStatusData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-name)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Candidates by Status</CardTitle>
              <CardDescription>Distribution of candidates across different stages.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ChartContainer
                config={{
                  count: { label: "Candidates" },
                  New: { color: "hsl(var(--chart-1))" },
                  Reviewed: { color: "hsl(var(--chart-2))" },
                  "AI Screening": { color: "hsl(var(--chart-3))" },
                  Interviewing: { color: "hsl(var(--chart-4))" },
                  Offered: { color: "hsl(var(--chart-5))" },
                  Hired: { color: "hsl(var(--chart-6))" },
                  Rejected: { color: "hsl(var(--chart-7))" },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                    <Pie
                      data={candidatesByStatusData}
                      dataKey="count"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={80}
                      fill="var(--color-name)"
                      label
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Interviews Over Time</CardTitle>
              <CardDescription>Number of interviews scheduled per month.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  count: { label: "Interviews" },
                  interviews: { color: "hsl(var(--primary))" },
                }}
                className="h-[250px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={interviewsOverTimeData}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="count" stroke="var(--color-interviews)" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
