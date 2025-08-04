"use client"
import { GradientBackground } from "@/components/ui/gradient-background"
import Sidebar from "./components/Sidebar"

export default function PublisherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <GradientBackground>
      <div className="flex flex-col lg:flex-row h-screen text-foreground">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </GradientBackground>
  )
} 