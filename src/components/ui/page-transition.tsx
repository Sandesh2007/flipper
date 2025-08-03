'use client'
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    
    // Short delay to show transition
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 150);
    
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div 
      className={`transition-opacity duration-150 ${
        isTransitioning ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {children}
    </div>
  );
}
