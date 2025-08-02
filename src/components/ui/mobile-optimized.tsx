import React from "react";
import { motion, MotionProps, useReducedMotion } from "framer-motion";

interface MobileOptimizedMotionProps extends MotionProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<any>;
  reducedMotionFallback?: boolean;
}

export function MobileOptimizedMotion({ 
  children, 
  fallback: Fallback, 
  reducedMotionFallback = true,
  ...motionProps 
}: MobileOptimizedMotionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // If user prefers reduced motion or on mobile and fallback is enabled
  if (shouldReduceMotion || (isMobile && reducedMotionFallback)) {
    if (Fallback) {
      return <Fallback {...motionProps}>{children}</Fallback>;
    }
    
    // Return a simple div with reduced animations
    const { animate, initial, whileHover, whileTap, ...restProps } = motionProps;
    return (
      <motion.div
        {...restProps}
        initial={false}
        animate={false}
        whileHover={false}
        whileTap={isMobile ? { scale: 0.98 } : false}
        transition={{ duration: 0.1 }}
      >
        {children}
      </motion.div>
    );
  }

  // Mobile-optimized animations (faster, less complex)
  if (isMobile) {
    const mobileProps = {
      ...motionProps,
      transition: {
        duration: 0.2,
        ease: "easeOut",
        ...motionProps.transition
      }
    };

    return <motion.div {...mobileProps}>{children}</motion.div>;
  }

  // Full desktop animations
  return <motion.div {...motionProps}>{children}</motion.div>;
}

// Hook for mobile-aware animations
export function useMobileAnimations() {
  const [isMobile, setIsMobile] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getAnimationConfig = React.useCallback((config: {
    desktop?: any;
    mobile?: any;
    reduced?: any;
  }) => {
    if (shouldReduceMotion && config.reduced) {
      return config.reduced;
    }
    if (isMobile && config.mobile) {
      return config.mobile;
    }
    return config.desktop || {};
  }, [isMobile, shouldReduceMotion]);

  return {
    isMobile,
    shouldReduceMotion,
    getAnimationConfig
  };
}

// Responsive animation variants
export const responsiveVariants = {
  // Card hover effects
  cardHover: {
    desktop: {
      hover: {
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2 }
      }
    },
    mobile: {
      hover: {
        scale: 1.01,
        transition: { duration: 0.1 }
      }
    },
    reduced: {
      hover: {}
    }
  },

  // Button press effects
  buttonPress: {
    desktop: {
      tap: { scale: 0.95 },
      hover: { scale: 1.05 }
    },
    mobile: {
      tap: { scale: 0.98 },
      hover: {}
    },
    reduced: {
      tap: {},
      hover: {}
    }
  },

  // Page transitions
  pageTransition: {
    desktop: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.4 }
    },
    mobile: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 }
    },
    reduced: {
      initial: {},
      animate: {},
      exit: {},
      transition: { duration: 0 }
    }
  },

  // Stagger children
  staggerContainer: {
    desktop: {
      visible: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.2
        }
      }
    },
    mobile: {
      visible: {
        transition: {
          staggerChildren: 0.05,
          delayChildren: 0.1
        }
      }
    },
    reduced: {
      visible: {
        transition: {
          staggerChildren: 0,
          delayChildren: 0
        }
      }
    }
  }
};

// Touch-friendly button component
interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export function TouchButton({ 
  children, 
  className = "", 
  variant = "default",
  size = "md",
  ...props 
}: TouchButtonProps) {
  const { getAnimationConfig } = useMobileAnimations();

  const animations = getAnimationConfig({
    desktop: {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 }
    },
    mobile: {
      whileTap: { scale: 0.95 }
    },
    reduced: {}
  });

  const sizeClasses = {
    sm: "px-3 py-2 text-sm min-h-[44px]", // 44px minimum for touch targets
    md: "px-4 py-3 text-base min-h-[48px]",
    lg: "px-6 py-4 text-lg min-h-[52px]"
  };

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline: "border border-input bg-background hover:bg-accent"
  };

  return (
    <MobileOptimizedMotion
      {...animations}
      transition={{ duration: 0.1 }}
    >
      <button
        className={`
          inline-flex items-center justify-center rounded-md font-medium 
          transition-colors focus-visible:outline-none focus-visible:ring-2 
          focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:pointer-events-none disabled:opacity-50
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    </MobileOptimizedMotion>
  );
}