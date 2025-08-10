'use client'
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useIsNavigating } from '@/components/layout/navigation-state-manager';

interface LoadingState {
  id: string;
  isLoading: boolean;
  message?: string;
}

interface LoadingContextType {
  registerLoading: (id: string, message?: string) => void;
  unregisterLoading: (id: string) => void;
  setLoadingMessage: (id: string, message: string) => void;
  isLoading: boolean;
  loadingStates: LoadingState[];
  globalLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingStateManager({ children }: { children: ReactNode }) {
  const [loadingStates, setLoadingStates] = useState<LoadingState[]>([]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const pathname = usePathname();
  const isNavigating = useIsNavigating();

  // Update global loading state based on individual loading states
  useEffect(() => {
    const hasLoading = loadingStates.some(state => state.isLoading);
    setGlobalLoading(hasLoading || isNavigating);
  }, [loadingStates, isNavigating]);

  // Clear loading states on navigation
  useEffect(() => {
    if (isNavigating) {
      // Don't clear immediately, give components time to register their loading states
      const timer = setTimeout(() => {
        setLoadingStates(prev => prev.filter(state => state.isLoading));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname, isNavigating]);

  const registerLoading = useCallback((id: string, message?: string) => {
    setLoadingStates(prev => {
      const existing = prev.find(state => state.id === id);
      if (existing) {
        return prev.map(state => 
          state.id === id 
            ? { ...state, isLoading: true, message: message || state.message }
            : state
        );
      }
      return [...prev, { id, isLoading: true, message }];
    });
  }, []);

  const unregisterLoading = useCallback((id: string) => {
    setLoadingStates(prev => prev.filter(state => state.id !== id));
  }, []);

  const setLoadingMessage = useCallback((id: string, message: string) => {
    setLoadingStates(prev => prev.map(state => 
      state.id === id ? { ...state, message } : state
    ));
  }, []);

  const value: LoadingContextType = {
    registerLoading,
    unregisterLoading,
    setLoadingMessage,
    isLoading: globalLoading,
    loadingStates,
    globalLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoadingState(id: string, message?: string) {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoadingState must be used within LoadingStateManager');
  }

  const { registerLoading, unregisterLoading, setLoadingMessage } = context;

  useEffect(() => {
    registerLoading(id, message);
    return () => unregisterLoading(id);
  }, [id, message, registerLoading, unregisterLoading]);

  const setMessage = useCallback((msg: string) => {
    setLoadingMessage(id, msg);
  }, [id, setLoadingMessage]);

  return { setMessage };
}

export function useGlobalLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within LoadingStateManager');
  }
  return context.globalLoading;
}
