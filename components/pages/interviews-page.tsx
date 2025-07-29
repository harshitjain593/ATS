"use client"

import { useMemo } from "react"

import { useEffect } from "react"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, CalendarCheck, User, Briefcase, Clock, Calendar } from "lucide-react"
import { mockInterviews, mockCandidates, mockJobs, mockUsers, type Interview } from "@/data/mock-data"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function InterviewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all") // 'all', 'Scheduled', 'Completed', 'Canceled'
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews) // Use state to allow adding new interviews
  const [isCreateInterviewDialogOpen, setIsCreateInterviewDialogOpen] = useState(false)
  const [newInterview, setNewInterview] = useState<Omit<Interview, "id">>({
    candidateId: "",
    jobId: "",
    interviewerId: "",
    date: "",
    time: "",
    type: "Phone Screen",
    status: "Scheduled",
  })

  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || currentUser.role === "candidate")) {
      router.push("/login")
    }
  }, [currentUser, isLoadingUser, router])

  const filteredInterviews = useMemo(() => {
    let currentInterviews = interviews

    if (filterStatus !== "all") {
      currentInterviews = currentInterviews.filter((interview) => interview.status === filterStatus)
    }

    if (searchTerm) {
      currentInterviews = currentInterviews.filter((interview) => {
        const candidate = mockCandidates.find((c) => c.id === interview.candidateId)
        const job = mockJobs.find((j) => j.id === interview.jobId)
        const interviewer = mockUsers.find((u) => u.id === interview.interviewerId)

        return (
          candidate?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          interviewer?.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }
    return currentInterviews
  }, [searchTerm, filterStatus, interviews])

  const handleCreateInterview = () => {
    if (
      !newInterview.candidateId ||
      !newInterview.jobId ||
      !newInterview.interviewerId ||
      !newInterview.date ||
      !newInterview.time
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required interview details.",
        variant: "destructive",
      })
      return
    }

    const interviewId = `interview-${mockInterviews.length + 1}`
    const createdInterview: Interview = {
      ...newInterview,
      id: interviewId,
    }
    mockInterviews.push(createdInterview) // Add to mock data
    setInterviews([...mockInterviews]) // Update state to re-render
    setIsCreateInterviewDialogOpen(false)
    setNewInterview({
      candidateId: "",
      jobId: "",
      interviewerId: "",
      date: "",
      time: "",
      type: "Phone Screen",
      status: "Scheduled",
    })
    toast({
      title: "Interview Scheduled",
      description: `Interview for ${mockCandidates.find((c) => c.id === createdInterview.candidateId)?.name} has been scheduled.`,
    })
  }

  const getStatusColor = (status: Interview["status"]) => {
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

  if (isLoadingUser || !currentUser || currentUser.role === "candidate") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading interviews...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Interviews</h1>
          <p className="text-muted-foreground">Manage and track all candidate interviews.</p>
        </div>
        {(currentUser.role === "admin" || currentUser.role === "recruiter") && (
          <Button className="gap-2" onClick={() => setIsCreateInterviewDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Schedule New Interview
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search interviews by candidate, job, or interviewer..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              Status: {filterStatus === "all" ? "All" : filterStatus}
              <CalendarCheck className="h-4 w-4" />
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
            const candidate = mockCandidates.find((c) => c.id === interview.candidateId)
            const job = mockJobs.find((j) => j.id === interview.jobId)
            const interviewer = mockUsers.find((u) => u.id === interview.interviewerId)

            return (
              <Card key={interview.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{candidate?.name || "N/A"}</CardTitle>
                    <Badge className={getStatusColor(interview.status)} variant="outline">
                      {interview.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> {job?.title || "N/A"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Interviewer: {interviewer?.name || "N/A"}</span>
                  </div>
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
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Schedule New Interview Dialog */}
      <Dialog open={isCreateInterviewDialogOpen} onOpenChange={setIsCreateInterviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Schedule New Interview</DialogTitle>
            <CardDescription>Fill in the details for the new interview.</CardDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="candidate" className="text-right">
                Candidate
              </Label>
              <Select
                value={newInterview.candidateId}
                onValueChange={(value) => setNewInterview({ ...newInterview, candidateId: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  {mockCandidates.map((candidate) => (
                    <SelectItem key={candidate.id} value={candidate.id}>
                      {candidate.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="job" className="text-right">
                Job
              </Label>
              <Select
                value={newInterview.jobId}
                onValueChange={(value) => setNewInterview({ ...newInterview, jobId: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select job" />
                </SelectTrigger>
                <SelectContent>
                  {mockJobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="interviewer" className="text-right">
                Interviewer
              </Label>
              <Select
                value={newInterview.interviewerId}
                onValueChange={(value) => setNewInterview({ ...newInterview, interviewerId: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select interviewer" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers
                    .filter((u) => u.role === "recruiter" || u.role === "admin")
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={newInterview.date}
                onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={newInterview.time}
                onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={newInterview.type}
                onValueChange={(value) => setNewInterview({ ...newInterview, type: value as Interview["type"] })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Phone Screen">Phone Screen</SelectItem>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Behavioral">Behavioral</SelectItem>
                  <SelectItem value="On-site">On-site</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={newInterview.status}
                onValueChange={(value) => setNewInterview({ ...newInterview, status: value as Interview["status"] })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateInterviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateInterview}>Schedule Interview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
