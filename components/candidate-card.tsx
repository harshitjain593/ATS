"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Phone, Briefcase, GraduationCap, Eye, Mail } from "lucide-react"
import { type Candidate } from "@/lib/types"
import { MatchScoreRing } from "./match-score-ring"
import Link from "next/link"

interface CandidateCardProps {
  candidate: Candidate
  userAppliedJobs?: Array<{
    jobId: number;
    title: string;
    companyName: string;
    location: string;
    jobType: string;
    userId: number;
    matchScore?: number;
  }>
}

export function CandidateCard({ candidate, userAppliedJobs = [] }: CandidateCardProps) {
  const getStatusColor = (status: Candidate["status"]) => {
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

  // Filter applied jobs for this candidate if userAppliedJobs is provided
  // Note: candidate.id could be either userId (from candidates page) or applicationId (from job details page)
  const appliedJobs = userAppliedJobs ? userAppliedJobs.filter(job => {
    // If we have userAppliedJobs, use the userId from that data
    return String(job.userId) === String(candidate.id)
  }) : []

  // If no appliedJobs from userAppliedJobs, use the candidate's own appliedJobs
  const displayAppliedJobs = appliedJobs.length > 0 ? appliedJobs : candidate.appliedJobs

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
        {/* <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarFallback>{candidate.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar> */}
        <div className="grid gap-1 flex-1 min-w-0">
          <CardTitle className="text-sm">{candidate.name}</CardTitle>
          <CardDescription className="text-xs">{candidate.applicationEmail}</CardDescription>
        </div>
        <Badge className={`${getStatusColor(candidate.status)} flex-shrink-0 text-xs`} variant="outline">
          {candidate.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {candidate.applicationEmail && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4" />
            <span>{candidate.applicationEmail}</span>
          </div>
        )}
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
              {candidate.experience[0].title} at {candidate.experience[0].company} ({candidate.experience[0].years}{" "}
              years)
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
          {candidate.skills.slice(0, 3).map((skill: string, idx: number) => (
            <Badge key={idx} variant="secondary">
              {skill}
            </Badge>
          ))}
          {candidate.skills.length > 3 && <Badge variant="secondary">+{candidate.skills.length - 3} more</Badge>}
        </div>
        <Link href={`/candidates/${candidate.id}`}>
          <Button variant="outline" className="w-full mt-4 gap-2 bg-transparent">
            <Eye className="h-4 w-4" />
            View Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
