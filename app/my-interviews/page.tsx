"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, ChevronDown, User, Briefcase, Clock, Calendar } from "lucide-react"
import { mockInterviews, mockJobs, mockUsers } from "@/data/mock-data"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"
import dayjs from "dayjs";
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

export default function MyInterviewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const router = useRouter()

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || currentUser.role !== "candidate")) {
      router.push("/login")
    }
  }, [currentUser, isLoadingUser, router])

  const myInterviews = useMemo(() => {
    if (!currentUser) return []
    return mockInterviews.filter((interview) => interview.candidateId === currentUser.id)
  }, [currentUser])

  const filteredInterviews = useMemo(() => {
    let interviews = myInterviews

    if (filterStatus !== "all") {
      interviews = interviews.filter((interview) => interview.status === filterStatus)
    }

    if (searchTerm) {
      interviews = interviews.filter((interview) => {
        const job = mockJobs.find((j) => j.id === interview.jobId)
        const interviewer = mockUsers.find((u) => u.id === interview.interviewerId)

        return (
          job?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          interviewer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          interview.type.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }
    return interviews
  }, [searchTerm, filterStatus, myInterviews])

  const getStatusColor = (status: (typeof mockInterviews)[0]["status"]) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Canceled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  // Helper to check if interview is joinable (for testing, always true for scheduled)
  const isJoinable = (interview: any) => interview.status === "Scheduled";

  if (isLoadingUser || !currentUser || currentUser.role !== "candidate") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading my interviews...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Interviews</h1>
        <p className="text-muted-foreground">View your upcoming and past interview schedule.</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search interviews by job, interviewer, or type..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              Status: {filterStatus === "all" ? "All" : filterStatus}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterStatus("all")}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Scheduled")}>Scheduled</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Completed")}>Completed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Canceled")}>Canceled</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Interview Listings */}
      {filteredInterviews.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No interviews found matching your criteria.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredInterviews.map((interview) => {
            const job = mockJobs.find((j) => j.id === interview.jobId)
            const interviewer = mockUsers.find((u) => u.id === interview.interviewerId)

            return (
              <Card key={interview.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{job?.title || "N/A"}</CardTitle>
                    <Badge className={getStatusColor(interview.status)} variant="outline">
                      {interview.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Interviewer: {interviewer?.name || "N/A"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Date: {interview.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Time: {interview.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>Type: {interview.type}</span>
                  </div>
                  {/* Join button logic */}
                  {isJoinable(interview) && (
                    <Button
                      className="w-full mt-4"
                      onClick={() => {
                        if (interview.type === "ai") {
                          router.push(`/my-interviews/ai/${interview.id}`);
                        } else if (interview.type === "virtual") {
                          router.push(`/my-interviews/virtual/${interview.id}`);
                        }
                      }}
                    >
                      Join
                    </Button>
                  )}
                  {interview.status === "Completed" && interview.feedback && (
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">Feedback:</p>
                      <p className="line-clamp-2">{interview.feedback}</p>
                    </div>
                  )}
                  {interview.status === "Completed" && interview.score !== undefined && (
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium">Score: {interview.score}/5</p>
                    </div>
                  )}
                  {interview.status === "Completed" && (
                    <Link href={`/interviews/ai-results/${interview.id}`}>
                      <Button variant="outline" className="w-full mt-4 bg-transparent">
                        View AI Analysis
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
