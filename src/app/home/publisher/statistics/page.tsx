"use client"
import { Card, CardContent } from "@/components/ui/card"

export default function StatisticsPage() {
  return (
    <div className="p-3 sm:p-6 lg:p-8">
      <section className="bg-neutral-200 dark:bg-neutral-800 rounded-lg p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Statistics</h1>
        <p className="text-neutral-600 dark:text-neutral-300 mb-4">
          View your content performance and analytics.
        </p>
      </section>

      <section>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">0</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Publications</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">0</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Articles</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">0</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Social Posts</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">0</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Views</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
} 