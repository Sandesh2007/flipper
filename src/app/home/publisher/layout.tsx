"use client"
import Sidebar from "./components/Sidebar"

export default function PublisherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-primary/5">
        {children}
      </main>
    </div>
  )
} 