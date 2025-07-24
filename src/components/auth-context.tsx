"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { User } from "@/lib/user";
import { createClient } from "@/utils/supabase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_CACHE_KEY = "nekopress_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  // Load user from cache on mount
  useEffect(() => {
    const cached = localStorage.getItem(USER_CACHE_KEY);
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {}
    }
  }, []);

  // Cache user whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_CACHE_KEY);
    }
  }, [user]);

  const refreshUser = async () => {
    setLoading(true);
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const { id, email, user_metadata, created_at } = data.user;
      setUser({
        id,
        email: email ?? "",
        username: user_metadata?.username,
        // avatar_url: user_metadata?.avatar_url,
        created_at: created_at,
      });
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshUser();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const { id, email, user_metadata, created_at } = session.user;
        setUser({
          id,
          email: email ?? "",
          username: user_metadata?.username,
          // avatar_url: user_metadata?.avatar_url,
          created_at: created_at,
        });
      } else {
        setUser(null);
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 