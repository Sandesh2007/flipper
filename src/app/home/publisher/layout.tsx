"use client"
import Sidebar from "./components/Sidebar"

export default function PublisherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
} 