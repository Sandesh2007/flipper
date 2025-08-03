<<<<<<< HEAD
"use client";

import { useEffect, useState } from "react";

interface GradientBackgroundProps {
  children: React.ReactNode;
  className?: string;
  showFloatingElements?: boolean;
}

export const GradientBackground = ({ 
  children, 
  className = "",
  showFloatingElements = true 
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
      
      {/* Animated Background Elements */}
      {showFloatingElements && (
        <>
          {/* Floating Orbs */}
          <div 
            className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"
            style={{
              transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
            }}
          ></div>
          <div 
            className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"
            style={{
              animationDelay: '2s',
              transform: `translate(${-mousePosition.x * 0.005}px, ${-mousePosition.y * 0.005}px)`,
            }}
          ></div>
          <div 
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float"
            style={{
              animationDelay: '4s',
              transform: `translate(${mousePosition.x * 0.008}px, ${mousePosition.y * 0.008}px)`,
            }}
          ></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          {/* Radial Gradient Overlay */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-background/20"></div>
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10">
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
=======
'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GradientBackgroundProps {
  children: ReactNode;
  className?: string;
}

import type { Variants } from 'framer-motion';
import { cn } from '@/lib';

const backgroundVariants: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.8, ease: [0.6, 0.01, -0.05, 0.95] }
  }
};

const contentVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

export function GradientBackground({ children, className }: GradientBackgroundProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      className={cn(
        "relative min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90",
        className
      )}
    >
      <motion.div
        variants={backgroundVariants}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 0.1,
            transition: {
              duration: 1.5,
              ease: "easeOut",
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full mix-blend-multiply filter blur-[100px]"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 0.1,
            transition: {
              duration: 2,
              ease: "easeOut",
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.5
            }
          }}
          className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full mix-blend-multiply filter blur-[100px]"
        />
      </motion.div>
      <motion.div 
        variants={contentVariants} 
        className="relative z-10 w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
>>>>>>> a033050512637a461a870faa4b7a46b078568844
