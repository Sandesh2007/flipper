"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';

export default function PublicLandingPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const supabase = createClient();
      // Fetch all users
      const { data: profiles } = await supabase.from('profiles').select('id,username,avatar_url');
      if (!profiles) {
        setUsers([]);
        setLoading(false);
        return;
      }
      // For each user, fetch their publications (first 6 for preview)
      const usersWithPubs = await Promise.all(
        profiles.map(async (user: any) => {
          const { data: pubs } = await supabase.from('publications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(6);
          return { ...user, publications: pubs || [] };
        })
      );
      setUsers(usersWithPubs);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background py-10 px-2">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-foreground">Discover Publications</h1>
        {loading ? (
          <div className="text-muted-foreground text-center">Loading...</div>
        ) : users.length === 0 ? (
          <div className="text-muted-foreground text-center">No users or publications found.</div>
        ) : (
          <div className="space-y-10">
            {users.map((user) => (
              <div key={user.id} className="mb-8">
                <Link href={`/profile/${user.username}`} className="flex items-center gap-3 mb-3 hover:underline">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-border" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted border border-border" />
                  )}
                  <span className="font-semibold text-lg text-foreground">{user.username}</span>
                </Link>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                  {user.publications.length === 0 ? (
                    <div className="col-span-2 sm:col-span-3 md:col-span-4 text-muted-foreground">No publications yet.</div>
                  ) : (
                    user.publications.map((pub: any) => (
                      <Link key={pub.id} href={pub.pdf_url} target="_blank" rel="noopener noreferrer">
                        <Card className="hover:shadow-lg transition cursor-pointer h-full flex flex-col">
                          <CardContent className="p-2 flex flex-col items-center justify-center h-full">
                            {pub.thumb_url ? (
                              <img src={pub.thumb_url} alt={pub.title} className="w-full h-32 object-cover rounded mb-2 border border-border" />
                            ) : (
                              <div className="w-full h-32 flex items-center justify-center bg-muted text-muted-foreground rounded mb-2 border border-border">No Image</div>
                            )}
                            <div className="text-xs text-center text-foreground line-clamp-2">{pub.title}</div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 