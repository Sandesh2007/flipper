import { useState, useEffect, useCallback, useRef } from 'react';
import { useIsNavigating } from '@/components/layout/navigation-state-manager';
import { useLoadingState } from '@/components/ui/loading-state-manager';

interface UseDataFetchingOptions<T> {
  fetchFn: () => Promise<T>;
  dependencies?: any[];
  skip?: boolean;
  cacheKey?: string;
  cacheDuration?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseDataFetchingReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  setData: (data: T) => void;
}

// Simple in-memory cache
const dataCache = new Map<string, { data: any; timestamp: number }>();

export function useDataFetching<T>({
  fetchFn,
  dependencies = [],
  skip = false,
  cacheKey,
  cacheDuration = 5 * 60 * 1000, // 5 minutes default
  onSuccess,
  onError
}: UseDataFetchingOptions<T>): UseDataFetchingReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isNavigating = useIsNavigating();
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchIdRef = useRef<string>('');
  
  // Generate unique loading state ID
  const loadingId = cacheKey || `fetch_${Date.now()}`;
  const { setMessage } = useLoadingState(loadingId, 'Loading...');

  const fetchData = useCallback(async (forceRefresh = false) => {
    if (skip) return;

    // Check cache first
    if (cacheKey && !forceRefresh) {
      const cached = dataCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < cacheDuration) {
        setData(cached.data);
        setError(null);
        return;
      }
    }

    // Cancel any ongoing fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    // Generate unique fetch ID
    const fetchId = `${loadingId}_${Date.now()}`;
    fetchIdRef.current = fetchId;

    setLoading(true);
    setError(null);
    setMessage('Loading...');

    try {
      const result = await fetchFn();

      // Check if this fetch was aborted
      if (signal.aborted || fetchId !== fetchIdRef.current) {
        return;
      }

      setData(result);
      setError(null);

      // Cache the result
      if (cacheKey) {
        dataCache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });
      }

      onSuccess?.(result);
    } catch (err) {
      // Check if this fetch was aborted
      if (signal.aborted || fetchId !== fetchIdRef.current) {
        return;
      }

      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      onError?.(error);
    } finally {
      // Only update loading state if this is still the current fetch
      if (fetchId === fetchIdRef.current) {
        setLoading(false);
        setMessage('');
      }
    }
  }, [fetchFn, skip, cacheKey, cacheDuration, onSuccess, onError, loadingId, setMessage]);

  // Initial fetch
  useEffect(() => {
    if (!skip && !isNavigating) {
      fetchData();
    }
  }, [fetchData, skip, isNavigating, ...dependencies]);

  // Refetch function
  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Skip loading during navigation if we have cached data
  useEffect(() => {
    if (isNavigating && data && !loading) {
      setLoading(false);
      setMessage('');
    }
  }, [isNavigating, data, loading, setMessage]);

  return {
    data,
    loading,
    error,
    refetch,
    setData
  };
}

// Utility to clear cache
export function clearDataCache(key?: string) {
  if (key) {
    dataCache.delete(key);
  } else {
    dataCache.clear();
  }
}

// Utility to get cached data
export function getCachedData<T>(key: string): T | null {
  const cached = dataCache.get(key);
  if (cached) {
    return cached.data;
  }
  return null;
}
