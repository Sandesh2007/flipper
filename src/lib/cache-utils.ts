// Cache utilities for managing application caches

export function clearAllCaches() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('flippress_user');
  }
  
  console.log('Caches cleared. Some caches will be cleared on page refresh.');
}

// Clear specific cache by key
export function clearCacheByKey(key: string) {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}

// Get cache info for debugging
export function getCacheInfo() {
  if (typeof window === 'undefined') return null;
  
  const cacheInfo: Record<string, any> = {};
  
  const userCache = localStorage.getItem('flippress_user');
  if (userCache) {
    try {
      const parsed = JSON.parse(userCache);
      cacheInfo.user = {
        hasData: !!parsed.user,
        timestamp: parsed.ts,
        age: parsed.ts ? Date.now() - parsed.ts : 0
      };
    } catch (e) {
      cacheInfo.user = { error: 'Invalid cache data' };
    }
  }
  
  return cacheInfo;
}
