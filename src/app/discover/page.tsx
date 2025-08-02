"use client"
import { OtherUsersPublications, SearchBox } from '@/components';
import { Search, Sparkles, Users, BookOpen, TrendingUp } from 'lucide-react';

export default function PublicLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden py-10 px-2">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-glass border border-primary/20 mb-8 animate-fade-in shadow-soft">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">Explore Amazing Content</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slide-up">
            <span className="text-gradient-hero">Discover</span>
            <br />
            <span className="text-foreground">Publications</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Explore amazing publications from our community. Find creators and content that inspire you.
          </p>
          
          {/* Enhanced Search Box */}
          <div className="max-w-2xl mx-auto mb-12 animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <div className="relative">
              <SearchBox 
                placeholder="Search for users and publications..."
                className="w-full"
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="group text-center p-4 rounded-2xl bg-gradient-card border border-border/50 hover:scale-105 card-hover">
              <div className="text-2xl font-bold text-gradient mb-1 group-hover:animate-bounce">1.2K+</div>
              <div className="text-xs text-muted-foreground font-medium">Publications</div>
            </div>
            <div className="group text-center p-4 rounded-2xl bg-gradient-card border border-border/50 hover:scale-105 card-hover">
              <div className="text-2xl font-bold text-gradient mb-1 group-hover:animate-bounce">500+</div>
              <div className="text-xs text-muted-foreground font-medium">Creators</div>
            </div>
            <div className="group text-center p-4 rounded-2xl bg-gradient-card border border-border/50 hover:scale-105 card-hover">
              <div className="text-2xl font-bold text-gradient mb-1 group-hover:animate-bounce">50K+</div>
              <div className="text-xs text-muted-foreground font-medium">Views</div>
            </div>
          </div>
        </div>
        
        {/* Publications Grid */}
        <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <OtherUsersPublications
            maxPublicationsPerUser={4}
            showUserInfo={true}
          />
        </div>
      </div>
    </div>
  );
}
