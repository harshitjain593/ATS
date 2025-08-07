"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, Users, Handshake, CalendarCheck, TrendingUp, Clock, CheckCircle, AlertCircle, Plus, Eye } from "lucide-react"
import { mockJobs, mockCandidates, mockInterviews, mockOffers } from "@/data/mock-data"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import Link from "next/link"

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
  Tooltip,
} from "recharts"

export function DashboardPage() {
  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const router = useRouter()

  useEffect(() => {
    if (!isLoadingUser && !currentUser) {
      router.push("/login")
    }
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
        change: "+12%",
        changeType: "positive" as const,
        roles: ["admin", "recruiter"],
      },
      {
        title: "Total Candidates",
        value: candidates.length,
        icon: Users,
        description: `${candidates.filter((candidate) => candidate.status === "New").length} new candidates`,
        change: "+8%",
        changeType: "positive" as const,
        roles: ["admin", "recruiter"],
      },
      {
        title: "Total Interviews",
        value: interviews.length,
        icon: CalendarCheck,
        description: `${interviews.filter((interview) => interview.status === "Scheduled").length} scheduled`,
        change: "+15%",
        changeType: "positive" as const,
        roles: ["admin", "recruiter"],
      },
      {
        title: "Total Offers",
        value: offers.length,
        icon: Handshake,
        description: `${offers.filter((offer) => offer.status === "Pending").length} pending`,
        change: "+5%",
        changeType: "positive" as const,
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
          change: "+2",
          changeType: "positive" as const,
          roles: ["candidate"],
        },
        {
          title: "My Interviews",
          value: interviews.length,
          icon: CalendarCheck,
          description: `${interviews.filter((i) => i.status === "Scheduled").length} scheduled`,
          change: "+1",
          changeType: "positive" as const,
          roles: ["candidate"],
        },
        {
          title: "My Offers",
          value: offers.length,
          icon: Handshake,
          description: `${offers.filter((o) => o.status === "Pending").length} pending`,
          change: "0",
          changeType: "neutral" as const,
          roles: ["candidate"],
        },
        {
          title: "Response Rate",
          value: "85%",
          icon: TrendingUp,
          description: "Average response time",
          change: "+5%",
          changeType: "positive" as const,
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
      value: count,
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

    return Object.entries(monthlyCounts)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))
  }, [interviews])

  const recentActivities = useMemo(() => {
    const activities = []
    
    // Add recent job applications
    candidates.slice(0, 3).forEach(candidate => {
      activities.push({
        type: "application",
        title: `${candidate.name} applied for a position`,
        time: "2 hours ago",
        status: "new"
      })
    })

    // Add recent interviews
    interviews.slice(0, 2).forEach(interview => {
      activities.push({
        type: "interview",
        title: `Interview scheduled for ${interview.date}`,
        time: "1 day ago",
        status: "scheduled"
      })
    })

    return activities
  }, [candidates, interviews])

  const topSkills = useMemo(() => {
    const skillCounts = candidates.reduce((acc, candidate) => {
      candidate.skills.forEach(skill => {
        acc[skill] = (acc[skill] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    return Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([skill, count]) => ({ skill, count }))
  }, [candidates])

  if (isLoadingUser || !currentUser) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {currentUser.firstName|| currentUser.email}. Here's what's happening today.</p>
        </div>
        {(currentUser.role === "admin" || currentUser.role === "recruiter") && (
          <Button asChild>
            <Link href="/jobs">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Link>
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
              <div className="flex items-center mt-2">
                <Badge 
                  variant={stat.changeType === "positive" ? "default" : stat.changeType === "negative" ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
                <span className="text-xs text-muted-foreground ml-2">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Additional Info */}
      {(currentUser.role === "admin" || currentUser.role === "recruiter") && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Charts Row */}
          <div className="grid gap-6 lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Jobs by Status</CardTitle>
                  <CardDescription>Current status of all job postings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={jobsByStatusData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Candidates by Status</CardTitle>
                  <CardDescription>Distribution of candidates across different stages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={candidatesByStatusData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label
                        />
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Interviews Over Time</CardTitle>
                <CardDescription>Number of interviews scheduled per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={interviewsOverTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info Row */}
          <div className="grid gap-6 lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest updates from your ATS</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === "new" ? "bg-blue-500" : 
                          activity.status === "scheduled" ? "bg-green-500" : "bg-gray-500"
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Skills in Demand</CardTitle>
                  <CardDescription>Most common skills among candidates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topSkills.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{skill.skill}</span>
                        <Badge variant="secondary">{skill.count} candidates</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/jobs">
                      <Briefcase className="h-4 w-4 mr-2" />
                      View All Jobs
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/candidates">
                      <Users className="h-4 w-4 mr-2" />
                      View Candidates
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/interviews">
                      <CalendarCheck className="h-4 w-4 mr-2" />
                      Schedule Interview
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link href="/offers">
                      <Handshake className="h-4 w-4 mr-2" />
                      Manage Offers
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Candidate Dashboard */}
      {currentUser.role === "candidate" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>My Recent Applications</CardTitle>
              <CardDescription>Track your job applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.slice(0, 3).map((job, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                    <Badge variant={job.status === "Open" ? "default" : "secondary"}>
                      {job.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Interviews</CardTitle>
              <CardDescription>Your scheduled interviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interviews.slice(0, 3).map((interview, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{interview.date}</p>
                      <p className="text-sm text-muted-foreground">{interview.time}</p>
                    </div>
                    <Badge variant={interview.status === "Scheduled" ? "default" : "secondary"}>
                      {interview.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
