"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Plus, BookOpen } from "lucide-react"

export default function ArticlesPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Hero Section */}
      <section className="bg-gradient-glass border border-border/20 rounded-2xl p-6 lg:p-8 mb-8 backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Articles</h1>
            <p className="text-muted-foreground text-lg">
              Manage and create your articles here.
            </p>
          </div>
        </div>
        <Button className="bg-gradient-hero hover:bg-gradient-hero/90 text-white border-0 shadow-soft hover:shadow-glow transition-all duration-300 group">
          <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
          Create New Article
        </Button>
      </section>

      {/* Articles Content */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Your Articles</h2>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        <Card className="bg-gradient-card border border-border/30 shadow-soft backdrop-blur-xl">
          <CardContent className="p-6 lg:p-8">
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-2xl bg-gradient-hero/10 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">No Articles Yet</h3>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                Start creating your first article to get started.
              </p>
              <Button 
                variant="outline" 
                className="bg-gradient-card border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group"
              >
                <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Create Your First Article
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
} 