"use client"

import { Button } from "@/components/ui/button"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, ChevronDown, Mail, Phone, Briefcase, GraduationCap, Eye } from "lucide-react"
import { mockCandidates, mockJobs } from "@/data/mock-data"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { MatchScoreRing } from "@/components/match-score-ring"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/redux/store"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { createCandidate } from "@/redux/candidatesThunk"
import { updateCandidateStatus } from "@/redux/candidatesThunk"

export function CandidatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all") // 'all', 'New', 'Reviewed', 'AI Screening', 'Interviewing', 'Offered', 'Hired', 'Rejected'
  const router = useRouter()
  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const dispatch = useDispatch()
  const candidatesState = useSelector((state: RootState) => state.candidates)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", resume: null as File | null })
  const [formError, setFormError] = useState("")

  const handleOpenModal = () => {
    setForm({ name: "", email: "", resume: null })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    if (!form.resume) {
      setFormError("Resume is required.")
      return
    }
    try {
      await dispatch(createCandidate({ name: form.name, email: form.email, resume: form.resume }) as any)
      setModalOpen(false)
    } catch (err) {
      setFormError("Failed to create candidate.")
    }
  }

  const filteredCandidates = useMemo(() => {
    let candidates = candidatesState.candidates.length > 0 ? candidatesState.candidates : mockCandidates

    if (filterStatus !== "all") {
      candidates = candidates.filter((candidate) => candidate.status === filterStatus)
    }

    if (searchTerm) {
      candidates = candidates.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }
    return candidates
  }, [searchTerm, filterStatus, candidatesState.candidates])

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || currentUser.role === "candidate")) {
      router.push("/login")
    }
  }, [currentUser, isLoadingUser, router])

  const getStatusColor = (status: string) => {
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

  const candidateStatuses = [
    "New",
    "Reviewed",
    "AI Screening",
    "Interviewing",
    "Offered",
    "Hired",
    "Rejected"
  ] as const;

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
            <Input name="name" placeholder="Name (optional)" value={form.name} onChange={handleFormChange} />
            <Input name="email" placeholder="Email (optional)" value={form.email} onChange={handleFormChange} />
            <Input type="file" onChange={handleFileChange} required />
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            {candidatesState.loading && <p className="text-muted-foreground text-sm">Creating candidate...</p>}
            {candidatesState.error && <p className="text-red-500 text-sm">{candidatesState.error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={candidatesState.loading}>Create</Button>
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
            <DropdownMenuItem onClick={() => setFilterStatus("New")}>New</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Reviewed")}>Reviewed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("AI Screening")}>AI Screening</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Interviewing")}>Interviewing</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Offered")}>Offered</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Hired")}>Hired</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Rejected")}>Rejected</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Candidate Listings */}
      {filteredCandidates.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No candidates found matching your criteria.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{candidate.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge className={getStatusColor(candidate.status)} variant="outline" style={{ cursor: 'pointer' }}>
                        {candidate.status}
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {candidateStatuses.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => dispatch(updateCandidateStatus({ candidateId: candidate.id, status }))}
                          className="flex items-center gap-2"
                        >
                          <span className={getStatusColor(status) + " rounded px-2 py-0.5 text-xs"}>{status}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> {candidate.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {candidate.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4" />
                    <span>{candidate.phone}</span>
                  </div>
                )}
                {candidate.experience.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {candidate.experience[0].title} at {candidate.experience[0].company} (
                      {candidate.experience[0].years} years)
                    </span>
                  </div>
                )}
                {candidate.education.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {candidate.education[0].degree} from {candidate.education[0].institution}
                    </span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {candidate.skills.slice(0, 3).map((skill, idx) => (
                    <Badge key={idx} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                  {candidate.skills.length > 3 && (
                    <Badge variant="secondary">+{candidate.skills.length - 3} more</Badge>
                  )}
                </div>
                {/* Always show Applied Jobs heading */}
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium">Applied Jobs:</h4>
                  {candidate.appliedJobs.length > 0 ? (
                    candidate.appliedJobs.map((appliedJob) => {
                      const job = mockJobs.find((j) => j.id === appliedJob.jobId)
                      return (
                        job && (
                          <div key={appliedJob.jobId} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{job.title}</span>
                            <MatchScoreRing score={appliedJob.matchScore} />
                          </div>
                        )
                      )
                    })
                  ) : null}
                </div>
                <Button className="w-full mt-4 gap-2 bg-black text-white hover:bg-zinc-900" onClick={() => router.push(`/candidates/${candidate.id}`)}>
                  <Eye className="h-4 w-4" />
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
