"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Bot, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  StopCircle, 
  Clock, 
  User, 
  Briefcase,
  Sparkles,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { mockInterviews } from "@/data/mock-data"
import type { Interview } from "@/lib/types"

export default function AIInterviewPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const currentUser = useSelector((state: RootState) => state.users.authUser)
  
  const [interview, setInterview] = useState<Interview | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [interviewProgress, setInterviewProgress] = useState(0)

  useEffect(() => {
    if (params.id) {
      const foundInterview = mockInterviews.find(int => int.id === params.id)
      if (foundInterview && foundInterview.interviewMode === "ai") {
        setInterview(foundInterview)
      } else {
        toast({
          title: "Interview Not Found",
          description: "This interview is not available or not an AI interview.",
          variant: "destructive",
          id: "interview-not-found"
        })
        router.push("/interviews")
      }
      setIsLoading(false)
    }
  }, [params.id, router, toast])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isInterviewStarted && !isRecording) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isInterviewStarted, isRecording])

  useEffect(() => {
    if (interview && interview.aiQuestions) {
      setInterviewProgress((currentQuestionIndex / interview.aiQuestions.length) * 100)
    }
  }, [currentQuestionIndex, interview])

  const startInterview = () => {
    setIsInterviewStarted(true)
    setTimeElapsed(0)
    toast({
      title: "AI Interview Started",
      description: "The interview has begun. Good luck!",
      id: "interview-started"
    })
  }

  const startRecording = () => {
    setIsRecording(true)
    toast({
      title: "Recording Started",
      description: "Your answer is being recorded.",
      id: "recording-started"
    })
  }

  const stopRecording = () => {
    setIsRecording(false)
    // Simulate processing the recorded answer
    setTimeout(() => {
      setAnswers(prev => [...prev, currentAnswer || "Audio response recorded"])
      setCurrentAnswer("")
      if (interview && interview.aiQuestions && currentQuestionIndex < interview.aiQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        // Interview completed
        setIsInterviewStarted(false)
        toast({
          title: "Interview Completed",
          description: "Thank you for completing the AI interview!",
          id: "interview-completed"
        })
      }
    }, 1000)
  }

  const submitTextAnswer = () => {
    if (currentAnswer.trim()) {
      setAnswers(prev => [...prev, currentAnswer])
      setCurrentAnswer("")
      if (interview && interview.aiQuestions && currentQuestionIndex < interview.aiQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      } else {
        // Interview completed
        setIsInterviewStarted(false)
        toast({
          title: "Interview Completed",
          description: "Thank you for completing the AI interview!",
          id: "interview-completed"
        })
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Bot className="h-12 w-12 mx-auto mb-4 animate-pulse" />
          <p>Loading AI Interview...</p>
        </div>
      </div>
    )
  }

  if (!interview) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p>Interview not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="h-12 w-12 text-cyan-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Interview Platform</h1>
              <p className="text-gray-600">Powered by Advanced AI Technology</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{interview.candidateName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>{interview.jobTitle}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{interview.duration} minutes</span>
            </div>
          </div>
        </div>

        {/* Interview Status Card */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-600" />
              Interview Progress
            </CardTitle>
            <CardDescription>
              {isInterviewStarted ? "Interview in progress" : "Ready to begin"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-600">{Math.round(interviewProgress)}%</span>
            </div>
            <Progress value={interviewProgress} className="h-2" />
            
            {isInterviewStarted && (
              <div className="flex items-center justify-between text-sm">
                <span>Time Elapsed: {formatTime(timeElapsed)}</span>
                <span>Question {currentQuestionIndex + 1} of {interview.aiQuestions?.length || 0}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Interview Area */}
        {!isInterviewStarted ? (
          <Card className="bg-white shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Welcome to Your AI Interview</CardTitle>
              <CardDescription className="text-lg">
                This interview will be conducted by our advanced AI system. 
                You can respond using voice or text.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="p-6 bg-cyan-50 rounded-lg border border-cyan-200">
                <h3 className="font-semibold text-cyan-800 mb-3">How it works:</h3>
                <ul className="text-sm text-cyan-700 space-y-2 text-left max-w-md mx-auto">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-cyan-600" />
                    <span>AI will ask questions based on the job requirements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-cyan-600" />
                    <span>Respond using voice recording or text input</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-cyan-600" />
                    <span>Questions adapt based on your responses</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-cyan-600" />
                    <span>Get instant feedback and scoring</span>
                  </li>
                </ul>
              </div>
              
              <Button 
                size="lg" 
                className="bg-cyan-600 hover:bg-cyan-700"
                onClick={startInterview}
              >
                <Play className="h-5 w-5 mr-2" />
                Start AI Interview
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Current Question */}
            {interview.aiQuestions && currentQuestionIndex < interview.aiQuestions.length && (
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-cyan-600" />
                    Question {currentQuestionIndex + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg mb-6">{interview.aiQuestions[currentQuestionIndex]}</p>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Your Response:</h4>
                    
                    {/* Voice Recording */}
                    <div className="flex items-center gap-4">
                      <Button
                        variant={isRecording ? "destructive" : "outline"}
                        onClick={isRecording ? stopRecording : startRecording}
                        className="flex items-center gap-2"
                      >
                        {isRecording ? (
                          <>
                            <StopCircle className="h-4 w-4" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4" />
                            Record Voice
                          </>
                        )}
                      </Button>
                      
                      {isRecording && (
                        <div className="flex items-center gap-2 text-red-600">
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                          Recording...
                        </div>
                      )}
                    </div>
                    
                    {/* Text Input */}
                    <div className="space-y-2">
                      <textarea
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        placeholder="Or type your answer here..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                        rows={4}
                      />
                      <Button 
                        onClick={submitTextAnswer}
                        disabled={!currentAnswer.trim()}
                        className="bg-cyan-600 hover:bg-cyan-700"
                      >
                        Submit Answer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Previous Answers */}
            {answers.length > 0 && (
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle>Your Responses</CardTitle>
                  <CardDescription>Review your previous answers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {answers.map((answer, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-600">Question {index + 1}:</span>
                          <Badge variant="outline" className="text-xs">
                            {interview.aiQuestions?.[index] ? "Answered" : "Voice Response"}
                          </Badge>
                        </div>
                        <p className="text-sm">{answer}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.push("/interviews")}
          >
            Back to Interviews
          </Button>
          
          {isInterviewStarted && (
            <Button 
              variant="destructive" 
              onClick={() => {
                setIsInterviewStarted(false)
                setCurrentQuestionIndex(0)
                setAnswers([])
                setTimeElapsed(0)
                toast({
                  title: "Interview Cancelled",
                  description: "The interview has been cancelled.",
                  id: "interview-cancelled"
                })
              }}
            >
              <StopCircle className="h-4 w-4 mr-2" />
              Cancel Interview
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
