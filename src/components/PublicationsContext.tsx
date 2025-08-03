'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { createClient } from '@/lib/database/supabase/client';
import { useAuth } from '@/components';
import { shouldSkipLoading, clearNavigationState } from '@/components/layout/navigation-state-manager';

export interface Publication {
  id: string;
  title: string;
  description: string;
  pdf_url: string;
  thumb_url: string | null;
  created_at: string;
  user_id: string;
}

export interface PublicationsContextType {
  publications: Publication[];
  loading: boolean;
  error: string | null;
  refreshPublications: () => Promise<void>;
  addPublication: (publication: Publication) => void;
  updatePublication: (id: string, updates: Partial<Publication>) => void;
  deletePublication: (id: string) => void;
  getPublicationById: (id: string) => Publication | undefined;
  getUserPublications: (userId: string) => Publication[];
  getAllPublications: () => Promise<Publication[]>;
}

const PublicationsContext = createContext<PublicationsContextType | undefined>(undefined);

// Cache for publications data
const publicationsCache = new Map<string, { data: Publication[]; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // Reduced from 5 minutes to 2 minutes for more frequent updates

export const PublicationsProvider = ({ children }: { children: ReactNode }) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const isInitializedRef = useRef(false);
  const fetchControllerRef = useRef<AbortController | null>(null);
  const lastFetchTimeRef = useRef<number>(0);

  const fetchPublications = useCallback(async (forceRefresh = false) => {
    if (!user) return;
    
    // Check if we should skip loading during navigation
    const skipLoading = shouldSkipLoading();
    
    // Skip loading if we're navigating and have cached data, but only for a short time
    if (!forceRefresh && skipLoading) {
      const cacheKey = `publications_${user.id}`;
      const cached = publicationsCache.get(cacheKey);
      if (cached) {
        setPublications(cached.data);
        setLoading(false);
        setError(null);
        return;
      }
    }
    
    // Check cache first (but with shorter duration)
    const cacheKey = `publications_${user.id}`;
    const cached = publicationsCache.get(cacheKey);
    const now = Date.now();
    
    if (!forceRefresh && cached && (now - cached.timestamp) < CACHE_DURATION) {
      setPublications(cached.data);
      setLoading(false);
      setError(null);
      return;
    }
    
    // Cancel any ongoing fetch
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }
    
    fetchControllerRef.current = new AbortController();
    const signal = fetchControllerRef.current.signal;
    
    setLoading(true);
    setError(null);
    lastFetchTimeRef.current = now;
    
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('publications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (signal.aborted) return;

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      const publicationsData = data || [];
      setPublications(publicationsData);
      
      // Update cache
      publicationsCache.set(cacheKey, { data: publicationsData, timestamp: now });
      
      // Clear navigation state after successful fetch
      clearNavigationState();
    } catch (err) {
      if (signal.aborted) return;
      setError(err instanceof Error ? err.message : 'Failed to fetch publications');
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, [user]);

  const refreshPublications = useCallback(async () => {
    await fetchPublications(true); // Force refresh
  }, [fetchPublications]);

  const addPublication = useCallback((publication: Publication) => {
    setPublications(prev => [publication, ...prev]);
    // Update cache
    if (user) {
      const cacheKey = `publications_${user.id}`;
      const cached = publicationsCache.get(cacheKey);
      if (cached) {
        publicationsCache.set(cacheKey, {
          data: [publication, ...cached.data],
          timestamp: Date.now()
        });
      }
    }
  }, [user]);

  const updatePublication = useCallback((id: string, updates: Partial<Publication>) => {
    setPublications(prev => 
      prev.map(pub => pub.id === id ? { ...pub, ...updates } : pub)
    );
    // Update cache
    if (user) {
      const cacheKey = `publications_${user.id}`;
      const cached = publicationsCache.get(cacheKey);
      if (cached) {
        publicationsCache.set(cacheKey, {
          data: cached.data.map(pub => pub.id === id ? { ...pub, ...updates } : pub),
          timestamp: Date.now()
        });
      }
    }
  }, [user]);

  const deletePublication = useCallback((id: string) => {
    setPublications(prev => prev.filter(pub => pub.id !== id));
    // Update cache
    if (user) {
      const cacheKey = `publications_${user.id}`;
      const cached = publicationsCache.get(cacheKey);
      if (cached) {
        publicationsCache.set(cacheKey, {
          data: cached.data.filter(pub => pub.id !== id),
          timestamp: Date.now()
        });
      }
    }
  }, [user]);

  const getPublicationById = useCallback((id: string) => {
    return publications.find(pub => pub.id === id);
  }, [publications]);

  const getUserPublications = useCallback((userId: string) => {
    return publications.filter(pub => pub.user_id === userId);
  }, [publications]);

  const getAllPublications = useCallback(async (): Promise<Publication[]> => {
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('publications')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      return data || [];
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to fetch all publications');
    }
  }, []);

  // Fetch publications when user changes, but only once per user
  useEffect(() => {
    if (user && !isInitializedRef.current) {
      isInitializedRef.current = true;
      fetchPublications();
    } else if (!user) {
      isInitializedRef.current = false;
      setPublications([]);
      setLoading(false);
      setError(null);
    }
  }, [user, fetchPublications]);

  // Add a periodic refresh mechanism for better data consistency
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      // Refresh data if it's been more than 5 minutes since last fetch
      if (now - lastFetchTimeRef.current > 5 * 60 * 1000) {
        fetchPublications();
      }
    }, 60 * 1000); // Check every minute
    
    return () => clearInterval(interval);
  }, [user, fetchPublications]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }
    };
  }, []);

  const value: PublicationsContextType = {
    publications,
    loading,
    error,
    refreshPublications,
    addPublication,
    updatePublication,
    deletePublication,
    getPublicationById,
    getUserPublications,
    getAllPublications,
  };

  return (
    <PublicationsContext.Provider value={value}>
      {children}
    </PublicationsContext.Provider>
  );
};

export const usePublications = () => {
  const context = useContext(PublicationsContext);
  if (context === undefined) {
    throw new Error('usePublications must be used within a PublicationsProvider');
  }
  return context;
}; 