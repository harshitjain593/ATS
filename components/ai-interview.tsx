"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, Mic, Sparkles, StopCircle } from "lucide-react"
import { useChat } from "ai/react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"

export function AiInterview({ candidateName, jobTitle }: { candidateName: string; jobTitle: string }) {
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const { toast } = useToast()

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, setMessages } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "system-intro",
        role: "system",
        content: `You are an AI interviewer for the ${jobTitle} position. You are interviewing ${candidateName}.
        Start by introducing yourself and the interview process. Ask relevant questions based on the job title.
        Keep your responses concise and professional.`,
        parts: [
          {
            type: "text",
            text: `Hello ${candidateName}, I'm your AI interviewer for the ${jobTitle} position. Let's begin.`,
          },
        ],
      },
    ],
    onFinish: () => {
      toast({
        title: "Interview Turn Completed",
        description: "AI has finished its response.",
      })
    },
    onError: (error) => {
      toast({
        title: "Interview Error",
        description: `An error occurred: ${error.message}`,
        variant: "destructive",
      })
    },
  })

  const startInterview = () => {
    setIsInterviewStarted(true)
    setMessages([
      {
        id: "system-intro",
        role: "system",
        content: `You are an AI interviewer for the ${jobTitle} position. You are interviewing ${candidateName}.
        Start by introducing yourself and the interview process. Ask relevant questions based on the job title.
        Keep your responses concise and professional.`,
        parts: [
          {
            type: "text",
            text: `Hello ${candidateName}, I'm your AI interviewer for the ${jobTitle} position. Let's begin.`,
          },
        ],
      },
    ])
    toast({
      title: "Interview Started",
      description: "The AI interview has begun.",
    })
  }

  const endInterview = () => {
    setIsInterviewStarted(false)
    stop()
    setMessages([]) // Clear messages on end
    toast({
      title: "Interview Ended",
      description: "The AI interview has concluded.",
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Mic className="h-4 w-4" /> AI Interview
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" /> AI Interview with {candidateName} for {jobTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col flex-1 overflow-hidden">
          {!isInterviewStarted ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center text-muted-foreground">
              <p className="mb-4">Start an AI-powered interview simulation for {candidateName}.</p>
              <Button onClick={startInterview}>Start Interview</Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 p-4 border rounded-md mb-4">
                <div className="space-y-4">
                  {messages.map((m) => (
                    <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          m.role === "user" ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {m.parts.map((part, i) => {
                          switch (part.type) {
                            case "text":
                              return <div key={`${m.id}-${i}`}>{part.text}</div>
                          }
                        })}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[70%] p-3 rounded-lg bg-muted text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your response..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading}>
                  Send
                </Button>
                <Button type="button" variant="outline" onClick={endInterview} disabled={isLoading}>
                  <StopCircle className="h-4 w-4 mr-2" /> End
                </Button>
              </form>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
