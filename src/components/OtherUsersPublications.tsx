'use client'
import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/database/supabase/client';
import { useAuth } from '@/components/auth/auth-context';
import LikeButton from '@/components/likes-button';

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  publications: Publication[];
}

interface DatabaseUserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface Publication {
  id: string;
  user_id: string;
  title: string;
  thumb_url: string | null;
  created_at: string;
}

interface OtherUsersPublicationsProps {
  title?: string;
  description?: string;
  maxUsers?: number;
  maxPublicationsPerUser?: number;
  showUserInfo?: boolean;
  className?: string;
}

export default function OtherUsersPublications({
  title = "Community Publications",
  description = "Discover publications from other users",
  maxUsers = 10,
  maxPublicationsPerUser = 6,
  showUserInfo = true,
  className = ""
}: OtherUsersPublicationsProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const isMountedRef = useRef(true);
  const fetchControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }
    };
  }, []);

  const fetchData = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    if (fetchControllerRef.current) {
      fetchControllerRef.current.abort();
    }
    
    fetchControllerRef.current = new AbortController();
    const signal = fetchControllerRef.current.signal;

    setLoading(true);
    setError(null);
    
    try {
      const supabase = createClient();
      
      if (!isMountedRef.current || signal.aborted) return;
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id,username,avatar_url')
        .limit(maxUsers);
      
      if (profilesError) throw profilesError;
      if (!isMountedRef.current || signal.aborted) return;
      
      if (!profiles) {
        if (isMountedRef.current) {
          setUsers([]);
          setLoading(false);
        }
        return;
      }
      
      const { data: allPubs, error: pubsError } = await supabase
        .from('publications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (pubsError) throw pubsError;
      if (!isMountedRef.current || signal.aborted) return;

      // Group publications by user
      const pubsByUser: Record<string, Publication[]> = {};
      allPubs?.forEach((pub: Publication) => {
        if (!pubsByUser[pub.user_id]) pubsByUser[pub.user_id] = [];
        if (pubsByUser[pub.user_id].length < maxPublicationsPerUser) {
          pubsByUser[pub.user_id].push(pub);
        }
      });

      // Attach publications to users
      const usersWithPubs = profiles
        .map((userProfile: DatabaseUserProfile) => ({
          ...userProfile,
          publications: pubsByUser[userProfile.id] || [],
        }))
        .filter(userProfile => userProfile.publications.length > 0);
      
      if (!isMountedRef.current || signal.aborted) return;
      setUsers(usersWithPubs);
      
      if (isMountedRef.current) {
        setLoading(false);
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || !isMountedRef.current) {
        return;
      }
      
      console.error('Error fetching data:', err);
      if (isMountedRef.current) {
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    }
  }, [maxUsers, maxPublicationsPerUser]);

  useEffect(() => {
    setUsers([]);
    setError(null);
    fetchData();
  }, [fetchData]);

  const handleRetry = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className={`${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-bold mb-2">{title}</h2>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}
      
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="relative group">
              <Skeleton className="w-full h-40 rounded mb-2" />
              <Skeleton className="w-2/3 h-4 mx-auto mb-1" />
              <Skeleton className="w-1/3 h-4 mx-auto" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          {error}
          <Button className="ml-2" onClick={handleRetry}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-4">No publications found.</div>
          <p className="text-sm text-muted-foreground mb-6">
            Be the first to share your work with the community!
          </p>
          {user && (
            <Button asChild>
              <Link href="/home/create">Upload Publication</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col space-y-8">
          {users.map((userProfile) => (
            <div key={userProfile.id} className="p-4 rounded-lg border border-border bg-card shadow-sm">
              {showUserInfo && (
                <Link href={`/profile/${userProfile.username}`} className="flex items-center gap-3 mb-4 hover:underline group">
                  {userProfile.avatar_url ? (
                    <Image 
                      src={userProfile.avatar_url} 
                      alt={`${userProfile.username}'s avatar`}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover border border-border group-hover:ring-2 group-hover:ring-primary/20 transition-all" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center transition-all ${userProfile.avatar_url ? 'hidden' : ''}`}>
                    <span className="text-muted-foreground text-sm">
                      {userProfile.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-semibold text-lg text-foreground">{userProfile.username}</span>
                  <span className="text-sm text-muted-foreground">
                    ({userProfile.publications.length} publication{userProfile.publications.length !== 1 ? 's' : ''})
                  </span>
                </Link>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {userProfile.publications.map((pub: Publication) => (
                  <div key={pub.id} className="relative group">
                    <Card className="hover:shadow-lg transition h-full flex flex-col">
                      <CardContent className="p-2 flex flex-col h-full relative">
                        <Link href={`/profile/${userProfile.username}`} className="flex-1">
                          {pub.thumb_url ? (
                            <Image 
                              src={pub.thumb_url} 
                              alt={pub.title} 
                              width={300}
                              height={128}
                              className="w-full h-32 object-cover rounded mb-2 border border-border" 
                            />
                          ) : (
                            <div className="w-full h-32 flex items-center justify-center bg-muted text-muted-foreground rounded mb-2 border border-border text-xs">
                              No Preview
                            </div>
                          )}
                          <div className="text-xs text-center text-foreground line-clamp-2 px-1">
                            {pub.title}
                          </div>
                        </Link>
                        
                        <div className="absolute bottom-6 right-2 bg-neutral-900/50 rounded-full p-1 shadow-sm backdrop-blur-sm">
                          <LikeButton
                          publicationId={pub.id}
                          showText={false}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
