import { MainLayout } from "@/layouts/main-layout"
import { AnalyticsPage } from "@/components/pages/analytics-page"

export default function Analytics() {
  return (
    <MainLayout breadcrumbs={[{ label: "Analytics" }]}>
      <AnalyticsPage />
    </MainLayout>
  )
}
