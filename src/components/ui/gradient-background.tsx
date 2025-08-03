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
  showMovingGradient = false // Disabled by default
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
      {/* Main Background */}
      <div className="absolute inset-0 bg-background"></div>
      
      {/* Animated Background Elements */}
      {showFloatingElements && (
        <>
          {/* Floating Orbs */}
          <div 
            className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float z-10"
            style={{
              transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            }}
          ></div>
          <div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-100/10 rounded-full blur-3xl animate-float z-10"
            style={{
              animationDelay: '2s',
              transform: `translate(${-mousePosition.x * 0.005}px, ${-mousePosition.y * 0.005}px)`,
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-float z-10"
            style={{
              animationDelay: '4s',
              transform: `translate(${mousePosition.x * 0.008}px, ${mousePosition.y * 0.008}px)`,
            }}
          ></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:50px_50px] z-10"></div>
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
      <div className="absolute inset-0 bg-blue-500/20"></div>
      <div className="absolute inset-0 bg-background/50"></div>
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
    <div className={`relative overflow-hidden rounded-2xl bg-card border border-border/50 backdrop-blur-xl ${className}`}>
      <div className="absolute inset-0 bg-blue-500/5"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
