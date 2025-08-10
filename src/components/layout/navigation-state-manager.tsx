'use client'
import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';

// Global state to track navigation
let isNavigating = false;
let lastPath = '';
let navigationTimeout: NodeJS.Timeout | null = null;
let pendingDataFetches = new Set<string>();

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
      // This gives components time to fetch data before clearing the state
      // This is a workaround to prevent the page from hitting loading for a long time when navigating to a new page
      navigationTimeout = setTimeout(() => {
        // Only clear if no pending data fetches
        if (pendingDataFetches.size === 0) {
          isNavigating = false;
          navigationTimeout = null;
        } else {
          // If there are pending fetches, check again in 200ms
          navigationTimeout = setTimeout(() => {
            isNavigating = false;
            navigationTimeout = null;
          }, 200);
        }
      }, 800);
      
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

// Utility to register a data fetch operation
export function registerDataFetch(id: string) {
  pendingDataFetches.add(id);
}

// Utility to unregister a data fetch operation
export function unregisterDataFetch(id: string) {
  pendingDataFetches.delete(id);
  
  // If no more pending fetches and we're still navigating, clear the state
  if (pendingDataFetches.size === 0 && isNavigating) {
    isNavigating = false;
    if (navigationTimeout) {
      clearTimeout(navigationTimeout);
      navigationTimeout = null;
    }
  }
}

// Utility to force clear navigation state (useful for manual navigation)
export function clearNavigationState() {
  isNavigating = false;
  pendingDataFetches.clear();
  if (navigationTimeout) {
    clearTimeout(navigationTimeout);
    navigationTimeout = null;
  }
} 