'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { createClient } from '@/lib/database/supabase/client';
import { useAuth } from '@/components';

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

export const PublicationsProvider = ({ children }: { children: ReactNode }) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPublications = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from('publications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setPublications(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch publications');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refreshPublications = useCallback(async () => {
    await fetchPublications();
  }, [fetchPublications]);

  const addPublication = useCallback((publication: Publication) => {
    setPublications(prev => [publication, ...prev]);
  }, []);

  const updatePublication = useCallback((id: string, updates: Partial<Publication>) => {
    setPublications(prev => 
      prev.map(pub => pub.id === id ? { ...pub, ...updates } : pub)
    );
  }, []);

  const deletePublication = useCallback((id: string) => {
    setPublications(prev => prev.filter(pub => pub.id !== id));
  }, []);

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

  // Fetch publications when user changes
  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

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