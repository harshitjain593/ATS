import { Loader2 } from "lucide-react"

export default function MyApplicationsLoading() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-2 text-muted-foreground">Loading your applications...</p>
    </div>
  )
}
