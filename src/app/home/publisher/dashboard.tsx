"use client"
import DashboardMain from "./components/DashboardMain"

export default function Dashboard() {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-neutral-100 text-neutral-900 dark:bg-white dark:text-neutral-900">
      <DashboardMain />
    </div>
  )
}
