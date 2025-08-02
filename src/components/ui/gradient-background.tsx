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
