"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function PublicProfileByUsernamePage() {
  const params = useParams();
  const username = (params?.username as string)?.toLowerCase();
  const [profile, setProfile] = useState<any>(null);
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const profileUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setNotFound(false);
      const supabase = createClient();
      // Fetch user profile info by username (always lowercase)
      const { data: userData } = await supabase.from('profiles').select('*').eq('username', username).single();
      if (!userData) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setProfile(userData);
      // Fetch publications
      const { data: pubs } = await supabase.from('publications').select('*').eq('user_id', userData.id).order('created_at', { ascending: false });
      setPublications(pubs || []);
      setLoading(false);
    };
    if (username) fetchData();
  }, [username]);

  if (notFound) {
    return <div className="min-h-screen flex items-center justify-center text-2xl text-muted-foreground">User not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {profile && (
          <div className="mb-8 border-b border-border/50 pb-6">
            <div className="flex items-center gap-4 mb-2">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-border" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted border border-border" />
              )}
              <div>
                <h1 className="text-2xl font-bold text-foreground">{profile.username || 'User'}</h1>
                {profile.bio && <p className="text-muted-foreground">{profile.bio}</p>}
                {profile.location && <div className="text-sm text-muted-foreground mt-1">{profile.location}</div>}
                <Button
                  className="mt-2 cursor-pointer"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(profileUrl);
                    toast.success('Profile link copied!');
                  }}
                >
                  Copy Profile Link
                </Button>
              </div>
            </div>
          </div>
        )}
        <h2 className="text-xl font-bold mb-4 text-foreground">Publications</h2>
        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : publications.length === 0 ? (
          <div className="text-muted-foreground">No publications yet.</div>
        ) : (
          <div className="space-y-6">
            {publications.map((pub) => (
              <Card key={pub.id} className="shadow-soft hover:shadow-medium transition-shadow">
                <CardContent className="p-6 flex gap-4 items-center">
                  {pub.thumb_url ? (
                    <img src={pub.thumb_url} alt="Thumbnail" className="w-20 h-28 object-cover rounded border border-border" />
                  ) : (
                    <div className="w-20 h-28 flex items-center justify-center bg-muted text-muted-foreground rounded border border-border">No Image</div>
                  )}
                  <div className="flex-1">
                    <div className="font-semibold text-lg text-foreground">{pub.title}</div>
                    <div className="text-muted-foreground text-sm mb-2">{pub.description}</div>
                    <a href={pub.pdf_url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">View PDF</a>
                    <div className="text-xs text-muted-foreground mt-1">{new Date(pub.created_at).toLocaleString()}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
