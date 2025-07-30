"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import type { User } from "@/lib/user";
import { createBrowserClient } from "@/lib/database";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_CACHE_KEY = "nekopress_user";
const USER_CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour

// Helper to get cached user with expiry check
function getCachedUser(): User | null {
  const cached = localStorage.getItem(USER_CACHE_KEY);
  if (!cached) return null;
  try {
    const { user, ts } = JSON.parse(cached);
    if (!user || !ts) return null;
    if (Date.now() - ts > USER_CACHE_EXPIRY) {
      localStorage.removeItem(USER_CACHE_KEY);
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

// Helper to set cached user with timestamp
function setCachedUser(user: User | null) {
  if (user) {
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify({ user, ts: Date.now() }));
  } else {
    localStorage.removeItem(USER_CACHE_KEY);
  }
}

// Helper to check if username is valid
function isUsernameValid(username: string | undefined): boolean {
  return !!(
    username &&
    username === username.toLowerCase() &&
    !username.includes(' ') &&
    /^[a-z0-9_]+$/.test(username)
  );
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();
  const router = useRouter();

  // Load user from cache on mount (with expiry)
  useEffect(() => {
    const cachedUser = getCachedUser();
    if (cachedUser) {
      setUser(cachedUser);
    }
  }, []);

  // Cache user whenever it changes
  useEffect(() => {
    setCachedUser(user);
  }, [user]);

  // Multi-tab sync: listen for storage changes
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === USER_CACHE_KEY) {
        const cachedUser = getCachedUser();
        setUser(cachedUser);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      const { id, email, user_metadata, created_at } = authData.user;
      
      // Fetch profile from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching profile:', error);
        toast.error('Failed to load user profile');
        setUser(null);
        setLoading(false);
        return;
      }

      // Create user object prioritizing database profile over metadata
      const newUser = {
        id,
        email: email ?? '',
        username: profile?.username || (user_metadata?.username ? user_metadata.username.replace(/\s+/g, '') : null), // Remove spaces from Google username
        avatar_url: profile?.avatar_url || user_metadata?.avatar_url,
        bio: profile?.bio || user_metadata?.bio,
        location: profile?.location || user_metadata?.location,
        created_at: created_at,
      };

      setUser(newUser);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    refreshUser();
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { id, email, user_metadata, created_at } = session.user;
        
        // Fetch profile from database immediately after auth state change
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile on auth change:', error);
        }

        // Create user object prioritizing database profile
        const newUser = {
          id,
          email: email ?? "",
          username: profile?.username || (user_metadata?.username ? user_metadata.username.replace(/\s+/g, '') : null), // Remove spaces from Google username
          avatar_url: profile?.avatar_url || user_metadata?.avatar_url,
          bio: profile?.bio || user_metadata?.bio,
          location: profile?.location || user_metadata?.location,
          created_at: created_at,
        };

        setUser(newUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [refreshUser, supabase]);

  useEffect(() => {
    if (!loading && user) {
      // Check if user has a valid username in the database
      const hasValidUsername = isUsernameValid(user.username);
      
      if (!hasValidUsername && typeof window !== 'undefined' && window.location.pathname !== '/set-username') {
        // Add a small delay to prevent race conditions
        const timeoutId = setTimeout(() => {
          // Double-check the pathname in case user navigated away
          if (window.location.pathname !== '/set-username') {
            router.replace('/set-username');
          }
        }, 100);
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [user, loading, router]);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export setUser for optimistic UI updates
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 