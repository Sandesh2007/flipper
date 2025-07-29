"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import InfoDialog from "./dialog"

export default function DashboardMain() {
  const [activeTab, setActiveTab] = useState("Publications")
  const tabs = ["Publications", "Articles", "Social posts"]

  return (
    <main className="flex-1 overflow-auto p-3 sm:p-6 lg:p-8">
      <section className="bg-neutral-200 dark:bg-neutral-800 rounded-lg p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
        {/* Mobile Layout - No drag & drop section */}
        <div className="block lg:hidden">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold mb-4">Add a file</h1>
            <Button className="w-full sm:w-auto bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100 border border-neutral-400 dark:border-neutral-600">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
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
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12" /></svg>
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
            {activeTab === "Publications" && (
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-2">Your Publications</h3>
                <p className="text-neutral-500 dark:text-neutral-400">List of your publications will appear here.</p>
              </div>
            )}
            {activeTab === "Articles" && (
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-2">Your Articles</h3>
                <p className="text-neutral-500 dark:text-neutral-400">List of your articles will appear here.</p>
              </div>
            )}
            {activeTab === "Social posts" && (
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-2">Your Social Posts</h3>
                <p className="text-neutral-500 dark:text-neutral-400">List of your social posts will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  )
} 