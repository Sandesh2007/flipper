"use client";

import { useEffect, useState } from "react";

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
  showFloatingElements?: boolean;
  showMovingGradient?: boolean;
}

export const GradientBackground = ({ 
  children, 
  className = "",
  showFloatingElements = true,
  showMovingGradient = true
}: GradientBackgroundProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Main Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5"></div>
      
      {/* Moving Animated Gradient - Behind everything */}
      {showMovingGradient && (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-gradient-move"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/3 to-transparent animate-gradient-move-reverse"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/3 to-transparent animate-gradient-move-slow"></div>
        </div>
      )}
      
      {/* Animated Background Elements */}
      {showFloatingElements && (
        <>
          {/* Floating Orbs */}
          <div 
            className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float z-10"
            style={{
              transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            }}
          ></div>
          <div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float z-10"
            style={{
              animationDelay: '2s',
              transform: `translate(${-mousePosition.x * 0.005}px, ${-mousePosition.y * 0.005}px)`,
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float z-10"
            style={{
              animationDelay: '4s',
              transform: `translate(${mousePosition.x * 0.008}px, ${mousePosition.y * 0.008}px)`,
            }}
          ></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] z-10"></div>
          
          {/* Radial Gradient Overlay */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-background/20 z-10"></div>
        </>
      )}
      
      {/* Content - Above all background elements */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};

export const AnimatedGradient = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 animate-gradient"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
    </div>
  );
};

export const GlassCard = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-glass border border-border/50 backdrop-blur-xl ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
