"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { AppSidebar } from "./app-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { useSidebar } from "@/components/ui/sidebar"
import { useEffect } from "react"

export function MobileSidebar() {
  const isMobile = useIsMobile()
  const { openMobile, setOpenMobile } = useSidebar()

  // Close mobile sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [isMobile, setOpenMobile])

  if (!isMobile) {
    return null
  }

  return (
    <Sheet open={openMobile} onOpenChange={setOpenMobile}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[280px]">
        <AppSidebar />
      </SheetContent>
    </Sheet>
  )
}
