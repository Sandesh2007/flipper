"use client"
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/components/auth-context';
import { Button } from '@/components/ui/button';
import { Heart, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PublicLandingPage() {
  const [users, setUsers] = useState<any[]>([]);
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
        
        // Fetch all users
        const { data: profiles } = await supabase.from('profiles').select('id,username,avatar_url');
        console.log('Profiles fetched:', profiles?.length);
        console.log('Sample profile data:', profiles?.slice(0, 3).map(p => ({ username: p.username })));
        
        if (!profiles) {
          setUsers([]);
          setLoading(false);
          return;
        }
        
        // Fetch all publications
        const { data: allPubs } = await supabase.from('publications').select('*').order('created_at', { ascending: false });
        console.log('Publications fetched:', allPubs?.length);
        
        // Group publications by user
        const pubsByUser: Record<string, any[]> = {};
        allPubs?.forEach((pub: any) => {
          if (!pubsByUser[pub.user_id]) pubsByUser[pub.user_id] = [];
          if (pubsByUser[pub.user_id].length < 6) {
            pubsByUser[pub.user_id].push(pub);
          }
        });
        
        console.log('Publications grouped by user:', Object.keys(pubsByUser).length, 'users have publications');

        // Attach publications to users
        const usersWithPubs = profiles.map((userProfile: any) => ({
          ...userProfile,
          publications: pubsByUser[userProfile.id] || [],
        }));
        
        console.log('Users with publications:', usersWithPubs.map(u => ({ username: u.username, pubCount: u.publications.length })));
        
        setUsers(usersWithPubs);

        // Gather all publication ids
        const pubIds = allPubs?.map((p: any) => p.id) || [];
        if (pubIds.length > 0) {
          
          // Fetch all likes for these publications
          const { data: allLikes } = await supabase
            .from('publication_likes')
            .select('publication_id, user_id')
            .in('publication_id', pubIds);

          console.log('Likes fetched:', allLikes?.length);

          // Count likes per publication
          const likeMap: Record<string, number> = {};
          allLikes?.forEach((row: any) => {
            likeMap[row.publication_id] = (likeMap[row.publication_id] || 0) + 1;
          });
          setLikes(likeMap);
          
          // Only fetch user likes if user is logged in
          if (user) {
            const userLikeMap: Record<string, boolean> = {};
            allLikes?.forEach((row: any) => {
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
  }, [user]);

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
    // Optimistic UI
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
    <div className="min-h-screen bg-background py-10 px-2">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Discover Publications</h1>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
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
        ) : users.every((user) => user.publications.length === 0) ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg mb-4">No publications found.</div>
            <p className="text-sm text-muted-foreground mb-6">
              Be the first to share your work with the community!
            </p>
            {user && (
              <Button asChild>
                <Link href="/upload">Upload Publication</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col space-y-10">
            {users.map((userProfile) => {
              // Only show users who have publications
              // Ofc why show users with no publications? huh? huh? why?
              if (userProfile.publications.length === 0) return null;
              
              return (
                <div key={userProfile.id} className="mb-8 p-4 rounded-lg border border-border bg-card shadow-sm">
                  <Link href={`/profile/${userProfile.username}`} className="flex items-center gap-3 mb-3 hover:underline group">
                    {userProfile.avatar_url ? (
                      <img 
                        src={userProfile.avatar_url} 
                        alt={`${userProfile.username}'s avatar`}
                        className="w-10 h-10 rounded-full object-cover border border-border group-hover:ring-2 group-hover:ring-primary/20 transition-all" 
                        onError={(e) => {
                          console.log('Avatar failed to load for:', userProfile.username, 'URL:', userProfile.avatar_url);
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center group-hover:ring-2 group-hover:ring-primary/20 transition-all ${userProfile.avatar_url ? 'hidden' : ''}`}>
                      <span className="text-muted-foreground text-sm">
                        {userProfile.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-semibold text-lg text-foreground">{userProfile.username}</span>
                    <span className="text-sm text-muted-foreground">
                      ({userProfile.publications.length} publication{userProfile.publications.length !== 1 ? 's' : ''})
                    </span>
                  </Link>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                    {userProfile.publications.map((pub: any) => {
                      const isUploader = user && user.id === pub.user_id;
                      const liked = userLikes[pub.id] || false;
                      const likeCount = likes[pub.id] || 0;
                      return (
                        <div key={pub.id} className="relative group">
                          <Link href={`/profile/${userProfile.username}`}>
                            <Card className="hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                              <CardContent className="p-2 flex flex-col items-center justify-center h-full">
                                {pub.thumb_url ? (
                                  <img src={pub.thumb_url} alt={pub.title} className="w-full h-32 object-cover rounded mb-2 border border-border" />
                                ) : (
                                  <div className="w-full h-32 flex items-center justify-center bg-muted text-muted-foreground rounded mb-2 border border-border text-xs">No Preview</div>
                                )}
                                <div className="text-xs text-center text-foreground line-clamp-2">{pub.title}</div>
                              </CardContent>
                            </Card>
                          </Link>
                          <div className="absolute top-2 right-2 flex items-center gap-1 z-10 bg-background/80 backdrop-blur-sm rounded px-1 py-0.5">
                            <span className="text-xs text-foreground font-medium">{likeCount}</span>
                            {user ? (
                              !isUploader && (
                                liked ? (
                                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleUnlike(pub.id)} aria-label="Unlike">
                                    <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                                  </Button>
                                ) : (
                                  <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleLike(pub.id)} aria-label="Like">
                                    <Heart className="w-3 h-3" />
                                  </Button>
                                )
                              )
                            ) : (
                              // Not logged in: show disabled like button
                              <Button size="icon" variant="ghost" className="h-6 w-6" disabled aria-label="Login to like publications">
                                <Heart className="w-3 h-3" />
                              </Button>
                            )}
                            {user && isUploader && (
                              <div className="h-6 w-6 flex items-center justify-center">
                                <Heart className="w-3 h-3 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
