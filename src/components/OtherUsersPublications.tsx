'use client'
import React, { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Users, BookOpen, ChevronRight } from 'lucide-react';
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
      {/* Header */}
      {(title || description) && (
        <div className="mb-8 text-center">
          {title && (
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 bg-muted rounded-lg">
                <Users className="w-6 h-6 text-muted-foreground" />
              </div>
              <h2 className="text-3xl font-bold">{title}</h2>
            </div>
          )}
          {description && <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{description}</p>}
        </div>
      )}
      
      {loading ? (
        <div className="space-y-12">
          {Array.from({ length: 3 }).map((_, userIndex) => (
            <div key={userIndex} className="space-y-6">
              {/* User Header Skeleton */}
              <div className="flex items-center gap-4 p-6 bg-card rounded-xl border">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="w-32 h-5" />
                  <Skeleton className="w-24 h-4" />
                </div>
              </div>
              {/* Publications Grid Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pl-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <Skeleton className="w-full h-40 rounded mb-3" />
                      <Skeleton className="h-4 rounded mb-2" />
                      <Skeleton className="h-3 rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-red-500">{error}</h3>
          <Button onClick={handleRetry} className="transition-all duration-200 hover:scale-105">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">No publications found</h3>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            Be the first to share your work with the community!
          </p>
          {user && (
            <Button asChild className="transition-all duration-200 hover:scale-105">
              <Link href="/home/create">Upload Your First Publication</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-12">
          {users.map((userProfile, userIndex) => (
            <div 
              key={userProfile.id} 
              className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${userIndex * 200}ms` }}
            >
              {/* User Header */}
              {showUserInfo && (
                <div className="group mb-6">
                  <Link 
                    href={`/profile/${userProfile.username}`} 
                    className="flex items-center gap-4 p-6 bg-gradient-to-r from-card to-muted/20 rounded-xl border border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="relative">
                      {userProfile.avatar_url ? (
                        <Image 
                          src={userProfile.avatar_url} 
                          alt={`${userProfile.username}'s avatar`}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover border-2 border-border group-hover:border-primary/50 transition-all duration-300" 
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-12 h-12 rounded-full bg-muted border-2 border-border group-hover:border-primary/50 flex items-center justify-center transition-all duration-300 ${userProfile.avatar_url ? 'hidden' : ''}`}>
                        <span className="text-muted-foreground font-semibold">
                          {userProfile.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                        {userProfile.username}
                      </h3>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        {userProfile.publications.length} publication{userProfile.publications.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-6 h-6 rounded-full bg-transparent flex items-center justify-center">
                        <ChevronRight className=' dark:text-white text-black' />
                      </div>
                    </div>
                  </Link>
                </div>
              )}
              
              {/* Publications Grid */}
              {userPublications(userProfile, userIndex)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const userPublications = (userProfile: UserProfile, userIndex: number) => {
    return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pl-0 sm:pl-6">
      {userProfile.publications.map((pub: Publication, pubIndex) => (
        <div
          key={pub.id}
          className="group animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${(userIndex * 200) + (pubIndex * 100)}ms` }}
        >
          <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-glow hover:-translate-y-1 hover:scale-102 bg-gradient-card border border-border/30 hover:border-border/50">
            <CardContent className="p-0 relative">
              <Link href={`/profile/${userProfile.username}`} className="block">
                {/* Image */}
                <div className="relative overflow-hidden">
                  {pub.thumb_url ? (
                    <Image
                      src={pub.thumb_url}
                      alt={pub.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted/30 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 opacity-50" />
                        </div>
                        <span className="text-sm text-muted-foreground">No Preview</span>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="font-semibold text-foreground mb-2 line-clamp-2 text-sm leading-tight group-hover:text-primary transition-colors duration-300">
                    {pub.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {new Date(pub.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>

              {/* Enhanced Like Button */}
              <div className="absolute bottom-4 right-4 duration-300 cursor-pointer">
                <div className="bg-background/80 backdrop-blur-sm rounded-full shadow-soft border border-border/50 hover:bg-background/90 transition-all duration-300">
                  <LikeButton
                    publicationId={pub.id}
                    showText={false} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>;
  }
