"use client"

import { useMemo, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, CalendarCheck, User, Briefcase, Clock, CalendarDays, MapPin, Video, Bot, Users, Phone, Building, FileText, Sparkles, Loader2, List, Grid3X3 } from "lucide-react"
import { mockInterviews, mockUsers } from "@/data/mock-data"
import type { Interview } from "@/lib/types"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "@/redux/store"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getCandidatesFromApi } from "@/redux/candidatesThunk"
import { fetchJobs } from "@/redux/jobsThunk"

// AI Interview Questions Generator (Mock)
const generateAIQuestions = (jobRequirements: string[], jobTitle: string): string[] => {
  const baseQuestions = [
    "Can you walk me through your experience with the technologies mentioned in the job requirements?",
    "Describe a challenging project you worked on and how you overcame obstacles.",
    "How do you stay updated with the latest industry trends and technologies?",
    "Tell me about a time when you had to learn a new technology quickly for a project.",
    "How do you handle working under pressure and meeting tight deadlines?",
    "Describe your experience working in a team environment and resolving conflicts.",
    "What is your approach to problem-solving when faced with a complex technical issue?",
    "How do you ensure code quality and maintainability in your projects?",
    "Tell me about a time when you had to explain a technical concept to a non-technical stakeholder.",
    "What are your career goals and how does this position align with them?"
  ]

  // Add job-specific questions based on requirements
  const jobSpecificQuestions = jobRequirements.map(req => 
    `Can you provide specific examples of your experience with ${req}?`
  )

  return [...baseQuestions.slice(0, 5), ...jobSpecificQuestions.slice(0, 5)]
}

