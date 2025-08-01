'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/database/supabase/client';
import { useAuth } from '@/components/auth/auth-context';

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

interface LikeRow {
  publication_id: string;
  user_id: string;
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
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const supabase = createClient();
        
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id,username,avatar_url')
          .limit(maxUsers);
        
        if (!profiles) {
          setUsers([]);
          setLoading(false);
          return;
        }
        
        const { data: allPubs } = await supabase
          .from('publications')
          .select('*')
          .order('created_at', { ascending: false });
        
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
          .filter(userProfile => userProfile.publications.length > 0); // Only show users with publications
        
        setUsers(usersWithPubs);

        // Gather all publication ids
        const pubIds = allPubs?.map((p: Publication) => p.id) || [];
        if (pubIds.length > 0) {
          // Fetch all likes for these publications
          const { data: allLikes } = await supabase
            .from('publication_likes')
            .select('publication_id, user_id')
            .in('publication_id', pubIds);

          // Count likes per publication
          const likeMap: Record<string, number> = {};
          allLikes?.forEach((row: LikeRow) => {
            likeMap[row.publication_id] = (likeMap[row.publication_id] || 0) + 1;
          });
          setLikes(likeMap);
          
          // Only fetch user likes if user is logged in
          if (user) {
            const userLikeMap: Record<string, boolean> = {};
            allLikes?.forEach((row: LikeRow) => {
              if (row.user_id === user.id) {
                userLikeMap[row.publication_id] = true;
              }
            });
            setUserLikes(userLikeMap);
          } else {
            setUserLikes({});
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };
    fetchData();
  }, [user, maxUsers, maxPublicationsPerUser]);

  const handleLike = async (pubId: string) => {
    if (!user) return;
    const supabase = createClient();

    setUserLikes((prev) => ({ ...prev, [pubId]: true }));
    setLikes((prev) => ({ ...prev, [pubId]: (prev[pubId] || 0) + 1 }));
    
    try {
      await supabase.from('publication_likes').insert({ publication_id: pubId, user_id: user.id });
    } catch (err) {
      console.error('Error liking publication:', err);
      // Revert on error
      setUserLikes((prev) => ({ ...prev, [pubId]: false }));
      setLikes((prev) => ({ ...prev, [pubId]: Math.max((prev[pubId] || 1) - 1, 0) }));
    }
  };
  
  const handleUnlike = async (pubId: string) => {
    if (!user) return;
    const supabase = createClient();
    setUserLikes((prev) => ({ ...prev, [pubId]: false }));
    setLikes((prev) => ({ ...prev, [pubId]: Math.max((prev[pubId] || 1) - 1, 0) }));
    
    try {
      await supabase.from('publication_likes').delete().eq('publication_id', pubId).eq('user_id', user.id);
    } catch (err) {
      console.error('Error unliking publication:', err);
      // Revert on error
      setUserLikes((prev) => ({ ...prev, [pubId]: true }));
      setLikes((prev) => ({ ...prev, [pubId]: (prev[pubId] || 0) + 1 }));
    }
  };

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
          <Button className="ml-2" onClick={() => window.location.reload()}>
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
                {userProfile.publications.map((pub: Publication) => {
                  const isUploader = user && user.id === pub.user_id;
                  const liked = userLikes[pub.id] || false;
                  const likeCount = likes[pub.id] || 0;
                  return (
                    <div key={pub.id} className="relative group">
                      <Link href={`/profile/${userProfile.username}`}>
                        <Card className="hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                          <CardContent className="p-2 flex flex-col items-center justify-center h-full">
                            {pub.thumb_url ? (
                              <Image 
                                src={pub.thumb_url} 
                                alt={pub.title} 
                                width={300}
                                height={128}
                                className="w-full h-32 object-cover rounded mb-2 border border-border" 
                              />
                            ) : (
                              <div className="w-full h-32 flex items-center justify-center bg-muted text-muted-foreground rounded mb-2 border border-border text-xs">No Preview</div>
                            )}
                            <div className="text-xs text-center text-foreground line-clamp-2">{pub.title}</div>
                          </CardContent>
                        </Card>
                      </Link>
                      <div className="absolute top-2 right-2 flex items-center gap-1 z-10 rounded px-1 py-0.5">
                        <span className="text-xs text-foreground font-medium">{likeCount}</span>
                        {user ? (
                          !isUploader && (
                            liked ? (
                              <Button size="icon" variant="ghost" className="h-6 w-6 cursor-pointer" onClick={() => handleUnlike(pub.id)} aria-label="Unlike">
                                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                              </Button>
                            ) : (
                              <Button size="icon" variant="ghost" className="h-6 w-6 cursor-pointer" onClick={() => handleLike(pub.id)} aria-label="Like">
                                <Heart className="w-4 h-4" />
                              </Button>
                            )
                          )
                        ) : (
                          <Button size="icon" variant="ghost" className="h-6 w-6" disabled aria-label="Login to like publications">
                            <Heart className="w-4 h-4" />
                          </Button>
                        )}
                        {user && isUploader && (
                          <div className="h-6 w-6 flex items-center justify-center">
                            <Heart className="w-4 h-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
