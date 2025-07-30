"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Library,
  FileText,
  Users,
  BarChart3,
  HelpCircle,
  Upload,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"

export default function Sidebar() {
  const [isLibraryOpen, setIsLibraryOpen] = useState(true)
  const { user } = useAuth()
  const isLoggedIn = user !== null
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-64  bg-neutral-200 dark:bg-neutral-800 flex-col">
      <div className="p-4">
        <Link href="/home/create">
        <Button variant="outline" className="w-full cursor-pointer text-neutral-900 dark:text-neutral-100">
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        <Link href="/home/publisher">
          <SidebarItem
            icon={<Home className="w-5 h-5 mr-3" />} 
            label="Home" 
            isActive={pathname === "/home/publisher"}
          />
        </Link>
        <div>
          <div
            className="flex items-center px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-md cursor-pointer"
            onClick={() => setIsLibraryOpen(!isLibraryOpen)}
          >
            {isLibraryOpen ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
            <Library className="w-5 h-5 mr-3" />
            My Library
          </div>
          {isLibraryOpen && (
            <div className="ml-6 space-y-1">
              <Link href="/home/publisher/publications">
                <SidebarItem 
                  icon={<FileText className="w-4 h-4 mr-3" />} 
                  label="Publications" 
                  isActive={pathname === "/home/publisher/publications"}
                />
              </Link>
              <Link href="/home/publisher/articles">
                <SidebarItem 
                  icon={<FileText className="w-4 h-4 mr-3" />} 
                  label="Articles" 
                  isActive={pathname === "/home/publisher/articles"}
                />
              </Link>
            </div>
          )}
        </div>
        <Link href="/home/publisher/social-posts">
          <SidebarItem 
            icon={<Users className="w-5 h-5 mr-3" />} 
            label="Social Posts" 
            isActive={pathname === "/home/publisher/social-posts"}
          />
        </Link>
        <Link href="/home/publisher/statistics">
          <SidebarItem 
            icon={<BarChart3 className="w-5 h-5 mr-3" />} 
            label="Statistics" 
            isActive={pathname === "/home/publisher/statistics"}
          />
        </Link>
        <div className="flex items-center px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-md cursor-pointer">
          <HelpCircle className="w-5 h-5 mr-3" />
          <span>Help Center</span>
          <ExternalLink className="w-4 h-4 ml-auto" />
        </div>
      </nav>
      <div className={`p-4 ${isLoggedIn ? "block" : "hidden"}`}>
        <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
          Current plan: <span className="text-neutral-800 dark:text-neutral-100">Basic</span>
        </div>
      </div>
    </aside>
  )
}

function SidebarItem({ 
  icon, 
  label, 
  isActive = false 
}: { 
  icon: React.ReactNode; 
  label: string; 
  isActive?: boolean;
}) {
  return (
    <div className={`
      flex items-center px-3 py-2 rounded-md cursor-pointer
      ${isActive 
        ? "bg-neutral-300 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100" 
        : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700"
      }
    `}>
      {icon}
      {label}
    </div>
  )
} 