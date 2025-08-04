"use client";

import { ConversionInfo } from "@/components/sections/conversion-info";
import { FileUpload } from "@/components/sections/file-upload";
import { SupportedFormats } from "@/components/sections/supported-section";
import { Testimonials } from "@/components/features/testimonials";
import { useAuth } from "@/components/auth/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sparkles, BookOpen, Zap, Users, Star, ArrowRight, CheckCircle, Shield, Globe } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/home/publisher");
    }
  }, [user, loading, router]);

  if (!loading && user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mb-4"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-primary/30"></div>
        </div>
        <p className="text-muted-foreground animate-pulse-slow">Redirecting to your dashboard<span className="loading-dots"></span></p>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="relative max-w-7xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-glass border border-primary/20 mb-8 animate-fade-in shadow-soft">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">Transform your PDFs into interactive experiences</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-slide-up leading-tight">
            <span className="text-gradient-hero">Transform PDFs</span>
            <br />
            <span className="text-foreground">into Interactive</span>
            <br />
            <span className="text-gradient-hero">Flipbooks</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Upload your PDF documents and convert them into beautiful, interactive flipbooks that engage your audience with stunning animations and modern design.
          </p>
          
          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="group text-center p-6 rounded-2xl bg-gradient-card border border-border/50 hover:scale-105 card-hover">
              <div className="text-4xl font-bold text-gradient mb-2 group-hover:animate-bounce">10K+</div>
              <div className="text-sm text-muted-foreground font-medium">Happy Users</div>
            </div>
            <div className="group text-center p-6 rounded-2xl bg-gradient-card border border-border/50 hover:scale-105 card-hover">
              <div className="text-4xl font-bold text-gradient mb-2 group-hover:animate-bounce">50K+</div>
              <div className="text-sm text-muted-foreground font-medium">PDFs Converted</div>
            </div>
            <div className="group text-center p-6 rounded-2xl bg-gradient-card border border-border/50 hover:scale-105 card-hover">
              <div className="text-4xl font-bold text-gradient mb-2 group-hover:animate-bounce">99.9%</div>
              <div className="text-sm text-muted-foreground font-medium">Uptime</div>
            </div>
            <div className="group text-center p-6 rounded-2xl bg-gradient-card border border-border/50 hover:scale-105 card-hover">
              <div className="text-4xl font-bold text-gradient mb-2 group-hover:animate-bounce">24/7</div>
              <div className="text-sm text-muted-foreground font-medium">Support</div>
            </div>
          </div>
        </div>
        
        {/* Upload files section */}
        <div className="animate-scale-in" style={{ animationDelay: '0.6s' }}>
          <FileUpload />
        </div>
      </section>
      
      {/* Enhanced Features Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent to-muted/20 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-glass border border-primary/20 mb-8">
              <Star className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Why Choose Flipper?</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gradient-hero">
              Experience the Future of
              <br />
              Digital Publishing
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our cutting-edge features transform static documents into engaging interactive experiences
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-3xl bg-gradient-card border border-border/50 hover:scale-105 card-hover shadow-soft hover:shadow-glow transition-all duration-500">
              <div className="w-20 h-20 rounded-2xl bg-gradient-hero flex items-center justify-center mb-6 group-hover:animate-heartbeat">
                <BookOpen className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gradient-hero">Interactive Flipbooks</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Transform static PDFs into engaging interactive experiences with page-turning animations and multimedia support.
              </p>
              <div className="mt-6 flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all duration-300">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 group-hover:animate-pulse" />
              </div>
            </div>
            
            <div className="group p-8 rounded-3xl bg-gradient-card border border-border/50 hover:scale-105 card-hover shadow-soft hover:shadow-glow transition-all duration-500">
              <div className="w-20 h-20 rounded-2xl bg-gradient-hero flex items-center justify-center mb-6 group-hover:animate-heartbeat">
                <Zap className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gradient-hero">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Convert your documents in seconds with our optimized processing engine and cloud-based infrastructure.
              </p>
              <div className="mt-6 flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all duration-300">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 group-hover:animate-pulse" />
              </div>
            </div>
            
            <div className="group p-8 rounded-3xl bg-gradient-card border border-border/50 hover:scale-105 card-hover shadow-soft hover:shadow-glow transition-all duration-500">
              <div className="w-20 h-20 rounded-2xl bg-gradient-hero flex items-center justify-center mb-6 group-hover:animate-heartbeat">
                <Users className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gradient-hero">Collaborative</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Share and collaborate on your flipbooks with team members and get real-time feedback and analytics.
              </p>
              <div className="mt-6 flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all duration-300">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 group-hover:animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Additional Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <div className="group p-6 rounded-2xl bg-gradient-card border border-border/50 hover:scale-105 card-hover">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Secure & Private</h4>
                  <p className="text-muted-foreground">Your documents are encrypted and secure</p>
                </div>
              </div>
            </div>
            
            <div className="group p-6 rounded-2xl bg-gradient-card border border-border/50 hover:scale-105 card-hover">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Global Access</h4>
                  <p className="text-muted-foreground">Access your flipbooks from anywhere</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <SupportedFormats />
      <ConversionInfo />
      <Testimonials />
    </main>
  );
}
