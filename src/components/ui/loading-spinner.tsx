import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, RefreshCw } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
  "animate-spin",
  {
    variants: {
      size: {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8",
        xl: "w-12 h-12",
      },
      variant: {
        default: "text-primary",
        muted: "text-muted-foreground",
        accent: "text-accent-foreground",
        destructive: "text-destructive",
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  text?: string;
  className?: string;
  icon?: "loader" | "refresh";
  animated?: boolean;
}

export function LoadingSpinner({ 
  size, 
  variant, 
  text, 
  className, 
  icon = "loader",
  animated = true 
}: LoadingSpinnerProps) {
  const IconComponent = icon === "refresh" ? RefreshCw : Loader2;
  
  const spinAnimation = {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  if (!animated) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <IconComponent className={cn(spinnerVariants({ size, variant }))} />
        {text && (
          <span className="text-sm text-muted-foreground">{text}</span>
        )}
      </div>
    );
  }

  return (
    <motion.div 
      className={cn("flex items-center gap-3", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        animate={spinAnimation}
        className="relative"
      >
        <IconComponent className={cn(spinnerVariants({ size, variant }))} />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-current opacity-30"
          animate={{ rotate: -360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
      <AnimatePresence>
        {text && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-muted-foreground"
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface LoadingPageProps {
  text?: string;
  className?: string;
  showProgress?: boolean;
}

export function LoadingPage({ 
  text = "Loading...", 
  className,
  showProgress = false 
}: LoadingPageProps) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!showProgress) return;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 300);

    return () => clearInterval(timer);
  }, [showProgress]);

  return (
    <motion.div
      className={cn(
        "flex min-h-screen items-center justify-center bg-background",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex flex-col items-center gap-6 text-center"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.div
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          <LoadingSpinner size="xl" text="" />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-primary/20"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-lg font-semibold">{text}</h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we prepare your content
          </p>
        </motion.div>

        {showProgress && (
          <motion.div
            className="w-64 space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

interface LoadingOverlayProps {
  text?: string;
  className?: string;
  blur?: boolean;
}

export function LoadingOverlay({ 
  text = "Loading...", 
  className,
  blur = true 
}: LoadingOverlayProps) {
  return (
    <motion.div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80",
        blur && "backdrop-blur-sm",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="flex flex-col items-center gap-4 rounded-lg bg-card p-8 shadow-lg border"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <LoadingSpinner size="lg" />
        {text && (
          <p className="text-sm text-muted-foreground text-center max-w-xs">
            {text}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}
