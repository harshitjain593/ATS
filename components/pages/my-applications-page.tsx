"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockCandidates, mockJobs } from "@/data/mock-data"
import { useUser } from "@/context/user-context"
import { useEffect } from "react"
import { Calendar, Eye } from "lucide-react"
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function MyApplicationsPage() {
  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
    const router = useRouter()

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || currentUser.role !== "candidate")) {
      router.push("/login")
    }
  }, [currentUser, isLoadingUser, router])

  if (isLoadingUser || !currentUser || currentUser.role !== "candidate") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading applications...</p>
      </div>
    )
  }

  const myApplications = mockCandidates.filter((candidate) => candidate.id === currentUser.id && candidate.appliedJobId)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "ai_screening":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "screening":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "interview":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "offer":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "hired":
        return "bg-teal-500/20 text-teal-400 border-teal-500/30"
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Applications</h1>
          <p className="text-muted-foreground">View the status of your job applications.</p>
        </div>
      </div>

      {myApplications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            You haven't applied for any jobs yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myApplications.map((application) => {
            const job = mockJobs.find((j) => j.id === application.appliedJobId)
            if (!job) return null // Should not happen if appliedJobId is valid

            return (
              <Card key={application.id}>
                <CardHeader>
                  <CardTitle>{job.title}</CardTitle>
                  <CardDescription>
                    {job.company} - {job.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Applied on: {application.applicationDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline" className={getStatusColor(application.status)}>
                      Status: {application.status.toUpperCase()}
                    </Badge>
                  </div>
                  <Button
                    className="w-full mt-4 gap-2 bg-transparent"
                    variant="outline"
                    onClick={() => router.push(`/jobs/${job.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                    View Job Details
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
