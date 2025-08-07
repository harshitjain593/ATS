"use client"

import { Button } from "@/components/ui/button"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, ChevronDown, Mail, Phone, Briefcase, GraduationCap, Eye, Grid3X3, List } from "lucide-react"
import { mockCandidates, mockJobs } from "@/data/mock-data"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { MatchScoreRing } from "@/components/match-score-ring"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/redux/store"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { createCandidate } from "@/redux/candidatesThunk"
import { getCandidatesFromApi } from "@/redux/candidatesThunk"
import { fetchStages } from "@/redux/stagesThunk"
import { fetchJobs } from "@/redux/jobsThunk"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function CandidatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all") // 'all', 'New', 'Reviewed', 'AI Screening', 'Interviewing', 'Offered', 'Hired', 'Rejected'
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const router = useRouter()
  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const dispatch = useDispatch()
  const candidatesState = useSelector((state: RootState) => state.candidates)
  const appliedJobTitles = useSelector((state: RootState) => state.candidates.appliedJobTitles)
  const stages = useSelector((state: RootState) => state.stages.stages)
  const { jobs } = useSelector((state: RootState) => state.jobs)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", jobId: "", resume: null as File | null })
  const [formError, setFormError] = useState("")

  const handleOpenModal = () => {
    setForm({ name: "", email: "", jobId: "", resume: null })
    setFormError("")
    setModalOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, resume: e.target.files![0] }))
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleJobSelect = (jobId: string) => {
    setForm((prev) => ({ ...prev, jobId }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    if (!form.resume) {
      setFormError("Resume is required.")
      return
    }
    if (!form.jobId) {
      setFormError("Please select a job.")
      return
    }
    try {
      await dispatch(createCandidate({ 
        name: form.name, 
        email: form.email, 
        jobId: form.jobId,
        resume: form.resume 
      }) as any)
      setModalOpen(false)
    } catch (err) {
      setFormError("Failed to create candidate.")
    }
  }

  // Get applied jobs for a candidate from the appliedJobTitles array
  const getAppliedJobsForCandidate = (candidateId: string, appliedJobTitles: any[]) => {
    // Find the application to get the userId
    const application = candidatesState.applications.find(app => app.id === Number(candidateId));
    if (!application) return [];
    
    // Use the userId from the application to find applied jobs
    return appliedJobTitles.filter(job => job.userId === application.userId);
  };

  // Use candidates from redux if available, else fallback to mockCandidates
  const filteredCandidates = useMemo(() => {
    let candidates = candidatesState.candidates.length > 0 ? candidatesState.candidates : mockCandidates

    if (filterStatus !== "all") {
      candidates = candidates.filter((candidate) => candidate.status === filterStatus)
    }

    if (searchTerm) {
      candidates = candidates.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.applicationEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }
    return candidates
  }, [searchTerm, filterStatus, candidatesState.candidates])

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || currentUser.role === "candidate")) {
      router.push("/login")
    } else {
      dispatch(getCandidatesFromApi() as any)
      dispatch(fetchStages() as any)
      dispatch(fetchJobs() as any)
    }
  }, [currentUser, isLoadingUser, router, dispatch])

  const getStatusColor = (status: string) => {
    // Find the stage that matches the status
    const stage = stages.find(s => s.name === status)
    if (stage && stage.color) {
      const color = stage.color
      return `bg-[${color}]/20 text-[${color}] border-[${color}]/30`
    }
    
    // Fallback to default colors for common statuses
    switch (status) {
      case "New":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Reviewed":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "AI Screening":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"
      case "Interviewing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Offered":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Hired":
        return "bg-teal-500/20 text-teal-400 border-teal-500/30"
      case "Rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (isLoadingUser || !currentUser || currentUser.role === "candidate") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading candidates...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Candidates</h1>
          <p className="text-muted-foreground">Manage and track all applicants.</p>
        </div>
        <Button onClick={handleOpenModal}>Create New Candidate</Button>
      </div>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Candidate</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (optional)</Label>
              <Input name="name" placeholder="Enter candidate name" value={form.name} onChange={handleFormChange} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input name="email" placeholder="Enter candidate email" value={form.email} onChange={handleFormChange} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobId">Select Job *</Label>
              <Select value={form.jobId} onValueChange={handleJobSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a job to apply for" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title} - {job.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resume">Resume *</Label>
              <Input type="file" onChange={handleFileChange} required accept=".pdf,.doc,.docx" />
            </div>
            
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            {candidatesState.loading && <p className="text-muted-foreground text-sm">Creating candidate...</p>}
            {candidatesState.error && <p className="text-red-500 text-sm">{candidatesState.error}</p>}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={candidatesState.loading}>Create Application</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
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
            {stages
              .filter(stage => stage.isActive)
              .sort((a, b) => a.order - b.order)
              .map((stage) => (
                <DropdownMenuItem key={stage.id} onClick={() => setFilterStatus(stage.name)}>
                  {stage.name}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex border rounded-md">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="rounded-r-none"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="rounded-l-none"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Candidate Listings */}
      {filteredCandidates.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No candidates found matching your criteria.
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{candidate.name}</CardTitle>
                  {/* <Badge className={getStatusColor(candidate.status)} variant="outline">
                    {candidate.status}
                  </Badge> */}
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> {candidate.applicationEmail}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {candidate.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>{candidate.phone}</span>
                  </div>
                )}
                {candidate.experience && candidate.experience.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {candidate.experience[0].title} at {candidate.experience[0].company} (
                      {candidate.experience[0].years} years)
                    </span>
                  </div>
                )}
                {candidate.education && candidate.education.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {candidate.education[0].degree} from {candidate.education[0].institution}
                    </span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {candidate.skills && candidate.skills.slice(0, 3).map((skill, idx) => (
                    <Badge key={idx} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.skills && candidate.skills.length > 3 && (
                    <Badge variant="secondary">+{candidate.skills.length - 3} more</Badge>
                  )}
                </div>
                {/* Always show Applied Jobs heading */}
                <div className="mt-4 space-y-1">
                  <h4 className="text-sm font-medium">Applied Jobs:</h4>
                  {(() => {
                    // Get applied jobs for this candidate from the API response
                    const appliedJobs = getAppliedJobsForCandidate(candidate.id, appliedJobTitles);
                    return appliedJobs.length > 0 ? (
                      <>
                        {appliedJobs.slice(0, 2).map((appliedJob, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{appliedJob.jobTitle}</span>
                            <MatchScoreRing score={appliedJob.resumeScore || 0} />
                          </div>
                        ))}
                        {appliedJobs.length > 2 && (
                          <p className="text-sm text-muted-foreground">+{appliedJobs.length - 2} more</p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">No jobs applied yet</p>
                    );
                  })()}
                </div>
                <Button className="w-full mt-4 gap-2 bg-black text-white hover:bg-zinc-900" onClick={() => router.push(`/candidates/${candidate.id}`)}>
                  <Eye className="h-4 w-4" />
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div>
                      <h3 className="text-sm font-semibold">{candidate.name}</h3>
                      <p className="text-xs text-muted-foreground">{candidate.applicationEmail}</p>
                    </div>
                    {/* <Badge className={getStatusColor(candidate.status)} variant="outline">
                      {candidate.status}
                    </Badge> */}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/candidates/${candidate.id}`)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <h4 className="text-xs font-medium mb-1">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills && candidate.skills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills && candidate.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">+{candidate.skills.length - 3} more</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium mb-1">Applied Jobs</h4>
                    {(() => {
                      // Get applied jobs for this candidate from the API response
                      const appliedJobs = getAppliedJobsForCandidate(candidate.id, appliedJobTitles);
                      return appliedJobs.length > 0 ? (
                        <div className="text-xs text-muted-foreground">
                          {appliedJobs.slice(0, 2).map((appliedJob, index) => (
                            <span key={index}>
                              {appliedJob.jobTitle}
                              {index < Math.min(2, appliedJobs.length - 1) && ', '}
                            </span>
                          ))}
                          {appliedJobs.length > 2 && (
                            <span> +{appliedJobs.length - 2} more</span>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No jobs applied yet</p>
                      );
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
