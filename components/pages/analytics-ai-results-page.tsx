"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockInterviews, mockCandidates, mockJobs } from "@/data/mock-data"
import { useUser } from "@/context/user-context"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Sparkles, User, Briefcase, Calendar, Clock, MessageSquare, Star } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export function AnalyticsAiResultsPage({ interviewId }: { interviewId: string }) {
  const currentUser = useSelector((state: RootState) => state.users.authUser)
  const isLoadingUser = useSelector((state: RootState) => state.users.loadingAuth)
  const router = useRouter()
  const { toast } = useToast()

  const [aiFeedback, setAiFeedback] = useState<string | null>(null)
  const [isLoadingAiFeedback, setIsLoadingAiFeedback] = useState(false)

  const interview = useMemo(() => mockInterviews.find((i) => i.id === interviewId), [interviewId])
  const candidate = useMemo(() => mockCandidates.find((c) => c.id === interview?.candidateId), [interview])
  const job = useMemo(() => mockJobs.find((j) => j.id === interview?.jobId), [interview])

  useEffect(() => {
    if (!isLoadingUser && (!currentUser || (currentUser.role === "candidate" && currentUser.id !== candidate?.id))) {
      router.push("/login")
    }
  }, [currentUser, isLoadingUser, router, candidate])

  const generateAiFeedback = async () => {
    if (!interview || !candidate || !job) {
      toast({
        title: "Error",
        description: "Interview details not found.",
        variant: "destructive",
      })
      return
    }

    setIsLoadingAiFeedback(true)
    setAiFeedback(null)

    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `Generate a comprehensive AI analysis for the following interview.
        Include:
        1. Overall performance summary (2-3 sentences).
        2. Strengths demonstrated by the candidate.
        3. Areas for improvement for the candidate.
        4. A final recommendation (e.g., "Strong Hire", "Consider", "No Hire").

        Interview Details:
        Candidate: ${candidate.name}
        Job: ${job.title}
        Interview Type: ${interview.type}
        Interview Date: ${interview.date}
        Interviewer Feedback: ${interview.feedback || "No specific feedback provided."}
        Interviewer Score: ${interview.score || "N/A"}/5
        Candidate Skills: ${candidate.skills.join(", ")}
        Job Requirements: ${job.requirements.join(", ")}
        `,
      })
      setAiFeedback(text)
      toast({
        title: "AI Feedback Generated",
        description: "Comprehensive AI analysis is ready.",
      })
    } catch (error) {
      console.error("Error generating AI feedback:", error)
      toast({
        title: "AI Feedback Failed",
        description: "Could not generate AI feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingAiFeedback(false)
    }
  }

  if (isLoadingUser || !currentUser || (currentUser.role === "candidate" && currentUser.id !== candidate?.id)) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading AI results...</p>
      </div>
    )
  }

  if (!interview || !candidate || !job) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
        <p className="text-muted-foreground">Interview not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Interview Analysis</h1>
        <p className="text-muted-foreground">Detailed AI-generated insights for the interview.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" /> Interview Summary
          </CardTitle>
          <CardDescription>Overview of the interview and candidate details.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Candidate: {candidate.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>Job: {job.title}</span>
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
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span>Type: {interview.type}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span>Interviewer Score: {interview.score !== undefined ? `${interview.score}/5` : "N/A"}</span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Interviewer Feedback:</h3>
            <p className="text-muted-foreground text-sm">
              {interview.feedback || "No specific feedback provided by the interviewer."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" /> AI-Generated Feedback
          </CardTitle>
          <CardDescription>Detailed analysis and recommendations from AI.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={generateAiFeedback} disabled={isLoadingAiFeedback}>
            {isLoadingAiFeedback ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              "Generate AI Feedback"
            )}
          </Button>
          {aiFeedback && <Textarea value={aiFeedback} readOnly rows={20} className="min-h-[400px]" />}
          {!aiFeedback && !isLoadingAiFeedback && (
            <div className="text-muted-foreground text-center py-8">
              Click "Generate AI Feedback" to get a detailed analysis.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
