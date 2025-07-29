"use client"

import { MainLayout } from "@/layouts/main-layout"
import { AnalyticsAiResultsPage } from "@/components/pages/analytics-ai-results-page"

export default function AiResultsPage({ params }: { params: { id: string } }) {
  return (

      <AnalyticsAiResultsPage interviewId={params.id} />
   
  )
}
