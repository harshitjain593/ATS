"use client"

import { MainLayout } from "@/layouts/main-layout"
import { JobDetailsPage } from "@/components/pages/job-details-page"
import { useMemo } from "react"
import { use } from "react"
import { mockJobs } from "@/data/mock-data"

export default function JobDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const jobId = resolvedParams.id

  const job = useMemo(() => {
    return mockJobs.find((j) => j.id === jobId)
  }, [jobId])

  const breadcrumbs = useMemo(() => {
    const base = [{ label: "Jobs", href: "/jobs" }]
    if (job) {
      base.push({ label: job.title, href: `/jobs/${jobId}` })
    }
    return base
  }, [job, jobId])

  return (
    
      <JobDetailsPage jobId={jobId} />
   
  )
}
