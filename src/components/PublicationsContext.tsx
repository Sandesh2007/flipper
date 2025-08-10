'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { createClient } from '@/lib/database/supabase/client';
import { useAuth } from '@/components';
import { shouldSkipLoading, clearNavigationState, registerDataFetch, unregisterDataFetch } from '@/components/layout/navigation-state-manager';

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
  const fetchIdRef = useRef<string>('');

  const fetchPublications = useCallback(async (forceRefresh = false) => {
    if (!user) return;
    
    // Generate unique fetch ID for this operation
    const fetchId = `publications_${user.id}_${Date.now()}`;
    fetchIdRef.current = fetchId;
    
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
    
    // Register this fetch operation
    registerDataFetch(fetchId);
    
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

      if (signal.aborted) {
        unregisterDataFetch(fetchId);
        return;
      }

      if (fetchError) {
        setError(fetchError.message);
        unregisterDataFetch(fetchId);
        return;
      }

      // Check if this is still the current fetch
      if (fetchId !== fetchIdRef.current) {
        unregisterDataFetch(fetchId);
        return;
      }

      const publicationsData = data || [];
      setPublications(publicationsData);
      
      // Update cache
      publicationsCache.set(cacheKey, {
        data: publicationsData,
        timestamp: now
      });
      
      setError(null);
    } catch (err) {
      if (signal.aborted) {
        unregisterDataFetch(fetchId);
        return;
      }
      
      console.error('Error fetching publications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch publications');
    } finally {
      // Only update loading state if this is still the current fetch
      if (fetchId === fetchIdRef.current) {
        setLoading(false);
      }
      unregisterDataFetch(fetchId);
    }
  }, [user]);

  // Initialize publications on mount
  useEffect(() => {
    if (user && !isInitializedRef.current) {
      isInitializedRef.current = true;
      fetchPublications();
    }
  }, [user, fetchPublications]);

  // Refresh publications when user changes
  useEffect(() => {
    if (user) {
      fetchPublications(true);
    } else {
      setPublications([]);
      setError(null);
      setLoading(false);
    }
  }, [user, fetchPublications]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }
      // Clear navigation state when component unmounts
      clearNavigationState();
    };
  }, []);

  const refreshPublications = useCallback(async () => {
    await fetchPublications(true);
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
    setPublications(prev => prev.map(pub => 
      pub.id === id ? { ...pub, ...updates } : pub
    ));
    
    // Update cache
    if (user) {
      const cacheKey = `publications_${user.id}`;
      const cached = publicationsCache.get(cacheKey);
      if (cached) {
        const updatedData = cached.data.map(pub => 
          pub.id === id ? { ...pub, ...updates } : pub
        );
        publicationsCache.set(cacheKey, {
          data: updatedData,
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
        const filteredData = cached.data.filter(pub => pub.id !== id);
        publicationsCache.set(cacheKey, {
          data: filteredData,
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

  const getAllPublications = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching all publications:', err);
      return [];
    }
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