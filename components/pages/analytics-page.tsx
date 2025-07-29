"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockJobs, mockCandidates, mockInterviews, mockOffers } from "@/data/mock-data"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
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
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";




export function AnalyticsPage() {
  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
    const router = useRouter()

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || currentUser.role === "candidate")) {
      router.push("/login")
    }
  }, [currentUser, isLoadingUser, router])

  const jobStatusData = useMemo(() => {
    const counts = mockJobs.reduce(
      (acc, job) => {
        acc[job.status] = (acc[job.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return Object.entries(counts).map(([status, count]) => ({
      name: status,
      value: count,
      fill: `hsl(var(--chart-${Object.keys(counts).indexOf(status) + 1}))`,
    }))
  }, [])

  const candidateStatusData = useMemo(() => {
    const counts = mockCandidates.reduce(
      (acc, candidate) => {
        acc[candidate.status] = (acc[candidate.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return Object.entries(counts).map(([status, count]) => ({
      name: status,
      value: count,
      fill: `hsl(var(--chart-${Object.keys(counts).indexOf(status) + 1}))`,
    }))
  }, [])

  const interviewsPerMonthData = useMemo(() => {
    const monthlyCounts = mockInterviews.reduce(
      (acc, interview) => {
        const monthYear = new Date(interview.date).toLocaleString("en-US", { month: "short", year: "numeric" })
        acc[monthYear] = (acc[monthYear] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Sort by month and year for consistent display
    const sortedMonths = Object.keys(monthlyCounts).sort((a, b) => {
      const [monthA, yearA] = a.split(" ")
      const [monthB, yearB] = b.split(" ")
      const dateA = new Date(`1 ${monthA} ${yearA}`)
      const dateB = new Date(`1 ${monthB} ${yearB}`)
      return dateA.getTime() - dateB.getTime()
    })

    return sortedMonths.map((monthYear) => ({
      month: monthYear,
      interviews: monthlyCounts[monthYear],
    }))
  }, [])

  const offerStatusData = useMemo(() => {
    const counts = mockOffers.reduce(
      (acc, offer) => {
        acc[offer.status] = (acc[offer.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return Object.entries(counts).map(([status, count]) => ({
      name: status,
      value: count,
      fill: `hsl(var(--chart-${Object.keys(counts).indexOf(status) + 1}))`,
    }))
  }, [])

  if (isLoadingUser || !currentUser || currentUser.role === "candidate") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics Overview</h1>
        <p className="text-muted-foreground">Detailed insights into your recruitment pipeline.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Job Status Distribution</CardTitle>
            <CardDescription>Breakdown of jobs by their current status.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer
              config={{
                value: { label: "Jobs" },
                Open: { color: "hsl(var(--chart-1))" },
                Closed: { color: "hsl(var(--chart-2))" },
                Draft: { color: "hsl(var(--chart-3))" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <Pie
                    data={jobStatusData}
                    dataKey="value"
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

        <Card>
          <CardHeader>
            <CardTitle>Candidate Status Distribution</CardTitle>
            <CardDescription>Overview of candidates across different stages.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer
              config={{
                value: { label: "Candidates" },
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
                    data={candidateStatusData}
                    dataKey="value"
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

        <Card>
          <CardHeader>
            <CardTitle>Interviews Scheduled Per Month</CardTitle>
            <CardDescription>Trend of interviews over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                interviews: { label: "Interviews", color: "hsl(var(--primary))" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={interviewsPerMonthData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="interviews" stroke="var(--color-interviews)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Offer Status Distribution</CardTitle>
            <CardDescription>Breakdown of job offers by their current status.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ChartContainer
              config={{
                value: { label: "Offers" },
                Pending: { color: "hsl(var(--chart-1))" },
                Accepted: { color: "hsl(var(--chart-2))" },
                Rejected: { color: "hsl(var(--chart-3))" },
                Withdrawn: { color: "hsl(var(--chart-4))" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <Pie
                    data={offerStatusData}
                    dataKey="value"
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

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Skills in Candidates</CardTitle>
            <CardDescription>Most common skills among all candidates.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Count" },
                skill: { color: "hsl(var(--primary))" },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(
                    mockCandidates.reduce(
                      (acc, c) => {
                        c.skills.forEach((s) => (acc[s] = (acc[s] || 0) + 1))
                        return acc
                      },
                      {} as Record<string, number>,
                    ),
                  )
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([name, count]) => ({ name, count }))}
                  layout="vertical"
                >
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" dataKey="count" />
                  <YAxis type="category" dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-skill)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
