"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Lightbulb, Sparkles, Briefcase, Loader2, Clock } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "@/redux/store"
import { createCandidatePipeline } from "@/redux/candidatesThunk"
import { useRouter } from "next/navigation"
import { fetchJobs } from "@/redux/jobsThunk"

export function ResumeParserPage() {
  const [resumeText, setResumeText] = useState("")
  const [selectedJobId, setSelectedJobId] = useState("")
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)
  const [analysisAttempted, setAnalysisAttempted] = useState(false)
  const { toast } = useToast()
  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const dispatch = useDispatch<AppDispatch>()
  const { jobs, loading: jobsLoading, error: jobsError } = useSelector((state: RootState) => state.jobs)
  const { pipelineLoading, pipelineError, pipelineResponse } = useSelector((state: RootState) => state.candidates)
  const router = useRouter()

  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || currentUser.role === "candidate")) {
      router.push("/login")
    }
  }, [currentUser, isLoadingUser, router])

  const selectedJob = useMemo(() => {
    return jobs.find((job) => job.id === selectedJobId)
  }, [selectedJobId, jobs])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setResumeFile(file)
    setResumeText("") // Clear pasted text if file is selected
    toast({
      title: "File Selected",
      description: `${file.name} selected for upload.`,
      id: "resume-file-selected"
    })
  }

  const handleAnalyzeResume = async () => {
    if (!resumeFile) {
      toast({
        title: "Missing Resume File",
        description: "Please upload a resume file (PDF, DOCX, or TXT) to analyze.",
        variant: "destructive",
        id: "missing-resume-file"
      })
      return
    }
    if (!selectedJobId) {
      toast({
        title: "Missing Job Description",
        description: "Please select a job description for matching.",
        variant: "destructive",
        id: "missing-job-desc"
      })
      return
    }
    setAnalysisAttempted(true)
    dispatch(createCandidatePipeline({ resumeFile, jobDescription: selectedJob?.description || "" }))
  }

  if (isLoadingUser || !currentUser || currentUser.role === "candidate") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading resume parser...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Resume Parser & AI Match</h1>
        <p className="text-muted-foreground">Analyze resumes against job descriptions for best fit.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Job Description for Matching */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" /> Job Description for Matching
            </CardTitle>
            <CardDescription>Select a job to compare the resume against.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a job description" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title} at {job.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedJob && (
              <div className="h-[200px] rounded-md border p-4 overflow-y-auto">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{selectedJob.title}</p>
                  <p>{selectedJob.description}</p>
                  {selectedJob.requirements.length > 0 && (
                    <>
                      <p className="font-medium text-foreground mt-2">Requirements:</p>
                      <ul className="list-disc list-inside">
                        {selectedJob.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload & Parse Resume */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" /> Upload & Parse Resume
            </CardTitle>
            <CardDescription>Upload a resume file or paste text directly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="resume-upload">Upload Resume (TXT, PDF, DOCX)</Label>
              
<input
  id="resume-upload"
  type="file"
  onChange={handleFileChange}
/>

            </div>
           
            <Button onClick={handleAnalyzeResume} className="w-full" disabled={pipelineLoading}>
              {pipelineLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                </>
              ) : (
                "Analyze Resume"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis & Parsed Data */}
      {analysisAttempted && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" /> AI Analysis & Parsed Data
            </CardTitle>
            <CardDescription>Insights generated from the resume and job description.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {pipelineLoading && (
              <div className="flex flex-col items-center justify-center h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p className="text-muted-foreground">Generating analysis...</p>
              </div>
            )}
            {!pipelineLoading && (
              <>
                {pipelineError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {pipelineError}</span>
                  </div>
                )}

                {pipelineResponse && (
                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-200 p-6 shadow-md border shadow-lg mt-6 animate-fade-in">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      {/* Left: Candidate Info & Score */}
                      <div className="flex-1 flex flex-col items-center md:items-start gap-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
                          <div className="flex flex-col items-center md:items-start flex-1">
                            <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2 mb-1">
                              <Sparkles className="h-7 w-7 text-blue-500 animate-spin-slow" />
                              {pipelineResponse.name}
                            </h2>
                            <div className="flex flex-wrap gap-2 text-sm text-blue-800 mb-2">
                              <span className="bg-blue-100 rounded px-2 py-0.5">{pipelineResponse.currentTitle}</span>
                              <span className="bg-blue-100 rounded px-2 py-0.5">{pipelineResponse.company}</span>
                              <span className="bg-blue-100 rounded px-2 py-0.5">{pipelineResponse.location}</span>
                            </div>
                            <div className="text-sm text-blue-900 space-y-1">
                              <div><span className="font-medium">Email:</span> {pipelineResponse.email}</div>
                              <div><span className="font-medium">Phone:</span> {pipelineResponse.phone}</div>
                              {pipelineResponse.linkedIn && <div><span className="font-medium">LinkedIn:</span> <a href={pipelineResponse.linkedIn} className="underline text-blue-700" target="_blank" rel="noopener noreferrer">{pipelineResponse.linkedIn}</a></div>}
                              <div><span className="font-medium">Experience:</span> {pipelineResponse.experienceYears} years</div>
                              {pipelineResponse.noticePeriod && <div><span className="font-medium">Notice Period:</span> {pipelineResponse.noticePeriod}</div>}
                            </div>
                          </div>
                          {/* Score Ring */}
                          <div className="flex flex-col items-center justify-center min-w-[120px]">
                            <div className="relative">
                              <svg width="100" height="100">
                                <circle cx="50" cy="50" r="45" fill="#e0e7ff" />
                                <circle
                                  cx="50" cy="50" r="45"
                                  fill="none"
                                  stroke="#2563eb"
                                  strokeWidth="8"
                                  strokeDasharray={2 * Math.PI * 45}
                                  strokeDashoffset={2 * Math.PI * 45 * (1 - (pipelineResponse.score ?? 0) / 100)}
                                  strokeLinecap="round"
                                  style={{ transition: 'stroke-dashoffset 0.5s' }}
                                />
                                <text x="50" y="56" textAnchor="middle" fontSize="2rem" fill="#1e40af" fontWeight="bold">{pipelineResponse.score ?? '-'}</text>
                              </svg>
                              <span className="absolute left-1/2 -translate-x-1/2 bottom-2 text-xs text-blue-700 font-semibold bg-blue-100 px-2 py-0.5 rounded-full">
                                Score
                              </span>
                            </div>
                            {pipelineResponse.aiFit && (
                              <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${pipelineResponse.aiFit.fit === 'EXCELLENT' ? 'bg-green-200 text-green-800' : pipelineResponse.aiFit.fit === 'MODERATE' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>{pipelineResponse.aiFit.fit}</span>
                            )}
                          </div>
                        </div>
                        {/* AI Fit Reason */}
                        {pipelineResponse.aiFit && (
                          <div className="bg-blue-100 rounded p-3 text-blue-900 text-sm mt-2 w-full">
                            <span className="font-semibold">AI Fit Reason:</span> {pipelineResponse.aiFit.reason}
                          </div>
                        )}
                        {/* Education & Certifications */}
                        <div className="bg-white/80 rounded-lg p-4 shadow-sm w-full">
                          <div className="flex items-center gap-2 mb-2">
                            <Briefcase className="h-5 w-5 text-blue-700" />
                            <span className="font-semibold text-blue-900">Education</span>
                          </div>
                          <ul className="list-disc list-inside text-blue-900 text-sm ml-4 mb-2">
                            {pipelineResponse.education?.map((e: string, idx: number) => <li key={idx}>{e}</li>)}
                          </ul>
                          <div className="flex items-center gap-2 mb-2 mt-2">
                            <Briefcase className="h-5 w-5 text-blue-700" />
                            <span className="font-semibold text-blue-900">Certifications</span>
                          </div>
                          <ul className="list-disc list-inside text-blue-900 text-sm ml-4">
                            {pipelineResponse.certifications?.map((c: string, idx: number) => <li key={idx}>{c}</li>)}
                          </ul>
                        </div>
                      </div>
                      {/* Right: Details */}
                      <div className="flex-1 grid grid-cols-1 gap-6 w-full">
                        {/* Skills & Gaps */}
                        <div className="bg-white/80 rounded-lg p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="h-5 w-5 text-yellow-500" />
                            <span className="font-semibold text-blue-900">Skills</span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {pipelineResponse.skills?.slice(0, 10).map((s: string, idx: number) => (
                              <span key={idx} className="bg-blue-200 text-blue-900 rounded px-2 py-0.5 text-xs">{s}</span>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className="font-semibold text-blue-900">Skill Gap:</span>
                            {pipelineResponse.skillGap?.length ? pipelineResponse.skillGap.map((g: string, idx: number) => (
                              <span key={idx} className="bg-red-100 text-red-800 rounded px-2 py-0.5 text-xs mr-1">{g}</span>
                            )) : <span className="text-green-700">None</span>}
                          </div>
                        </div>
                        {/* Strengths & Weaknesses */}
                        <div className="bg-white/80 rounded-lg p-4 shadow-sm">
                          <div className="flex gap-8">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="h-5 w-5 text-green-500" />
                                <span className="font-semibold text-green-800">Strengths</span>
                              </div>
                              <ul className="list-disc list-inside text-green-900 text-sm ml-4">
                                {pipelineResponse.strengths?.map((s: string, idx: number) => <li key={idx}>{s}</li>)}
                              </ul>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <FileText className="h-5 w-5 text-red-500" />
                                <span className="font-semibold text-red-800">Weaknesses</span>
                              </div>
                              <ul className="list-disc list-inside text-red-900 text-sm ml-4">
                                {pipelineResponse.weaknesses?.map((w: string, idx: number) => <li key={idx}>{w}</li>)}
                              </ul>
                            </div>
                          </div>
                        </div>
                        {/* Career Gap & Fakeness */}
                        <div className="bg-white/80 rounded-lg p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-5 w-5 text-yellow-700" />
                            <span className="font-semibold text-yellow-900">Career Gap</span>
                          </div>
                          <ul className="list-disc list-inside text-yellow-900 text-sm ml-4 mb-2">
                            {pipelineResponse.careerGap?.length ? pipelineResponse.careerGap.map((g: string, idx: number) => <li key={idx}>{g}</li>) : <li>None</li>}
                          </ul>
                          <div className="flex items-center gap-2 mb-2 mt-2">
                            <Sparkles className="h-5 w-5 text-red-700" />
                            <span className="font-semibold text-red-900">Fakeness Indicators</span>
                          </div>
                          <ul className="list-disc list-inside text-red-900 text-sm ml-4">
                            {pipelineResponse.fakenessIndicators?.length ? pipelineResponse.fakenessIndicators.map((f: string, idx: number) => <li key={idx}>{f}</li>) : <li>None</li>}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
