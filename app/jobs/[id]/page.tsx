"use client"

import { MainLayout } from "@/layouts/main-layout"
import { JobDetailsPage } from "@/components/pages/job-details-page"
import { useMemo } from "react"
import { mockJobs } from "@/data/mock-data"

export default function JobDetails({ params }: { params: { id: string } }) {
  const jobId = params.id as string

  const job = useMemo(() => {
    return mockJobs.find((j) => j.id === jobId)
  }, [jobId])

  const breadcrumbs = useMemo(() => {
    const base = [{ label: "Jobs", href: "/jobs" }]
    if (job) {
      base.push({ label: job.title })
    }
    return base
  }, [job])

  return (
    
      <JobDetailsPage jobId={jobId} />
   
  )
}
