"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Briefcase, MapPin, DollarSign, Calendar, Users, ChevronLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { CandidateCard } from "@/components/candidate-card"
import { AiRecruiterCopilot } from "@/components/ai-recruiter-copilot"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useDispatch, useSelector } from "react-redux"
import { fetchJobById } from "@/redux/jobsThunk"
import { RootState, AppDispatch } from "@/redux/store"
import { Candidate, Application } from "@/lib/types"
import { applyToJob } from "@/redux/jobsThunk";

// Helper function to map an Application to a partial Candidate
function mapApplicationToCandidate(app: Application): Candidate {
  return {
    id: String(app.userId),
    name: app.firstName + app.lastName, // No name available, use ID
    email: "N/A", // No email available
    phone: app.mobile,
    status: app.status as Candidate['status'], // Map status
    skills: [], // No skills available
    experience: [],
    education: [],
    notes: app.coverLetter,
    appliedJobs: [{ jobId: String(app.jobId), matchScore: 0 }], // Basic info
  }
}

interface JobDetailsPageProps {
  jobId: string
}

export function JobDetailsPage({ jobId }: JobDetailsPageProps) {
  const router = useRouter()
  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const dispatch = useDispatch<AppDispatch>()
  const {
    selectedJob: job,
    loadingSelected,
    errorSelected,
    applications,
    userAppliedJobs = [],
  } = useSelector((state: RootState) => state.jobs)

  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("")
  const [applied, setApplied] = useState(false)

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobById(jobId))
    }
  }, [jobId, dispatch])
  
  useEffect(() => {
    if (!isLoadingUser && !currentUser) {
      router.push("/login")
    }
  }, [currentUser, isLoadingUser, router])

  if (isLoadingUser || loadingSelected) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (errorSelected || !job) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-background">
        <p className="text-destructive">{errorSelected || "Job not found."}</p>
        <Button variant="link" onClick={() => router.back()} className="mt-4">
          <ChevronLeft className="h-4 w-4 mr-2" /> Back to Jobs
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: typeof job.status) => {
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

  const handleApply = async () => {
    if (!resumeFile || !coverLetter) return;
    try {
      await dispatch(applyToJob({
        jobId: Number(job.id),
        userId: Number(currentUser?.id),
        status: "Applied",
        resumeFile,
        coverLetter,
      }));
      setApplied(true);
      setApplyModalOpen(false);
      // Show toast (assume useToast is imported and used)
      // toast({ title: "Application Submitted", description: "You have applied to this job." });
    } catch (error: any) {
      // toast({ title: "Application Failed", description: error?.message || "Failed to apply." });
    }
  };

  return (
    <div className="space-y-6 p-0 md:p-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Jobs
        </Button>
        <div className="flex items-center gap-2">
          <AiRecruiterCopilot
            jobDescription={job.description}
            candidateResume={applications.map((a) => a.resume).join("\n\n")}
          />
        </div>
      </div>
      <Card>
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
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>{job.type}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>{job.salary || "Competitive"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Posted: {job.postedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{job.applicants.length} Applicants</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>Department: {job.company || "N/A"}</span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Description:</h3>
            <ScrollArea className="h-[100px] text-muted-foreground text-sm pr-4">
              <p>{job.description}</p>
            </ScrollArea>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Requirements:</h3>
            <ScrollArea className="h-[100px] text-muted-foreground text-sm pr-4">
              <ul className="list-disc list-inside">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </ScrollArea>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Responsibilities:</h3>
            <ScrollArea className="h-[100px] text-muted-foreground text-sm pr-4">
              <ul className="list-disc list-inside">
                {job.responsibilities.map((res, index) => (
                  <li key={index}>{res}</li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
      {/* Apply button for candidates only */}
      {currentUser?.role === "candidate" && (
        <div>
          <Button
            className="mt-4"
            variant="default"
            disabled={applied}
            onClick={() => setApplyModalOpen(true)}
          >
            {applied ? "Applied" : "Apply"}
          </Button>
          <Dialog open={applyModalOpen} onOpenChange={setApplyModalOpen}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Apply to {job.title}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={e => setResumeFile(e.target.files?.[0] || null)}
                />
                <Textarea
                  placeholder="Cover Letter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setApplyModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleApply} disabled={!resumeFile || !coverLetter}>
                  Submit Application
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
      {/* Applicants section: only for admin or recruiter */}
      {(currentUser?.role === "admin" || currentUser?.role === "recruiter") && (
        <>
          <h2 className="text-xl font-bold mt-6">Applicants ({applications.length})</h2>
          {applications.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">No applicants for this job yet.</CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {applications.map((app) => {
                const candidate = mapApplicationToCandidate(app)
                return <CandidateCard key={candidate.id} candidate={candidate} userAppliedJobs={userAppliedJobs} />
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
