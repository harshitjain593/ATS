"use client"

import { MainLayout } from "@/layouts/main-layout"
import { CandidateDetailsPage } from "@/components/pages/candidate-details-page"
import { useMemo, use } from "react"
import { mockCandidates } from "@/data/mock-data"

export default function CandidateDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id: candidateId } = use(params)

  const candidate = useMemo(() => {
    return mockCandidates.find((c) => c.id === candidateId)
  }, [candidateId])

  const breadcrumbs = useMemo(() => {
    const base = [{ label: "Candidates", href: "/candidates" }]
    if (candidate) {
      base.push({ label: candidate.name, href: "#" })
    }
    return base
  }, [candidate])

  return (
      <CandidateDetailsPage candidateId={candidateId} />
  )
}
