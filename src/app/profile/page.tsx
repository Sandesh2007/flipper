'use client'
import EditProfile from "@/components/forms/edit-profile";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin, Heart, Pencil, Save, X, Grid3X3, List,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-context";
import { CurrentUserAvatar } from "@/components/features/current-user-avatar";
import { useEffect, useState, useRef, useMemo } from 'react';
import { createClient } from '@/lib/database/supabase/client';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { AlertDialog, usePublications } from "@/components";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface LikeRow {
  publication_id: string;
  user_id: string;
}

export default function UserProfile() {
  const { user , loading: authLoading} = useAuth();
  const { publications, loading, updatePublication } = usePublications();
  const supabase = createClient();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editThumb, setEditThumb] = useState<File | null>(null);
  const [editThumbUrl, setEditThumbUrl] = useState('');
  const editThumbInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [actionLoading, setActionLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [originalOrder, setOriginalOrder] = useState<string[]>([]);

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Save original publication order once
  useEffect(() => {
    if (publications.length > 0 && originalOrder.length === 0) {
      setOriginalOrder(publications.map((p) => p.id));
    }
  }, [publications]);

  useEffect(() => {
    const fetchLikes = async () => {
      if (!user || publications.length === 0) return;
      const supabase = createClient();
      const pubIds = publications.map((p) => p.id);

      const { data: allLikes } = await supabase
        .from('publication_likes')
        .select('publication_id, user_id')
        .in('publication_id', pubIds);

      const likeMap: Record<string, number> = {};
      allLikes?.forEach((row: LikeRow) => {
        likeMap[row.publication_id] = (likeMap[row.publication_id] || 0) + 1;
      });

      setLikes(likeMap);
    };
    fetchLikes();
  }, [user, publications]);

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

    await toast.promise((async () => {
      let thumbUrl = editThumbUrl;

      if (editThumb) {
        if (pub.thumb_url) {
          const oldThumbPath = pub.thumb_url.split('/').pop();
          if (oldThumbPath) {
            await supabase.storage.from('publications').remove([`thumbs/${oldThumbPath}`]);
          }
        }

        const thumbPath = `thumbs/${Date.now()}_${editThumb.name}`;
        const { error: uploadError, data } = await supabase.storage
          .from('publications')
          .upload(thumbPath, editThumb);

        if (uploadError) {
          throw new Error(`Failed to upload thumbnail: ${uploadError.message}`);
        }

        const { data: urlData } = supabase.storage.from('publications').getPublicUrl(thumbPath);
        thumbUrl = urlData.publicUrl;
      }

      if (!pub.id) throw new Error('Missing publication ID.');
      console.log('Updating pub with ID:', pub.id);

      const { error: updateError, data } = await supabase
        .from('publications')
        .update({
          title: editTitle,
          description: editDescription,
          thumb_url: thumbUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', pub.id)
        .select();

        if(data){
          console.log(data);
        }

      if (updateError) {
        console.error(updateError);
        throw new Error(`Failed to update publication: ${updateError.message}`);
      }

      updatePublication(pub.id, {
        title: editTitle,
        description: editDescription,
        thumb_url: thumbUrl,
      });

      cancelEdit();
    })(), {
      loading: 'Saving changes...',
      success: 'Publication updated successfully!',
      error: (err) => err?.message || 'Failed to update publication',
    });

    setActionLoading(false);
  };

  const sortedPublications = useMemo(() => {
    let pubs = [...publications];

    if (editingId) {
      const editingPubIndex = pubs.findIndex(p => p.id === editingId);
      if (editingPubIndex > -1) {
        const [editingPub] = pubs.splice(editingPubIndex, 1);
        pubs.unshift(editingPub);
      }
    } else {
      pubs.sort((a, b) => {
        const aTime = new Date(a.created_at).getTime();
        const bTime = new Date(b.created_at).getTime();
        return bTime - aTime; // Newest first
      });
    }

    return pubs;
  }, [publications, editingId]);

  if (authLoading || loading) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading profile..." />
    </div>
  );
}

  return (
    <>
      {user ? (
        <div className="min-h-screen bg-background">
          {/* Profile Header */}
          <div className="border-b border-border/50 bg-gradient-to-r from-background to-muted/20">
            <div className="max-w-2xl mx-auto px-4 py-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="transform transition-transform duration-300 hover:scale-105">
                    <CurrentUserAvatar />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">
                      {user.username || user.email}
                    </h1>
                    <p className="text-muted-foreground mt-1">{user.bio}</p>
                    <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                      {user.location && (
                        <>
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{user.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className='flex gap-2 justify-between items-center w-full sm:w-auto'>
                  <EditProfile />
                  <Button
                    className="cursor-pointer transition-all duration-200 hover:scale-105"
                    onClick={() => {
                      setLogoutDialogOpen(true);
                    }}
                    variant="destructive">
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation dialog for logout */}
          <AlertDialog
            open={logoutDialogOpen}
            onOpenChange={setLogoutDialogOpen}
            title="Confirm Logout"
            description="Are you sure you want to log out? You will need to log in again to access your account."
            confirmText="Logout"
            cancelText="Cancel"
            onConfirm={async () => {
              setIsLoggingOut(true);
              try {
                await toast.promise(supabase.auth.signOut(), {
                  loading: 'Logging out...',
                  success: 'Logged out successfully',
                  error: 'Failed to log out',
                });
                window.location.href = '/';
              } finally {
                setIsLoggingOut(false);
              }
            }}
            onCancel={() => setLogoutDialogOpen(false)}
            variant="destructive"
            isLoading={isLoggingOut}
          />

          {/* Publications Section */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">My Publications</h2>
                <p className="text-muted-foreground">{sortedPublications.length} publication{sortedPublications.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="transition-all duration-200"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="transition-all duration-200"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="w-full h-32 bg-muted rounded mb-3"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sortedPublications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Grid3X3 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No publications yet</h3>
                  <p className="text-muted-foreground mb-6">Start sharing your work with the world</p>
                  <Link href="/home/create">
                    <Button className="transition-all duration-200 hover:scale-105">
                      Create Your First Publication
                    </Button>
                  </Link>
                </div>
              </div>
            ) : viewMode === 'grid' ? (
              // Grid View
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {sortedPublications.map((pub, index) => {
                  const likeCount = likes[pub.id] || 0;
                  return (
                    <div
                      key={pub.id}
                      className="group relative animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] border-border/50 hover:border-border">
                        <CardContent className="p-0 flex flex-col h-full">
                          {/* Image Container */}
                          <div className="relative overflow-hidden">
                            {pub.thumb_url ? (
                              <Image
                                src={pub.thumb_url}
                                alt={pub.title}
                                width={300}
                                height={200}
                                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                            ) : null}
                            <div className={`w-full h-48 flex items-center justify-center bg-gradient-to-br from-muted to-muted/70 text-muted-foreground text-sm ${pub.thumb_url ? 'hidden' : ''}`}>
                              <div className="text-center">
                                <Grid3X3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                No Preview
                              </div>
                            </div>

                            {/* Like Count Overlay */}
                            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center gap-1 text-xs font-medium">
                              <Heart className="w-3 h-3" />
                              {likeCount}
                            </div>

                            {/* Action Buttons Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75 cursor-pointer"
                                onClick={() => { setViewMode('list'); startEdit(pub); }}
                              >
                                <Pencil className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-sm leading-tight">
                              {pub.title}
                            </h3>
                            <p className="text-muted-foreground text-xs line-clamp-2 mb-3 flex-1">
                              {pub.description}
                            </p>
                            <div className="text-xs text-muted-foreground">
                              {new Date(pub.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            ) : (
              // List View
              <div className="space-y-6">
                {sortedPublications.map((pub, index) => (
                  <Card
                    key={pub.id}
                    className="group transition-all duration-300 hover:shadow-lg border-border/50 hover:border-border animate-in fade-in-0 slide-in-from-left-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-0">
                      {editingId === pub.id ? (
                        // Edit Mode
                        <div className="p-6">
                          <input
                            type="file"
                            accept="image/*"
                            ref={editThumbInputRef}
                            className="hidden"
                            onChange={e => setEditThumb(e.target.files?.[0] || null)}
                          />
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* Image Upload Area */}
                            <div
                              className="w-full lg:w-32 h-48 lg:h-40 flex items-center justify-center bg-muted border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors duration-200"
                              onClick={() => editThumbInputRef.current?.click()}
                            >
                              {editThumb ? (
                                <Image
                                  src={URL.createObjectURL(editThumb)}
                                  alt="New Thumb"
                                  width={128}
                                  height={160}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : editThumbUrl ? (
                                <Image
                                  src={editThumbUrl}
                                  alt="Thumb"
                                  width={128}
                                  height={160}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <div className="text-center text-muted-foreground">
                                  <Grid3X3 className="w-8 h-8 mx-auto mb-2" />
                                  <span className="text-sm">Click to upload</span>
                                </div>
                              )}
                            </div>

                            {/* Edit Form */}
                            <div className="flex-1 space-y-4">
                              <input
                                className="w-full text-lg font-semibold text-foreground bg-muted border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                                value={editTitle}
                                onChange={e => setEditTitle(e.target.value)}
                                placeholder="Publication title..."
                              />
                              <textarea
                                className="w-full text-muted-foreground bg-muted border border-border rounded-lg px-4 py-3 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200"
                                value={editDescription}
                                onChange={e => setEditDescription(e.target.value)}
                                placeholder="Description..."
                              />
                              <div className="text-xs text-muted-foreground">
                                Created: {new Date(pub.created_at).toLocaleString()}
                              </div>
                              <div className="flex gap-3 pt-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleEditSave(pub)}
                                  disabled={actionLoading}
                                  className="transition-all duration-200 hover:scale-105"
                                >
                                  <Save className="w-4 h-4 mr-2" />
                                  Save Changes
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={cancelEdit}
                                  disabled={actionLoading}
                                  className="transition-all duration-200 hover:scale-105"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="flex flex-col lg:flex-row">
                          {/* Image */}
                          <div className="w-full lg:w-32 h-48 lg:h-40 flex-shrink-0">
                            {pub.thumb_url ? (
                              <Image
                                src={pub.thumb_url}
                                alt="Thumbnail"
                                width={128}
                                height={160}
                                className="w-full h-full object-cover lg:rounded-l-lg"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground lg:rounded-l-lg">
                                <div className="text-center">
                                  <Grid3X3 className="w-6 h-6 mx-auto mb-1 opacity-50" />
                                  <span className="text-xs">No Image</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-6 flex flex-col justify-between">
                            <div className="flex-1">
                              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-2">
                                    {pub.title}
                                  </h3>
                                  <p className="text-muted-foreground mb-4 line-clamp-3">
                                    {pub.description}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Heart className="w-4 h-4" />
                                  <span className="font-medium">{likes[pub.id] || 0}</span>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="text-xs text-muted-foreground">
                                  Created {new Date(pub.created_at).toLocaleDateString()}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push(`/view?pdf=${encodeURIComponent(pub.pdf_url)}&title=${encodeURIComponent(pub.title)}`)}
                                    className='cursor-pointer transition-all duration-200 hover:scale-105'
                                  >
                                    View Publication
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => startEdit(pub)}
                                    className="transition-all duration-200 hover:scale-105 cursor-pointer"
                                  >
                                    <Pencil className="w-4 h-4 mr-1" />
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (

        <div className="min-h-screen bg-background flex items-center justify-center">
          {loading ?? (
            <LoadingSpinner />
          )}
          <div className="flex items-center justify-center h-full">
            <div className="text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              <h1 className="text-2xl font-bold mb-4">You are not logged in</h1>
              <p className="text-muted-foreground mb-6">Please log in to view your profile.</p>
              <div className="flex gap-4 justify-center">
                <Link href="/auth/register?mode=login" className="text-primary hover:underline">
                  <Button variant="outline" className="cursor-pointer">Login</Button>
                </Link>
                <Link href="/auth/register?mode=register" className="text-primary hover:underline">
                  <Button>Register</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )
      }
    </>
  );
}
