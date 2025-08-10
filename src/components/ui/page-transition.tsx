'use client'
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useIsNavigating } from '@/components/layout/navigation-state-manager';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isNavigating = useIsNavigating();

  useEffect(() => {
    // Only show transition if we're actually navigating
    if (isNavigating) {
      setIsTransitioning(true);
      
      // Longer delay to allow for data loading
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300); // Increased from 150ms to 300ms
      
      return () => clearTimeout(timer);
    } else {
      setIsTransitioning(false);
    }
  }, [pathname, isNavigating]);

  return (
    <div 
      className={`transition-opacity duration-300 ${
        isTransitioning ? 'opacity-70' : 'opacity-100'
      }`}
    >
      {children}
    </div>
  );
}
