'use client';

import { Card } from "./card";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DashboardContainerProps {
  children: ReactNode;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

export function DashboardContainer({ children, className }: DashboardContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants as any}
      className={className}
    >
      <Card className="relative overflow-hidden backdrop-blur-lg border-border/30 hover:border-primary/20 transition-all duration-300">
        <div className="absolute inset-0 bg-blue-500/5 opacity-50" />
        <div className="relative z-10 p-6">
          <motion.div variants={itemVariants as any} className="space-y-6">
            {children}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}
