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

export default function Dashboard() {
  const [isLibraryOpen, setIsLibraryOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("Publications")
  const tabs = ["Publications", "Articles", "Social posts"]

  return (
    <div className="flex flex-col md:flex-row h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-neutral-200 dark:bg-neutral-800 flex flex-col">
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

        <div className="p-4">
          <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            Current plan: <span className="text-neutral-800 dark:text-neutral-100">Basic</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 sm:p-8">
        <section className="bg-neutral-200 dark:bg-neutral-800 rounded-lg p-4 sm:p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
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
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Recent Work</h2>

          <div className="flex flex-wrap gap-3 mb-6">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant="outline"
                size="sm"
                className={`
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
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="w-12 h-16 bg-neutral-300 dark:bg-neutral-700 rounded mr-4 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-neutral-500" />
                  </div>
                  <div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Draft</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">0</span>
                  <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm"><Share className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button>
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
