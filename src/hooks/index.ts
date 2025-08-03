import { useState, useCallback, useEffect } from 'react';

export { useCurrentUserImage } from './use-current-user-image';
export { useCurrentUserName } from './use-current-user-name';
export { useIsMobile } from './use-mobile';
export { default as useDearFlip } from './useDearFlip';

// Custom hook for data loading with retry logic
export function useDataLoader<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  options: {
    retryAttempts?: number;
    retryDelay?: number;
    cacheDuration?: number;
  } = {}
) {
  const { retryAttempts = 3, retryDelay = 1000, cacheDuration = 5 * 60 * 1000 } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);
  
  const fetchData = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    
    // Check cache if not forcing refresh
    if (!forceRefresh && data && (now - lastFetch) < cacheDuration) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn();
      setData(result);
      setLastFetch(now);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [fetchFn, data, lastFetch, cacheDuration]);
  
  useEffect(() => {
    fetchData();
  }, dependencies);
  
  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    isStale: Date.now() - lastFetch > cacheDuration
  };
}
