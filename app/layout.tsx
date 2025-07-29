import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toast"
import { UserProvider } from "@/context/user-context"
import { MainLayout } from "@/layouts/main-layout"
import GlobalLoader from "@/components/global-loader"
import { Suspense } from "react"
import RouteLoader from "@/components/route-loader"
import { ReduxProvider } from "@/components/redux-provider"
import ClientUserInitializer from "@/components/client-user-initializer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ATS System",
  description: "Applicant Tracking System built with Next.js and Shadcn UI",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <ReduxProvider>
      <ClientUserInitializer />
      <RouteLoader />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <UserProvider>
            <Suspense fallback={<GlobalLoader />}>
              <MainLayout>{children}</MainLayout>
            </Suspense>
          </UserProvider>
          <Toaster />
        </ThemeProvider>
      </ReduxProvider>
        
      </body>
    </html>
  )
}
