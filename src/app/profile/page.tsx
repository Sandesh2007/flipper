'use client'
import EditProfile from "@/components/edit-profile";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Heart,
  MessageCircle,
  Share,
  Pencil,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { CurrentUserAvatar } from "@/components/current-user-avatar";
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UserProfile() {
  const { user } = useAuth();
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editThumb, setEditThumb] = useState<File | null>(null);
  const [editThumbUrl, setEditThumbUrl] = useState('');
  const editThumbInputRef = useRef<HTMLInputElement>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchPublications = async () => {
      if (!user) return;
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase.from('publications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (!error && data) setPublications(data);
      setLoading(false);
    };
    fetchPublications();
  }, [user]);

  const startEdit = (pub: any) => {
    setEditingId(pub.id);
    setEditTitle(pub.title);
    setEditDescription(pub.description);
    setEditThumbUrl(pub.thumb_url || '');
    setEditThumb(null);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
    setEditThumb(null);
    setEditThumbUrl('');
  };
  const handleEditSave = async (pub: any) => {
    setActionLoading(true);
    let thumbUrl = editThumbUrl;
    if (editThumb) {
      const supabase = createClient();
      const thumbPath = `thumbs/${Date.now()}_${editThumb.name}`;
      const { error: uploadError } = await supabase.storage.from('publications').upload(thumbPath, editThumb);
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('publications').getPublicUrl(thumbPath);
        thumbUrl = urlData.publicUrl;
      }
    }
    const supabase = createClient();
    const { error } = await supabase.from('publications').update({ title: editTitle, description: editDescription, thumb_url: thumbUrl }).eq('id', pub.id);
    if (!error) {
      setPublications((prev) => prev.map((p) => p.id === pub.id ? { ...p, title: editTitle, description: editDescription, thumb_url: thumbUrl } : p));
      cancelEdit();
    }
    setActionLoading(false);
  };
  const handleDelete = async (pub: any) => {
    if (!window.confirm('Are you sure you want to delete this publication?')) return;
    setActionLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from('publications').delete().eq('id', pub.id);
    if (!error) {
      setPublications((prev) => prev.filter((p) => p.id !== pub.id));
    }
    setActionLoading(false);
  };

  return (
    <>
      {user && (
        <div className="min-h-screen bg-background">
          {/* Minimal Header */}
          <div className="border-b border-border/50">
            <div className="max-w-2xl mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <CurrentUserAvatar/>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{user.username || user.email}</h1>
                    <p className="text-muted-foreground">{user.bio}</p>
                    <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                      {user.location && (
                        <>
                          <MapPin className="h-3 w-3" />
                          {user.location}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <EditProfile />
              </div>
            </div>
          </div>

          {/* Publications Section */}
          <div className="max-w-2xl mx-auto px-4 py-8">
            <h2 className="text-xl font-bold mb-4 text-foreground">My Publications</h2>
            {loading ? (
              <div className="text-muted-foreground">Loading...</div>
            ) : publications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="text-muted-foreground">No publications yet.</div>
                <Link href="/home/create">
                  <Button>Create Publication</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {publications.map((pub) => (
                  <Card key={pub.id} className="shadow-soft hover:shadow-medium transition-shadow">
                    <CardContent className="p-6 flex gap-4 items-center">
                      {editingId === pub.id ? (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            ref={editThumbInputRef}
                            className="hidden"
                            onChange={e => setEditThumb(e.target.files?.[0] || null)}
                          />
                          <div className="w-20 h-28 flex items-center justify-center bg-muted text-muted-foreground rounded border border-border cursor-pointer mr-2" onClick={() => editThumbInputRef.current?.click()}>
                            {editThumb ? <img src={URL.createObjectURL(editThumb)} alt="New Thumb" className="w-20 h-28 object-cover rounded" /> : (editThumbUrl ? <img src={editThumbUrl} alt="Thumb" className="w-20 h-28 object-cover rounded" /> : 'No Image')}
                          </div>
                          <div className="flex-1">
                            <input className="font-semibold text-lg text-foreground bg-muted border border-border rounded px-2 py-1 mb-2 w-full" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                            <textarea className="text-muted-foreground text-sm mb-2 bg-muted border border-border rounded px-2 py-1 w-full" value={editDescription} onChange={e => setEditDescription(e.target.value)} />
                            <a href={pub.pdf_url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">View PDF</a>
                            <div className="text-xs text-muted-foreground mt-1">{new Date(pub.created_at).toLocaleString()}</div>
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditSave(pub)} disabled={actionLoading}><Save className="mr-1" />Save</Button>
                              <Button size="sm" variant="secondary" onClick={cancelEdit} disabled={actionLoading}><X className="mr-1" />Cancel</Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
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
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="outline" onClick={() => startEdit(pub)}><Pencil className="mr-1" />Edit</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDelete(pub)} disabled={actionLoading}><Trash2 className="mr-1" />Delete</Button>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