export function InterviewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [interviews, setInterviews] = useState<Interview[]>(mockInterviews)
  const [isCreateInterviewDialogOpen, setIsCreateInterviewDialogOpen] = useState(false)
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false)
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [rescheduleDate, setRescheduleDate] = useState<Date>()
  const [rescheduleTime, setRescheduleTime] = useState("")
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards")
  const [newInterview, setNewInterview] = useState<Partial<Interview>>({
    candidateId: "",
    jobId: "",
    date: "",
    time: "",
    duration: 60,
    type: "virtual",
    interviewMode: "human",
    status: "Scheduled",
    interviewer: "",
    interviewerEmail: "",
    interviewerPhone: "",
    location: "",
    notes: "",
  })

  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const candidates = useSelector((state: RootState) => state.candidates.candidates)
  const jobs = useSelector((state: RootState) => state.jobs.jobs)
  const isLoadingCandidates = useSelector((state: RootState) => state.candidates.loading)
  const isLoadingJobs = useSelector((state: RootState) => state.jobs.loading)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || currentUser.role === "candidate")) {
      router.push("/login")
    }
  }, [currentUser, isLoadingUser, router])

  // Fetch candidates and jobs when component mounts
  useEffect(() => {
    console.log('InterviewsPage useEffect - currentUser:', currentUser)
    console.log('InterviewsPage useEffect - candidates:', candidates)
    console.log('InterviewsPage useEffect - jobs:', jobs)
    console.log('InterviewsPage useEffect - isLoadingCandidates:', isLoadingCandidates)
    console.log('InterviewsPage useEffect - isLoadingJobs:', isLoadingJobs)
    console.log('InterviewsPage useEffect - API Base URL:', process.env.NEXT_PUBLIC_API_BASE_URL)
    
    if (currentUser && (currentUser.role === "admin" || currentUser.role === "recruiter")) {
      console.log('User is admin/recruiter, checking if data needs to be fetched')
      
      // Fetch candidates if not already loaded
      if (candidates.length === 0 && !isLoadingCandidates) {
        console.log('Fetching candidates...')
        dispatch(getCandidatesFromApi())
      }
      
      // Fetch jobs if not already loaded
      if (jobs.length === 0 && !isLoadingJobs) {
        console.log('Fetching jobs...')
        dispatch(fetchJobs())
      }
    } else {
      console.log('User not admin/recruiter or not logged in:', currentUser?.role)
    }
  }, [currentUser, candidates.length, jobs.length, isLoadingCandidates, isLoadingJobs, dispatch])

  // Update date when calendar selection changes
  useEffect(() => {
    if (selectedDate) {
      setNewInterview((prev: Partial<Interview>) => ({
        ...prev,
        date: format(selectedDate, "yyyy-MM-dd")
      }))
    }
  }, [selectedDate])

  const filteredInterviews = useMemo(() => {
    let currentInterviews = interviews

    if (filterStatus !== "all") {
      currentInterviews = currentInterviews.filter((interview) => interview.status === filterStatus)
    }

    if (filterType !== "all") {
      currentInterviews = currentInterviews.filter((interview) => interview.type === filterType)
    }

    if (searchTerm) {
      currentInterviews = currentInterviews.filter((interview) => {
        const candidate = candidates.find((c) => c.id === interview.candidateId)
        const job = jobs.find((j) => j.id === interview.jobId)

        return (
          candidate?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          interview.interviewer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    }
    return currentInterviews
  }, [searchTerm, filterStatus, filterType, interviews])

  const handleViewDetails = (interview: Interview) => {
    setSelectedInterview(interview)
    setIsViewDetailsDialogOpen(true)
  }

  const handleCancelInterview = (interview: Interview) => {
    const updatedInterviews = interviews.map((int) => 
      int.id === interview.id 
        ? { ...int, status: "Canceled" as const, modifiedDate: new Date().toISOString() }
        : int
    )
    setInterviews(updatedInterviews)
    setIsViewDetailsDialogOpen(false)
    setSelectedInterview(null)
    
    toast({
      title: "Interview Canceled",
      description: `Interview for ${interview.candidateName} has been canceled.`,
      id: "interview-canceled"
    })
  }

  const handleRescheduleInterview = (interview: Interview) => {
    setSelectedInterview(interview)
    setRescheduleDate(undefined)
    setRescheduleTime("")
    setIsViewDetailsDialogOpen(false)
    setIsRescheduleDialogOpen(true)
  }

  const handleConfirmReschedule = () => {
    if (!selectedInterview || !rescheduleDate || !rescheduleTime) {
      toast({
        title: "Missing Information",
        description: "Please select both date and time for rescheduling.",
        variant: "destructive",
        id: "missing-reschedule-info"
      })
      return
    }

    const updatedInterviews = interviews.map((int) => 
      int.id === selectedInterview.id 
        ? { 
            ...int, 
            date: format(rescheduleDate, "yyyy-MM-dd"),
            time: rescheduleTime,
            status: "Rescheduled" as const,
            modifiedDate: new Date().toISOString()
          }
        : int
    )
    setInterviews(updatedInterviews)
    setIsRescheduleDialogOpen(false)
    setSelectedInterview(null)
    setRescheduleDate(undefined)
    setRescheduleTime("")
    
    toast({
      title: "Interview Rescheduled",
      description: `Interview for ${selectedInterview.candidateName} has been rescheduled to ${format(rescheduleDate, "PPP")} at ${rescheduleTime}.`,
      id: "interview-rescheduled"
    })
  }

  const handleCreateInterview = () => {
    if (
      !newInterview.candidateId ||
      !newInterview.jobId ||
      !newInterview.date ||
      !newInterview.time ||
      !newInterview.duration
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required interview details.",
        variant: "destructive",
        id: "missing-interview-info"
      })
      return
    }

    // Generate AI questions if it's an AI interview
    let aiQuestions: string[] = []
    if (newInterview.interviewMode === "ai") {
      const job = jobs.find((j) => j.id === newInterview.jobId)
      if (job) {
        aiQuestions = generateAIQuestions(job.requirements, job.title)
      }
    }

    // Generate Google Meet link if it's a human virtual interview
    let meetingLink = ""
    if (newInterview.interviewMode === "human" && newInterview.type === "virtual") {
      meetingLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 15)}`
    }

    const interviewId = `interview-${mockInterviews.length + 1}`
    const candidate = candidates.find((c) => c.id === newInterview.candidateId)
    const job = jobs.find((j) => j.id === newInterview.jobId)
    
    const createdInterview: Interview = {
      ...newInterview,
      id: interviewId,
      candidateName: candidate?.name || "",
      jobTitle: job?.title || "",
      companyName: job?.company || "",
      aiQuestions,
      meetingLink,
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
    } as Interview

    mockInterviews.push(createdInterview)
    setInterviews([...mockInterviews])
    setIsCreateInterviewDialogOpen(false)
    
    // Reset form
    setNewInterview({
      candidateId: "",
      jobId: "",
      date: "",
      time: "",
      duration: 60,
      type: "virtual",
      interviewMode: "human",
      status: "Scheduled",
      interviewer: "",
      interviewerEmail: "",
      interviewerPhone: "",
      location: "",
      notes: "",
    })
    setSelectedDate(undefined)

    toast({
      title: "Interview Scheduled",
      description: `Interview for ${candidate?.name} has been scheduled successfully.`,
      id: "interview-scheduled"
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
      case "Rescheduled":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getTypeIcon = (type: Interview["type"]) => {
    switch (type) {
      case "virtual":
        return <Video className="h-4 w-4" />
      case "ai":
        return <Bot className="h-4 w-4" />
      case "on-site":
        return <Building className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: Interview["type"]) => {
    switch (type) {
      case "virtual":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "ai":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
      case "on-site":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "phone":
        return "bg-green-500/20 text-green-400 border-green-500/30"
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
          <p className="text-muted-foreground">Manage and track all candidate interviews with enhanced scheduling.</p>
        </div>
        {(currentUser.role === "admin" || currentUser.role === "recruiter") && (
          <Button className="gap-2" onClick={() => setIsCreateInterviewDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Schedule New Interview
          </Button>
        )}
      </div>

      {/* Enhanced Filters and Search */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="relative md:col-span-2">
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
            <Button variant="outline" className="gap-2 bg-transparent w-full">
              Status: {filterStatus === "all" ? "All" : filterStatus}
              <CalendarCheck className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterStatus("all")}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Scheduled")}>Scheduled</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Completed")}>Completed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Canceled")}>Canceled</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Rescheduled")}>Rescheduled</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent w-full">
              Type: {filterType === "all" ? "All" : filterType}
              <Video className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterType("all")}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("virtual")}>Virtual</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("ai")}>AI</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("on-site")}>On-site</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterType("phone")}>Phone</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className="gap-2"
          >
            <Grid3X3 className="h-4 w-4" />
            Cards
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="gap-2"
          >
            <List className="h-4 w-4" />
            List
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredInterviews.length} interview{filteredInterviews.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Interview Listings */}
      {filteredInterviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarCheck className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No interviews found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || filterStatus !== "all" || filterType !== "all"
                ? "Try adjusting your search or filters."
                : "Get started by scheduling your first interview."}
            </p>
          </CardContent>
        </Card>
      ) : viewMode === "cards" ? (
        // Card View
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredInterviews.map((interview, index) => {
            const candidate = candidates.find((c) => c.id === interview.candidateId)
            const job = jobs.find((j) => j.id === interview.jobId)

            return (
              <Card 
                key={interview.id || `interview-${index}`} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleViewDetails(interview)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{candidate?.name || "N/A"}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(interview.status)} variant="outline">
                        {interview.status}
                      </Badge>
                      <Badge className={getTypeColor(interview.type)} variant="outline">
                        {getTypeIcon(interview.type)}
                        {interview.type}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> {job?.title || "N/A"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Interviewer: {interview.interviewer || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span>Date: {interview.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Time: {interview.time} ({interview.duration} min)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    <span>Created: {interview.createdDate ? new Date(interview.createdDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  {interview.interviewMode === "ai" && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Bot className="h-4 w-4 text-cyan-500" />
                        <span className="text-cyan-600">AI Interview Mode</span>
                      </div>
                      <div className="p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-cyan-600" />
                          <span className="text-xs font-medium text-cyan-800">AI Interview Platform</span>
                        </div>
                        <p className="text-xs text-cyan-700 mb-2">
                          This interview will be conducted on our AI-powered platform
                        </p>
                        <Button 
                          size="sm" 
                          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/ai-interview/${interview.id}`)
                          }}
                        >
                          Start AI Interview
                        </Button>
                      </div>
                    </div>
                  )}
                  {interview.meetingLink && (
                    <div className="flex items-center gap-2 text-sm">
                      <Video className="h-4 w-4 text-purple-500" />
                      <a 
                        href={interview.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline"
                      >
                        Join Meeting
                      </a>
                    </div>
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
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1 bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewDetails(interview)
                      }}
                    >
                      View Details
                    </Button>
                    {interview.status === "Scheduled" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handleRescheduleInterview(interview)
                          }}>
                            Reschedule
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            handleCancelInterview(interview)
                          }}>
                            Cancel
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation()
                            // TODO: Implement mark as completed functionality
                          }}>
                            Mark as Completed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        // List View
        <div className="space-y-2">
          {filteredInterviews.map((interview, index) => {
            const candidate = candidates.find((c) => c.id === interview.candidateId)
            const job = jobs.find((j) => j.id === interview.jobId)

            return (
              <Card 
                key={interview.id || `interview-${index}`} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleViewDetails(interview)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                      {/* Candidate */}
                      <div className="col-span-3">
                        <div className="font-medium text-sm">{candidate?.name || "N/A"}</div>
                        <div className="text-xs text-muted-foreground">{candidate?.applicationEmail || "N/A"}</div>
                      </div>
                      
                      {/* Job */}
                      <div className="col-span-3">
                        <div className="font-medium text-sm">{job?.title || "N/A"}</div>
                        <div className="text-xs text-muted-foreground">{job?.company || "N/A"}</div>
                      </div>
                      
                      {/* Date & Time */}
                      <div className="col-span-2">
                        <div className="font-medium text-sm">{interview.date}</div>
                        <div className="text-xs text-muted-foreground">{interview.time}</div>
                      </div>
                      
                      {/* Interviewer */}
                      <div className="col-span-2">
                        <div className="font-medium text-sm">{interview.interviewer || "N/A"}</div>
                        <div className="text-xs text-muted-foreground">{interview.type}</div>
                      </div>
                      
                      {/* Status */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(interview.status)} variant="outline">
                            {interview.status}
                          </Badge>
                          <Badge className={getTypeColor(interview.type)} variant="outline">
                            {getTypeIcon(interview.type)}
                          </Badge>
                        </div>
                        {interview.interviewMode === "ai" && (
                          <div className="mt-1">
                            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30" variant="outline">
                              <Bot className="h-3 w-3 mr-1" />
                              AI
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      {interview.meetingLink && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(interview.meetingLink, '_blank')
                          }}
                        >
                          <Video className="h-4 w-4" />
                        </Button>
                      )}
                      {interview.interviewMode === "ai" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/ai-interview/${interview.id}`)
                          }}
                        >
                          <Bot className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewDetails(interview)
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Enhanced Schedule New Interview Dialog */}
      <Dialog open={isCreateInterviewDialogOpen} onOpenChange={setIsCreateInterviewDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Schedule New Interview</DialogTitle>
            <CardDescription>Create a comprehensive interview schedule with AI assistance.</CardDescription>
            <div className="flex gap-2 mt-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  console.log('Manual refresh - candidates:', candidates.length, 'jobs:', jobs.length)
                  if (candidates.length === 0) dispatch(getCandidatesFromApi())
                  if (jobs.length === 0) dispatch(fetchJobs())
                }}
              >
                Refresh Data
              </Button>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span>Candidates: {candidates.length}</span>
                <span>Jobs: {jobs.length}</span>
              </div>
            </div>
          </DialogHeader>
          
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Details</TabsTrigger>
              <TabsTrigger value="interviewer">Interviewer</TabsTrigger>
              <TabsTrigger value="ai-questions">AI Questions</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="candidate">Candidate *</Label>
                  <Select
                    value={newInterview.candidateId}
                    onValueChange={(value) => setNewInterview({ ...newInterview, candidateId: value })}
                    disabled={isLoadingCandidates}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingCandidates ? "Loading candidates..." : "Select candidate"} />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingCandidates ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading candidates...
                        </div>
                      ) : candidates.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          <div className="mb-2">No candidates available</div>
                          <div className="text-xs text-muted-foreground">
                            {currentUser ? `User: ${currentUser.role} | Loading: ${isLoadingCandidates}` : 'Not logged in'}
                          </div>
                        </div>
                      ) : (
                        candidates.map((candidate) => (
                          <SelectItem key={candidate.id} value={candidate.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{candidate.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {candidate.skills.slice(0, 3).join(", ")} • {candidate.status}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="job">Job Position *</Label>
                  <Select
                    value={newInterview.jobId}
                    onValueChange={(value) => setNewInterview({ ...newInterview, jobId: value })}
                    disabled={isLoadingJobs}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingJobs ? "Loading jobs..." : "Select job"} />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingJobs ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Loading jobs...
                        </div>
                      ) : jobs.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          <div className="mb-2">No jobs available</div>
                          <div className="text-xs text-muted-foreground">
                            {currentUser ? `User: ${currentUser.role} | Loading: ${isLoadingJobs}` : 'Not logged in'}
                          </div>
                        </div>
                      ) : (
                        jobs.map((job) => (
                          <SelectItem key={job.id} value={job.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{job.title}</span>
                              <span className="text-xs text-muted-foreground">
                                {job.company} • {job.location} • {job.type}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newInterview.time}
                    onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Select
                    value={newInterview.duration?.toString()}
                    onValueChange={(value) => setNewInterview({ ...newInterview, duration: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Interview Type *</Label>
                  <Select
                    value={newInterview.type}
                    onValueChange={(value) => setNewInterview({ ...newInterview, type: value as Interview["type"] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="virtual">Virtual (Video Call)</SelectItem>
                      <SelectItem value="ai">AI Interview</SelectItem>
                      <SelectItem value="on-site">On-site</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="interview-mode"
                    checked={newInterview.interviewMode === "ai"}
                    onCheckedChange={(checked) => 
                      setNewInterview({ ...newInterview, interviewMode: checked ? "ai" : "human" })
                    }
                  />
                  <Label htmlFor="interview-mode">
                    {newInterview.interviewMode === "ai" ? "AI Interview" : "Human Interview"}
                  </Label>
                </div>
                
                {/* Interview Mode Information */}
                <div className={`p-4 rounded-lg border ${
                  newInterview.interviewMode === "ai" 
                    ? "bg-cyan-50 border-cyan-200" 
                    : "bg-blue-50 border-blue-200"
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {newInterview.interviewMode === "ai" ? (
                      <>
                        <Bot className="h-5 w-5 text-cyan-600" />
                        <span className="font-medium text-cyan-800">AI Interview Platform</span>
                      </>
                    ) : (
                      <>
                        <User className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Human Interview</span>
                      </>
                    )}
                  </div>
                  
                  {newInterview.interviewMode === "ai" ? (
                    <div className="text-sm text-cyan-700 space-y-1">
                      <p>• Conducted on our AI-powered platform</p>
                      <p>• Real-time adaptive questioning</p>
                      <p>• Automated scoring and feedback</p>
                      <p>• Available 24/7, no scheduling conflicts</p>
                    </div>
                  ) : (
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>• Traditional human interviewer</p>
                      <p>• Personal interaction and rapport</p>
                      <p>• Manual evaluation and feedback</p>
                      <p>• Requires scheduling coordination</p>
                    </div>
                  )}
                </div>
              </div>

              {newInterview.type === "on-site" && (
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Office address or location"
                    value={newInterview.location}
                    onChange={(e) => setNewInterview({ ...newInterview, location: e.target.value })}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions or notes for the interview..."
                  value={newInterview.notes}
                  onChange={(e) => setNewInterview({ ...newInterview, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="interviewer" className="space-y-4">
              {newInterview.interviewMode === "human" ? (
                <>
                  <div>
                    <Label htmlFor="interviewer">Interviewer Name *</Label>
                    <Select
                      value={newInterview.interviewer}
                      onValueChange={(value) => setNewInterview({ ...newInterview, interviewer: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select interviewer" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockUsers
                          .filter((u) => u.role === "recruiter" || u.role === "admin")
                          .map((user) => (
                            <SelectItem key={user.id} value={user.name}>
                              {user.name} ({user.role})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="interviewerEmail">Interviewer Email</Label>
                      <Input
                        id="interviewerEmail"
                        type="email"
                        placeholder="interviewer@company.com"
                        value={newInterview.interviewerEmail}
                        onChange={(e) => setNewInterview({ ...newInterview, interviewerEmail: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="interviewerPhone">Interviewer Phone</Label>
                      <Input
                        id="interviewerPhone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={newInterview.interviewerPhone}
                        onChange={(e) => setNewInterview({ ...newInterview, interviewerPhone: e.target.value })}
                      />
                    </div>
                  </div>

                  {newInterview.type === "virtual" && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-800">
                        <Video className="h-5 w-5" />
                        <span className="font-medium">Google Meet Integration</span>
                      </div>
                      <p className="text-blue-700 text-sm mt-1">
                        A Google Meet link will be automatically generated and shared with all participants.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                  <div className="flex items-center gap-2 text-cyan-800">
                    <Bot className="h-5 w-5" />
                    <span className="font-medium">AI Interview Mode</span>
                  </div>
                  <p className="text-cyan-700 text-sm mt-1">
                    This interview will be conducted by our AI system. No human interviewer is required.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="ai-questions" className="space-y-4">
              {newInterview.interviewMode === "ai" && newInterview.jobId ? (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-cyan-600" />
                    <span className="font-medium">AI-Generated Questions</span>
                  </div>
                  
                  <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                    <p className="text-cyan-800 text-sm mb-3">
                      Based on the selected job requirements, our AI will generate relevant interview questions.
                    </p>
                    
                    {(() => {
                      const job = jobs.find((j) => j.id === newInterview.jobId)
                      if (job) {
                        const questions = generateAIQuestions(job.requirements, job.title)
                        return (
                          <div className="space-y-2">
                            <h4 className="font-medium text-cyan-800">Sample Questions:</h4>
                            <ul className="space-y-1">
                              {questions.slice(0, 5).map((question, index) => (
                                <li key={index} className="text-sm text-cyan-700 flex items-start gap-2">
                                  <span className="text-cyan-500 mt-1">•</span>
                                  <span>{question}</span>
                                </li>
                              ))}
                            </ul>
                            <p className="text-xs text-cyan-600 mt-2">
                              * Final questions will be customized based on the candidate's profile and job requirements.
                            </p>
                          </div>
                        )
                      }
                      return (
                        <p className="text-cyan-600 text-sm">
                          Select a job position to see AI-generated questions.
                        </p>
                      )
                    })()}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="h-5 w-5" />
                    <span className="font-medium">Interview Questions</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">
                    {newInterview.interviewMode === "human" 
                      ? "Human interviews will use standard question templates."
                      : "Select AI interview mode and a job position to see AI-generated questions."
                    }
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateInterviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateInterview}>Schedule Interview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Interview Details Dialog */}
      <Dialog open={isViewDetailsDialogOpen} onOpenChange={setIsViewDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Interview Details</DialogTitle>
            <CardDescription>
              {selectedInterview?.candidateName} - {selectedInterview?.jobTitle}
            </CardDescription>
          </DialogHeader>
          
          {selectedInterview && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Candidate</Label>
                  <p className="text-lg font-semibold">{selectedInterview.candidateName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Job Position</Label>
                  <p className="text-lg font-semibold">{selectedInterview.jobTitle}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Company</Label>
                  <p className="text-lg font-semibold">{selectedInterview.companyName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge className={getStatusColor(selectedInterview.status)} variant="outline">
                    {selectedInterview.status}
                  </Badge>
                </div>
              </div>

              {/* Interview Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date & Time</Label>
                  <p className="text-lg font-semibold">
                    {selectedInterview.date} at {selectedInterview.time}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Duration</Label>
                  <p className="text-lg font-semibold">{selectedInterview.duration} minutes</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(selectedInterview.type)} variant="outline">
                      {getTypeIcon(selectedInterview.type)}
                      {selectedInterview.type}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Mode</Label>
                  <div className="flex items-center gap-2">
                    {selectedInterview.interviewMode === "ai" ? (
                      <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30" variant="outline">
                        <Bot className="h-4 w-4 mr-1" />
                        AI Interview
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30" variant="outline">
                        <User className="h-4 w-4 mr-1" />
                        Human Interview
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Interviewer Information */}
              {selectedInterview.interviewMode === "human" && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground">Interviewer Details</Label>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-xs font-medium text-muted-foreground">Name</Label>
                      <p className="font-medium">{selectedInterview.interviewer}</p>
                    </div>
                    {selectedInterview.interviewerEmail && (
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                        <p className="font-medium">{selectedInterview.interviewerEmail}</p>
                      </div>
                    )}
                    {selectedInterview.interviewerPhone && (
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground">Phone</Label>
                        <p className="font-medium">{selectedInterview.interviewerPhone}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Location/Meeting Link */}
              {selectedInterview.type === "on-site" && selectedInterview.location && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                  <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <p className="font-medium">{selectedInterview.location}</p>
                  </div>
                </div>
              )}

              {selectedInterview.meetingLink && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground">Meeting Link</Label>
                  <div className="flex items-center gap-2 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <Video className="h-5 w-5 text-purple-600" />
                    <a 
                      href={selectedInterview.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline font-medium"
                    >
                      Join Google Meet
                    </a>
                  </div>
                </div>
              )}

              {/* AI Interview Platform Information */}
              {selectedInterview.interviewMode === "ai" && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground">AI Interview Platform</Label>
                  <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Bot className="h-5 w-5 text-cyan-600" />
                      <span className="font-medium text-cyan-800">AI Interview System</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-cyan-800 mb-2">How AI Interviews Work:</h4>
                        <ul className="text-sm text-cyan-700 space-y-1">
                          <li className="flex items-start gap-2">
                            <span className="text-cyan-500 mt-1">•</span>
                            <span>Conducted on our secure AI platform</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-cyan-500 mt-1">•</span>
                            <span>Real-time AI conversation with voice/text</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-cyan-500 mt-1">•</span>
                            <span>Adaptive questions based on responses</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-cyan-500 mt-1">•</span>
                            <span>Automated scoring and feedback</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="pt-3 border-t border-cyan-200">
                        <Button 
                          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                          onClick={() => {
                            router.push(`/ai-interview/${selectedInterview.id}`)
                            setIsViewDetailsDialogOpen(false)
                          }}
                        >
                          <Bot className="h-4 w-4 mr-2" />
                          Launch AI Interview Platform
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Questions */}
              {selectedInterview.interviewMode === "ai" && selectedInterview.aiQuestions && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground">Sample AI Interview Questions</Label>
                  <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-5 w-5 text-cyan-600" />
                      <span className="font-medium text-cyan-800">Generated Questions</span>
                    </div>
                    <ul className="space-y-2">
                      {selectedInterview.aiQuestions.map((question, index) => (
                        <li key={index} className="text-sm text-cyan-700 flex items-start gap-2">
                          <span className="text-cyan-500 mt-1">•</span>
                          <span>{question}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-cyan-600 mt-3">
                      * Questions will be dynamically adapted during the interview based on candidate responses.
                    </p>
                  </div>
                </div>
              )}

              {/* Feedback and Score */}
              {selectedInterview.status === "Completed" && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground">Interview Results</Label>
                  <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    {selectedInterview.score !== undefined && (
                      <div>
                        <Label className="text-xs font-medium text-muted-foreground">Score</Label>
                        <p className="text-2xl font-bold text-green-600">{selectedInterview.score}/5</p>
                      </div>
                    )}
                    {selectedInterview.feedback && (
                      <div className="col-span-2">
                        <Label className="text-xs font-medium text-muted-foreground">Feedback</Label>
                        <p className="text-sm text-green-700 mt-1">{selectedInterview.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedInterview.notes && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-muted-foreground">Additional Notes</Label>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm">{selectedInterview.notes}</p>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                {selectedInterview.createdDate && (
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Created</Label>
                    <p>{new Date(selectedInterview.createdDate).toLocaleDateString()}</p>
                  </div>
                )}
                {selectedInterview.modifiedDate && (
                  <div>
                    <Label className="text-xs font-medium text-muted-foreground">Last Modified</Label>
                    <p>{new Date(selectedInterview.modifiedDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailsDialogOpen(false)}>
              Close
            </Button>
            {selectedInterview?.status === "Scheduled" && (
              <Button 
                variant="outline" 
                className="bg-yellow-500 text-white hover:bg-yellow-600"
                onClick={() => handleRescheduleInterview(selectedInterview)}
              >
                Reschedule
              </Button>
            )}
            {selectedInterview?.status === "Scheduled" && (
              <Button 
                variant="outline" 
                className="bg-red-500 text-white hover:bg-red-600"
                onClick={() => handleCancelInterview(selectedInterview)}
              >
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Interview Dialog */}
      <Dialog open={isRescheduleDialogOpen} onOpenChange={setIsRescheduleDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reschedule Interview</DialogTitle>
            <CardDescription>
              Reschedule interview for {selectedInterview?.candidateName} - {selectedInterview?.jobTitle}
            </CardDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="reschedule-date">New Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !rescheduleDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {rescheduleDate ? format(rescheduleDate, "PPP") : "Pick a new date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={rescheduleDate}
                    onSelect={setRescheduleDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="reschedule-time">New Time *</Label>
              <Input
                id="reschedule-time"
                type="time"
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
              />
            </div>

            {selectedInterview && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-800">
                  <p><strong>Current Schedule:</strong></p>
                  <p>Date: {selectedInterview.date}</p>
                  <p>Time: {selectedInterview.time}</p>
                  <p>Duration: {selectedInterview.duration} minutes</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRescheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmReschedule}
              disabled={!rescheduleDate || !rescheduleTime}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
            >
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
