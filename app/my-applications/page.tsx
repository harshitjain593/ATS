"use client"

import { Button } from "@/components/ui/button"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, ChevronDown, Briefcase, MapPin, Clock, Calendar, Eye } from "lucide-react"
import { mockJobs, mockCandidates } from "@/data/mock-data"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MatchScoreRing } from "@/components/match-score-ring"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

export default function MyApplicationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const router = useRouter()

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || currentUser.role !== "candidate")) {
      router.push("/login")
    }
  }, [currentUser, isLoadingUser, router])

  const myApplications = useMemo(() => {
    if (!currentUser) return []
    const candidate = mockCandidates.find((c) => c.id === currentUser.id)
    if (!candidate) return []

    return candidate.appliedJobs
      .map((appliedJob) => {
        const job = mockJobs.find((j) => j.id === appliedJob.jobId)
        return job ? { ...job, matchScore: appliedJob.matchScore } : null
      })
      .filter(Boolean) as ((typeof mockJobs)[0] & { matchScore: number })[]
  }, [currentUser])

  const filteredApplications = useMemo(() => {
    let applications = myApplications

    if (filterType !== "all") {
      applications = applications.filter((app) => app.type === filterType)
    }

    if (filterStatus !== "all") {
      applications = applications.filter((app) => app.status === filterStatus)
    }

    if (searchTerm) {
      applications = applications.filter(
        (app) =>
          app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    return applications
  }, [searchTerm, filterType, filterStatus, myApplications])

  const getStatusColor = (status: (typeof mockJobs)[0]["status"]) => {
    switch (status) {
      case "Open":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Closed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "Draft":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (isLoadingUser || !currentUser || currentUser.role !== "candidate") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading my applications...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Applications</h1>
        <p className="text-muted-foreground">Track the status of your job applications.</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              Type: {filterType === "all" ? "All" : filterType}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterType("all")}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("Full-time")}>Full-time</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("Part-time")}>Part-time</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("Contract")}>Contract</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("Internship")}>Internship</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              Status: {filterStatus === "all" ? "All" : filterStatus}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterStatus("all")}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Open")}>Open</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Closed")}>Closed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Draft")}>Draft</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Application Listings */}
      {filteredApplications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No applications found matching your criteria.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredApplications.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{job.title}</CardTitle>
                  <Badge className={getStatusColor(job.status)} variant="outline">
                    {job.status}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> {job.company}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Posted: {job.postedDate}</span>
                </div>
                {job.matchScore !== undefined && (
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm font-medium">Your Match Score:</span>
                    <MatchScoreRing score={job.matchScore} />
                  </div>
                )}
                <Link href={`/jobs/${job.id}`}>
                  <Button variant="outline" className="w-full mt-4 gap-2 bg-transparent">
                    <Eye className="h-4 w-4" />
                    View Job Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
