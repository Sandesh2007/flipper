import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean
  hoverEffect?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, animated = true, hoverEffect = true, ...props }, ref) => {
    if (!animated) {
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-xl border bg-card text-card-foreground shadow",
            className
          )}
          {...props}
        />
      )
    }

    const variants = {
      initial: { 
        opacity: 0, 
        y: 20,
        scale: 0.95
      },
      animate: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
          duration: 0.4,
          ease: "easeOut"
        }
      }
    }

    const hoverVariants = hoverEffect ? {
      hover: {
        y: -4,
        scale: 1.02,
        transition: {
          duration: 0.2,
          ease: "easeInOut"
        }
      }
    } : {}

    return (
      <motion.div
        ref={ref}
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={{ ...variants, ...hoverVariants }}
        className={cn(
          "rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow duration-300",
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
