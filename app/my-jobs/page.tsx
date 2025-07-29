"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Briefcase, MapPin, Clock, Users, Calendar, CheckCircle, Eye } from "lucide-react";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "@/redux/jobsThunk";
import { RootState } from "@/redux/store";
import { applyToJob } from "@/redux/jobsThunk";

export default function CandidateJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("");
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // const { currentUser, isLoadingUser } = useUser();
  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const dispatch = useDispatch();
  const { jobs, loading: jobsLoading, error: jobsError } = useSelector((state: RootState) => state.jobs);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || currentUser.role !== "candidate")) {
      router.push("/login");
    }
  }, [currentUser, isLoadingUser, router]);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  // Only show jobs with status 'Open'
  const openJobs = useMemo(() => jobs.filter((job: any) => job.status === "Open"), [jobs]);

  const filteredJobs = useMemo(() => {
    let currentJobs = openJobs;
    if (filterType !== "all") {
      currentJobs = currentJobs.filter((job: any) => job.type === filterType);
    }
    if (filterStatus !== "all") {
      currentJobs = currentJobs.filter((job: any) => job.status === filterStatus);
    }
    if (filterLocation) {
      currentJobs = currentJobs.filter((job: any) => job.location.toLowerCase().includes(filterLocation.toLowerCase()));
    }
    if (searchTerm) {
      currentJobs = currentJobs.filter((job: any) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return currentJobs;
  }, [searchTerm, filterType, filterStatus, filterLocation, openJobs]);

  const openApplyModal = (job: any) => {
    setSelectedJob(job);
    setResume("");
    setCoverLetter("");
    setResumeFile(null); // Reset file input
    setApplyModalOpen(true);
  };

  const handleApply = async () => {
    if (!resumeFile || !coverLetter) return;
    try {
      await dispatch(applyToJob({
        jobId: Number(selectedJob.id),
        userId: Number(currentUser?.id),
        status: "Applied",
        resumeFile,
        coverLetter,
      }));
      setAppliedJobs((prev) => [...prev, selectedJob.id]);
      setApplyModalOpen(false);
      toast({ title: "Application Submitted", description: "You have applied to this job." });
    } catch (error: any) {
      toast({ title: "Application Failed", description: error?.message || "Failed to apply." });
    }
  };

  if (isLoadingUser || !currentUser || currentUser.role !== "candidate") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Browse Jobs</h1>
          <p className="text-muted-foreground">Find and apply to jobs posted by recruiters.</p>
        </div>
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
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          placeholder="Location"
          className="w-full md:w-40"
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
        />
      </div>
      {/* Job Listings */}
      {filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No job postings found matching your criteria.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job: any) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{job.title}</CardTitle>
                  <Badge className="capitalize" variant="outline">
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
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{job.applicants?.length ?? 0} Applicants</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Posted: {job.postedDate}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href={`/jobs/${job.id}`} legacyBehavior>
                    <Button variant="outline" className="flex-1 gap-2">
                      <Eye className="h-4 w-4" /> View
                    </Button>
                  </Link>
                  <Button
                    className="flex-1 gap-2"
                    variant="default"
                    disabled={appliedJobs.includes(job.id)}
                    onClick={() => openApplyModal(job)}
                  >
                    {appliedJobs.includes(job.id) ? (
                      <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Applied</span>
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Apply Modal */}
      <Dialog open={applyModalOpen} onOpenChange={setApplyModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Apply to {selectedJob?.title}</DialogTitle>
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
  );
} 