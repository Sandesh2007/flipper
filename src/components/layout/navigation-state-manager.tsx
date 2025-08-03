'use client'
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Global state to track navigation
let isNavigating = false;
let lastPath = '';
let navigationTimeout: NodeJS.Timeout | null = null;

export function NavigationStateManager() {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    // Only set navigating if we're actually changing paths
    if (prevPathRef.current !== pathname) {
      isNavigating = true;
      lastPath = prevPathRef.current;
      
      // Clear any existing timeout
      if (navigationTimeout) {
        clearTimeout(navigationTimeout);
      }
      
      // Set a longer timeout to allow for proper data loading
      navigationTimeout = setTimeout(() => {
        isNavigating = false;
        navigationTimeout = null;
      }, 500); // Increased from 100ms to 500ms
      
      prevPathRef.current = pathname;
      
      return () => {
        if (navigationTimeout) {
          clearTimeout(navigationTimeout);
          navigationTimeout = null;
        }
      };
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

// Utility to force clear navigation state (useful for manual navigation)
export function clearNavigationState() {
  isNavigating = false;
  if (navigationTimeout) {
    clearTimeout(navigationTimeout);
    navigationTimeout = null;
  }
} 