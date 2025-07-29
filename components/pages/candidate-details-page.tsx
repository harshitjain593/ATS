"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, Mail, Phone, Briefcase, CalendarCheck, Handshake, Eye, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { MatchScoreRing } from "@/components/match-score-ring"
import { AiRecruiterCopilot } from "@/components/ai-recruiter-copilot"
import { AiInterview } from "@/components/ai-interview"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { fetchUserById } from "@/redux/usersThunk"
import { RootState, AppDispatch } from "@/redux/store"
import { mockJobs, mockInterviews, mockOffers } from "@/data/mock-data" // For other sections for now
import { UserApi } from "@/lib/types"

export function CandidateDetailsPage({ candidateId }: { candidateId: string }) {
  const router = useRouter()

  const dispatch = useDispatch<AppDispatch>()
  const {
    selectedUser: candidate,
    loadingSelected,
    errorSelected,
  } = useSelector((state: RootState) => state.users)

  useEffect(() => {
    if (candidateId) {
      dispatch(fetchUserById(Number(candidateId)))
    }
  }, [candidateId, dispatch])
  // candidate is the API response: { user: {...}, jobTitles: [...] }
  // Support both new API shape ({user, jobTitles}) and fallback to candidate as user
  const user = (candidate as any)?.user || candidate || {};
  const appliedJobs = (candidate as any)?.jobTitles || [];
  // TODO: Replace interviews and offers with real data if available
  const interviews: any[] = [];
  const offers: any[] = [];

  if (loadingSelected) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (errorSelected || !user || Object.keys(user).length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-background">
        <p className="text-destructive">{errorSelected || "Candidate not found."}</p>
        <Button variant="link" onClick={() => router.back()} className="mt-4">
          <ChevronLeft className="h-4 w-4 mr-2" /> Back to Candidates
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: any) => {
    switch (status) {
      case "New":
      case "Pending":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Reviewed":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "AI Screening":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
      case "Interviewing":
      case "Scheduled":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Offered":
      case "Accepted":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Hired":
      case "Completed":
        return "bg-teal-500/20 text-teal-400 border-teal-500/30"
      case "Rejected":
      case "Canceled":
      case "Withdrawn":
        return "bg-red-500/20 text-red-400 border-red-500/30"
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Candidates
        </Button>
        <div className="flex items-center gap-2">
          <AiRecruiterCopilot
            jobDescription={appliedJobs[0]?.description || ""}
            candidateResume={""} // No resume field on UserApi
          />
          {appliedJobs.length > 0 && (
            <AiInterview candidateName={`${user.firstName} ${user.lastName}`} jobTitle={appliedJobs[0]?.title || "a position"} />
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.filePath || "/placeholder.svg?height=32&width=32"} />
            <AvatarFallback className="text-2xl">{`${user.firstName?.slice(0, 1) || ''}${user.lastName?.slice(0, 1) || ''}`}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <CardTitle className="text-2xl">{`${user.firstName || ''} ${user.lastName || ''}`}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> {user.email}
            </CardDescription>
            {user.mobile && (
              <CardDescription className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> {user.mobile}
              </CardDescription>
            )}
            <Badge className={getStatusColor(user.userStatus)} variant="outline">
              {user.userStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Role:</h3>
            <p className="text-muted-foreground text-sm">{user.roleList?.map((r: any) => r.roleName).join(", ") || 'N/A'}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills?.split(',').map((skill: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {skill.trim()}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Address:</h3>
            <p className="text-muted-foreground text-sm">{`${user.address}, ${user.city}, ${user.state} - ${user.pinCode}`}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Date of Birth:</h3>
            <p className="text-muted-foreground text-sm">{user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div className="space-y-2 md:col-span-2">
            <h3 className="font-semibold text-sm">Notes:</h3>
            <p className="text-muted-foreground text-sm">{"No notes available."}</p>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold">Applied Jobs ({appliedJobs.length})</h2>
      {appliedJobs.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            This candidate has not applied to any jobs yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appliedJobs.map((job: any, idx: number) => (
            <Card key={job.jobId || idx}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{job.title}</CardTitle>
                  {/* No status in jobTitles, so omit status badge */}
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> {job.companyName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
              <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-medium">Match Score:</span>
                  <MatchScoreRing score={0} /> {/* No match score available */}
                </div>
                <Link href={`/jobs/${job.jobId}`}>
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

      <h2 className="text-xl font-bold">Interviews ({interviews.length})</h2>
      {interviews.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No interviews scheduled for this candidate yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {interviews.map((interview) => {
            const job = mockJobs.find((j) => j.id === interview.jobId)
            return (
              <Card key={interview.id}>
                <CardHeader>
                  <CardTitle>{job?.title || "N/A"}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4" /> {interview.date} at {interview.time}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Badge variant="secondary">{interview.type}</Badge>
                  <Badge className={getStatusColor(interview.status)} variant="outline">
                    {interview.status}
                  </Badge>
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

      <h2 className="text-xl font-bold">Offers ({offers.length})</h2>
      {offers.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No offers extended to this candidate yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => {
            const job = mockJobs.find((j) => j.id === offer.jobId)
            return (
              <Card key={offer.id}>
                <CardHeader>
                  <CardTitle>{job?.title || "N/A"}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Handshake className="h-4 w-4" /> Salary: ${offer.salary.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Badge className={getStatusColor(offer.status)} variant="outline">
                    {offer.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground">Offer Date: {new Date(offer.offerDate).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
