"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Sparkles } from "lucide-react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { useToast } from "@/components/ui/use-toast"

export function AiRecruiterCopilot({
  jobDescription,
  candidateResume,
}: {
  jobDescription: string
  candidateResume: string
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const { toast } = useToast()

  const handleAnalyze = async () => {
    setIsLoading(true)
    setAnalysisResult(null)
    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `As an AI Recruiter Copilot, analyze the following job description and candidate resume.
        Provide a concise summary of the candidate's strengths and weaknesses relative to the job, and suggest 3-5 tailored interview questions.

        Job Description:
        ${jobDescription}

        Candidate Resume:
        ${candidateResume}

        Analysis and Interview Questions:`,
      })
      setAnalysisResult(text)
      toast({
        title: "Analysis Complete",
        description: "AI Recruiter Copilot has generated insights.",
      })
    } catch (error) {
      console.error("Error generating AI analysis:", error)
      toast({
        title: "Analysis Failed",
        description: "Could not generate AI analysis. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Sparkles className="h-4 w-4" /> AI Recruiter Copilot
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" /> AI Recruiter Copilot
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            Get AI-powered insights on candidate fit and suggested interview questions.
          </p>
          <Button onClick={handleAnalyze} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
              </>
            ) : (
              "Generate Analysis"
            )}
          </Button>
          {analysisResult && (
            <div className="space-y-2">
              <h3 className="font-semibold">AI Analysis:</h3>
              <Textarea value={analysisResult} readOnly rows={15} className="min-h-[300px]" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
