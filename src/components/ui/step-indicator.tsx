'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

const stepVariants = {
  incomplete: {
    backgroundColor: 'transparent',
    borderColor: 'hsl(var(--border))',
    color: 'hsl(var(--muted-foreground))'
  },
  active: {
    backgroundColor: 'hsl(var(--primary))',
    borderColor: 'hsl(var(--primary))',
    color: 'hsl(var(--primary-foreground))'
  },
  complete: {
    backgroundColor: 'hsl(var(--secondary))',
    borderColor: 'hsl(var(--secondary))',
    color: 'hsl(var(--secondary-foreground))'
  }
};

const lineVariants = {
  incomplete: {
    backgroundColor: 'hsl(var(--border))'
  },
  complete: {
    backgroundColor: 'hsl(var(--secondary))'
  }
};

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-between w-full", className)}>
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <motion.div
            initial="incomplete"
            animate={
              index === currentStep
                ? "active"
                : index < currentStep
                ? "complete"
                : "incomplete"
            }
            variants={stepVariants}
            className="relative flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium"
          >
            {index + 1}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: index < currentStep ? 1 : 0 }}
              className="absolute inset-0 rounded-full bg-secondary/20"
              style={{ originX: 0.5, originY: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </motion.div>
          
          {index < steps.length - 1 && (
            <motion.div
              initial="incomplete"
              animate={index < currentStep ? "complete" : "incomplete"}
              variants={lineVariants}
              className="w-full h-[2px] mx-2"
            />
          )}
          
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "absolute mt-12 text-sm whitespace-nowrap",
              index === currentStep
                ? "text-primary font-medium"
                : "text-muted-foreground"
            )}
            style={{ 
              left: `${(index / (steps.length - 1)) * 100}%`,
              transform: 'translateX(-50%)'
            }}
          >
            {step}
          </motion.span>
        </div>
      ))}
    </div>
  );
}
