"use client"

import { Button } from "@/components/ui/button"
import { PanelLeft } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleSidebar}>
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}
