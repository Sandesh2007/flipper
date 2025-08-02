'use client'
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Global state to track navigation
let isNavigating = false;
let lastPath = '';

export function NavigationStateManager() {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Only set navigating if we're actually changing paths
    if (prevPathRef.current !== pathname) {
      isNavigating = true;
      lastPath = prevPathRef.current;
      
      const timer = setTimeout(() => {
        isNavigating = false;
      }, 100);
      
      prevPathRef.current = pathname;
      
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return null;
}

// Hook to check if we're currently navigating
export function useIsNavigating() {
  return isNavigating;
}

// Hook to get the last path
export function useLastPath() {
  return lastPath;
}

// Utility to check if we should skip loading states during navigation
export function shouldSkipLoading() {
  return isNavigating;
} 