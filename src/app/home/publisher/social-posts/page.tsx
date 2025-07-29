"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function SocialPostsPage() {
  return (
    <div className="p-3 sm:p-6 lg:p-8">
      <section className="bg-neutral-200 dark:bg-neutral-800 rounded-lg p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Social Posts</h1>
        <p className="text-neutral-600 dark:text-neutral-300 mb-4">
          Create and manage your social media posts here.
        </p>
        <Button className="bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100 border border-neutral-400 dark:border-neutral-600">
          Create New Post
        </Button>
      </section>

      <section>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Your Social Posts</h2>
        <Card className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-2">No Social Posts Yet</h3>
              <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                Start creating your first social post to get started.
              </p>
              <Button variant="outline">
                Create Your First Post
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
} 