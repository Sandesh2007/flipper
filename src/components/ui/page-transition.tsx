import React from "react";
import { motion, easeOut } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
    variant?: "fade" | "slide" | "scale" | "slideUp";
}

const variants = {
    fade: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    },
    slide: {
        initial: { x: 300, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -300, opacity: 0 }
    },
    scale: {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 1.2, opacity: 0 }
    },
    slideUp: {
        initial: { y: 50, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -50, opacity: 0 }
    }
};

export function PageTransition({
    children,
    className = "",
    variant = "slideUp"
}: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <motion.div
            key={pathname || 'page'}
            className={className}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={variants[variant]}
            transition={{
                duration: 0.4,
                ease: [0.4, 0.0, 0.2, 1]
            }}
        >
            {children}
        </motion.div>
    );
}

interface AnimatedPageProps {
    children: React.ReactNode;
    className?: string;
    staggerChildren?: boolean;
    delayChildren?: number;
}

export function AnimatedPage({
    children,
    className = "",
    staggerChildren = false,
    delayChildren = 0
}: AnimatedPageProps) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                delayChildren,
                staggerChildren: staggerChildren ? 0.1 : 0
            }
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <motion.div
            className={className}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {children}
        </motion.div>
    );
}

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
}

export function AnimatedSection({
    children,
    className = "",
    delay = 0,
    direction = "up"
}: AnimatedSectionProps) {
    const directionVariants = {
        up: { y: 30 },
        down: { y: -30 },
        left: { x: 30 },
        right: { x: -30 }
    };

    const variants = {
        hidden: {
            opacity: 0,
            ...directionVariants[direction]
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration: 0.6,
                delay,
                ease: easeOut
            }
        }
    };

    return (
        <motion.div
            className={className}
            variants={variants}
            initial="hidden"
            animate="visible"
        >
            {children}
        </motion.div>
    );
}

// Hook for page transitions with loading states
export function usePageTransition() {
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();

    const navigate = React.useCallback(async (href: string) => {
        setIsLoading(true);

        // Add a small delay to show the loading state
        await new Promise(resolve => setTimeout(resolve, 150));

        router.push(href);

        // Reset loading state after navigation
        setTimeout(() => setIsLoading(false), 300);
    }, [router]);

    return { navigate, isLoading };
}