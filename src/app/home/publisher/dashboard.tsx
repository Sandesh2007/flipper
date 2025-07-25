"use client"

import { useState } from "react"
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
  Edit,
  Share,
  Eye,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import InfoDialog from "./components/dialog"
import { useAuth } from "@/components/auth-context"

export default function Dashboard() {
  const [isLibraryOpen, setIsLibraryOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("Publications")
  const tabs = ["Publications", "Articles", "Social posts"]
  const { user } = useAuth()
  const isLoggedIn = user !== null

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      {/* Sidebar - Hidden on mobile and tablet, shown on large screens */}
      <aside className="hidden lg:flex w-64 bg-neutral-200 dark:bg-neutral-800 flex-col">
        <div className="p-4">
          <Button variant="outline" className="w-full text-neutral-900 dark:text-neutral-100">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem icon={<Home className="w-5 h-5 mr-3" />} label="Home" />

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
                <SidebarItem icon={<FileText className="w-4 h-4 mr-3" />} label="Publications" />
                <SidebarItem icon={<FileText className="w-4 h-4 mr-3" />} label="Articles" />
              </div>
            )}
          </div>

          <SidebarItem icon={<Users className="w-5 h-5 mr-3" />} label="Social Posts" />
          <SidebarItem icon={<BarChart3 className="w-5 h-5 mr-3" />} label="Statistics" />

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

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-3 sm:p-6 lg:p-8">
        <section className="bg-neutral-200 dark:bg-neutral-800 rounded-lg p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
          {/* Mobile Layout - No drag & drop section */}
          <div className="block lg:hidden">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold mb-4">Add a file</h1>
              <Button className="w-full sm:w-auto bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100 border border-neutral-400 dark:border-neutral-600">
                <Upload className="w-4 h-4 mr-2" />
                Upload a file
              </Button>
              <div className="mt-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  Supported:&nbsp;
                  <Tooltip>
                    <TooltipTrigger className="underline cursor-pointer">file types</TooltipTrigger>
                    <TooltipContent className="bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white rounded-md">
                      <p>.pdf, .doc, .docx, .pptx</p>
                    </TooltipContent>
                  </Tooltip>
                </p>
              </div>
              <div className="flex justify-center mt-4">
                <InfoDialog />
              </div>
            </div>
          </div>

          {/* Desktop Layout - With drag & drop */}
          <div className="hidden lg:flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">Add a file</h1>
              <Button className="bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100 border border-neutral-400 dark:border-neutral-600">
                <Upload className="w-4 h-4 mr-2" />
                Upload a file
              </Button>
            </div>
            <div className="text-center">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">Drag & Drop</h2>
              <p className="text-neutral-600 dark:text-neutral-300">
                Upload a .pdf or other&nbsp;
                <Tooltip>
                  <TooltipTrigger className="underline cursor-pointer">file types</TooltipTrigger>
                  <TooltipContent className="bg-neutral-200 text-black dark:bg-neutral-800 dark:text-white rounded-md">
                    <p>.pdf, .doc, .docx, .pptx</p>
                  </TooltipContent>
                </Tooltip>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <InfoDialog />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Recent Work</h2>

          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 lg:mb-6">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant="outline"
                size="sm"
                className={`
                  text-xs sm:text-sm
                  ${
                    activeTab === tab
                      ? "bg-neutral-300 dark:bg-neutral-700 border-neutral-400 dark:border-neutral-600 text-neutral-800 dark:text-neutral-100"
                      : "border-neutral-400 dark:border-neutral-600 text-neutral-500 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                  }
                `}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </Button>
            ))}
          </div>

          <Card className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center w-full sm:w-auto">
                  <div className="w-10 h-12 sm:w-12 sm:h-16 bg-neutral-300 dark:bg-neutral-700 rounded mr-3 sm:mr-4 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-1">Draft</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-end">
                  <span className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mr-2">0</span>
                  <Button variant="ghost" size="sm" className="p-1.5 sm:p-2">
                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1.5 sm:p-2">
                    <Share className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1.5 sm:p-2">
                    <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1.5 sm:p-2">
                    <MoreHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}

function SidebarItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-md cursor-pointer">
      {icon}
      {label}
    </div>
  )
}
