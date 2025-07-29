"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Briefcase, MapPin, Clock, Users, Calendar, Loader2 } from "lucide-react"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useDispatch, useSelector } from "react-redux"
import { fetchJobs, createJob, approveJob, rejectJob } from "@/redux/jobsThunk"
import { RootState, AppDispatch } from "@/redux/store"
import { Job } from "@/lib/types"

export function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all") // 'all', 'Full-time', 'Part-time', 'Contract', 'Internship'
  const [filterStatus, setFilterStatus] = useState("all") // 'all', 'Open', 'Closed', 'Draft'
  const [isCreateJobDialogOpen, setIsCreateJobDialogOpen] = useState(false)
  const [newJob, setNewJob] = useState<any>({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    status: "Draft",
    description: "",
    requirements: [],
    responsibilities: [],
    salaryCurrency: "",
    isApproved: false,
    experience: "",
    postedById: 0,
    applicationCount: 0,
    skills: "",
    benefits: "",
    deadLine: "",
    flag: "",
    companyName: "",
    isRemote: false,
    jobType: "FullTime",
    maxSalary: 0,
    minSalary: 0,
    createdBy: "",
    createdDate: "",
    modifiedBy: "",
    modifiedDate: "",
  })

  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const router = useRouter()

 
  const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>()
  const { jobs, loading, error } = useSelector((state: RootState) => state.jobs)

  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || currentUser.role === "candidate")) {
      router.push("/login")
    }
  }, [currentUser, isLoadingUser, router])

  const filteredJobs = useMemo(() => {
    let currentJobs = jobs
    if (filterType !== "all") {
      currentJobs = currentJobs.filter((job) => job.type === filterType)
    }
    if (filterStatus !== "all") {
      currentJobs = currentJobs.filter((job) => job.status === filterStatus)
    }
    if (searchTerm) {
      currentJobs = currentJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    return currentJobs
  }, [searchTerm, filterType, filterStatus, jobs])

  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.company || !newJob.location || !newJob.description) {
      toast({
        id: "create-job-error",
        title: "Missing Information",
        description: "Please fill in all required job details.",
        variant: "destructive",
      })
      return
    }
    // If status is 'PendingApproval', keep it as is, else default to 'Draft'
    const jobToCreate = { ...newJob, status: newJob.status === 'PendingApproval' ? 'PendingApproval' : 'Draft' }
    await dispatch(createJob(jobToCreate))
    
    setIsCreateJobDialogOpen(false)
    setNewJob({
      title: "",
      company: "",
      location: "",
      type: "Full-time",
      salary: "",
      status: "Draft",
      description: "",
      requirements: [],
      responsibilities: [],
    })
    toast({
      id: "create-job-success",
      title: "Job Created",
      description: `"${newJob.title}" at ${newJob.company} is pending admin approval.`,
    })
  }
  
  const handleApprove = async (jobId: string) => {
    await dispatch(approveJob(jobId));
    toast({
      id: `approve-job-success-${jobId}`,
      title: "Job Approved",
      description: "The job has been approved and is now open.",
    });
  };

  const handleReject = async (jobId: string) => {
    await dispatch(rejectJob(jobId));
    toast({
      id: `reject-job-success-${jobId}`,
      title: "Job Rejected",
      description: "The job has been rejected and removed.",
      variant: "destructive",
    });
  };

  const getStatusColor = (status: Job["status"]) => {
    switch (status) {
      case "Open":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Closed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "Draft":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "PendingApproval":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "Rejected":
        return "bg-red-700/20 text-red-700 border-red-700/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (isLoadingUser || !currentUser || currentUser.role === "candidate") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading jobs...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Job Postings</h1>
          <p className="text-muted-foreground">Manage and track all open and closed job positions.</p>
        </div>
        {(currentUser.role === "admin" || currentUser.role === "recruiter") && (
          <Button className="gap-2" onClick={() => setIsCreateJobDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Create New Job
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            className="w-full pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2 bg-transparent">
              Type: {filterType === "all" ? "All" : filterType}
              <Clock className="h-4 w-4" />
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
              <Calendar className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setFilterStatus("all")}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Open")}>Open</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Closed")}>Closed</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("Draft")}>Draft</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("PendingApproval")}>Pending Approval</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Job Listings */}
      {loading ? (
         <div className="flex items-center justify-center p-6">
           <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
         </div>
      ) : error ? (
        <Card>
          <CardContent className="p-6 text-center text-red-500">
            Error: {error}
          </CardContent>
        </Card>
      ) : filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No job postings found matching your criteria.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" /> {job.title}
                  <Badge className={`ml-2 border ${getStatusColor(job.status)}`}>{job.status}</Badge>
                </CardTitle>
                <CardDescription>{job.company}</CardDescription>
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
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{job.applicants?.length} Applicants</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Posted: {job.postedDate}</span>
                </div>
                <Link href={`/jobs/${job.id}`}>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    View Details
                  </Button>
                </Link>
                {/* Admin Approval Actions */}
                {currentUser.role === "admin" && job.status === "PendingApproval" && (
                  <div className="flex flex-col gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="w-full bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                      onClick={() => handleApprove(job.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleReject(job.id)}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create New Job Dialog */}
      <Dialog open={isCreateJobDialogOpen} onOpenChange={setIsCreateJobDialogOpen}>
        <DialogContent className="sm:max-w-[600px]" style={{ height: '80vh', overflowX: 'scroll' }}>
          <DialogHeader>
            <DialogTitle>Create New Job Posting</DialogTitle>
            <CardDescription>Fill in the details for the new job position.</CardDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newJob.title}
                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            {/* Company */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">
                Company
              </Label>
              <Input
                id="company"
                value={newJob.company}
                onChange={(e) => setNewJob({ ...newJob, company: e.target.value, companyName: e.target.value })}
                className="col-span-3"
              />
            </div>
            {/* Location */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={newJob.location}
                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                className="col-span-3"
              />
            </div>
            {/* Salary */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="salary" className="text-right">
                Salary (Range: min - max)
              </Label>
              <Input
                id="minSalary"
                type="number"
                placeholder="Min Salary"
                value={newJob.minSalary}
                onChange={(e) => setNewJob({ ...newJob, minSalary: Number(e.target.value) })}
                className="col-span-1"
              />
              <Input
                id="maxSalary"
                type="number"
                placeholder="Max Salary"
                value={newJob.maxSalary}
                onChange={(e) => setNewJob({ ...newJob, maxSalary: Number(e.target.value) })}
                className="col-span-1"
              />
              <Input
                id="salaryCurrency"
                placeholder="Currency (e.g. USD)"
                value={newJob.salaryCurrency}
                onChange={(e) => setNewJob({ ...newJob, salaryCurrency: e.target.value })}
                className="col-span-1"
              />
            </div>
            {/* Type */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select
                value={newJob.type}
                onValueChange={(value) => setNewJob({ ...newJob, type: value, jobType: value === "Full-time" ? "FullTime" : value === "Part-time" ? "PartTime" : value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Status */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                value={newJob.status}
                onValueChange={(value) => setNewJob({ ...newJob, status: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="PendingApproval">Pending Approval</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Description */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                className="col-span-3"
                rows={5}
              />
            </div>
            {/* Requirements */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requirements" className="text-right">
                Requirements (comma-separated)
              </Label>
              <Textarea
                id="requirements"
                value={Array.isArray(newJob.requirements) ? newJob.requirements.join(", ") : newJob.requirements}
                onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value.split(",").map((s: string) => s.trim()) })}
                className="col-span-3"
                rows={3}
              />
            </div>
            {/* Responsibilities */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="responsibilities" className="text-right">
                Responsibilities (comma-separated)
              </Label>
              <Textarea
                id="responsibilities"
                value={Array.isArray(newJob.responsibilities) ? newJob.responsibilities.join(", ") : newJob.responsibilities}
                onChange={(e) => setNewJob({ ...newJob, responsibilities: e.target.value.split(",").map((s: string) => s.trim()) })}
                className="col-span-3"
                rows={3}
              />
            </div>
            {/* Experience */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="experience" className="text-right">
                Experience
              </Label>
              <Input
                id="experience"
                value={newJob.experience}
                onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                className="col-span-3"
              />
            </div>
            {/* Skills */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="skills" className="text-right">
                Skills (comma-separated)
              </Label>
              <Textarea
                id="skills"
                value={newJob.skills}
                onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                className="col-span-3"
                rows={2}
              />
            </div>
            {/* Benefits */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="benefits" className="text-right">
                Benefits
              </Label>
              <Input
                id="benefits"
                value={newJob.benefits}
                onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })}
                className="col-span-3"
              />
            </div>
            {/* Deadline */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadLine" className="text-right">
                Deadline
              </Label>
              <Input
                id="deadLine"
                type="date"
                value={newJob.deadLine}
                onChange={(e) => setNewJob({ ...newJob, deadLine: e.target.value })}
                className="col-span-3"
              />
            </div>
            {/* Is Remote */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isRemote" className="text-right">
                Remote?
              </Label>
              <Select
                value={newJob.isRemote ? "true" : "false"}
                onValueChange={(value) => setNewJob({ ...newJob, isRemote: value === "true" })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
           
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateJobDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateJob}>Create Job</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
