'use client'
import EditProfile from "@/components/forms/edit-profile";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin, Heart, Pencil, Trash2, Save, X, Grid3X3, List, Plus, TrendingUp, BookOpen
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
import { motion, AnimatePresence } from "framer-motion";

interface LikeRow {
  publication_id: string;
  user_id: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

const statsVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.6,
      delay: 0.2,
      ease: "backOut"
    }
  }
};

export default function UserProfile() {
  const { user } = useAuth();
  const { publications, loading, updatePublication, deletePublication } = usePublications();
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

  // Calculate stats
  const totalPublications = publications.length;
  const totalLikes = Object.values(likes).reduce((sum, count) => sum + count, 0);

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
    let thumbUrl = editThumbUrl;

    if (editThumb) {
      const supabase = createClient();
      const thumbPath = `thumbs/${Date.now()}_${editThumb.name}`;
      const { error: uploadError } = await supabase
        .storage
        .from('publications')
        .upload(thumbPath, editThumb);

      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('publications').getPublicUrl(thumbPath);
        thumbUrl = urlData.publicUrl;
      }
    }

    const supabase = createClient();
    const { error } = await supabase
      .from('publications')
      .update({
        title: editTitle,
        description: editDescription,
        thumb_url: thumbUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', pub.id);

    if (!error) {
      updatePublication(pub.id, {
        title: editTitle,
        description: editDescription,
        thumb_url: thumbUrl,
      });
      cancelEdit();
    }

    setActionLoading(false);
  };

  const handleDelete = async (pub: any) => {
    if (!window.confirm('Are you sure you want to delete this publication?')) return;
    setActionLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('publications')
      .delete()
      .eq('id', pub.id);
    if (!error) {
      deletePublication(pub.id);
    }
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

  return (
    <>
      {user ? (
        <motion.div 
          className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Enhanced Profile Header */}
          <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto px-4 py-12">
              <motion.div 
                className="flex flex-col md:flex-row items-center gap-8 mb-8"
                variants={itemVariants}
              >
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <CurrentUserAvatar />
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full -z-10"
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </motion.div>
                
                <div className="flex-1 text-center md:text-left">
                  <motion.h1 
                    className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
                    variants={itemVariants}
                  >
                    {user.username || user.email}
                  </motion.h1>
                  <motion.p 
                    className="text-lg text-muted-foreground mt-2"
                    variants={itemVariants}
                  >
                    {user.bio || "Welcome to your digital library"}
                  </motion.p>
                  {user.location && (
                    <motion.div 
                      className="flex items-center justify-center md:justify-start gap-2 mt-3 text-muted-foreground"
                      variants={itemVariants}
                    >
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </motion.div>
                  )}
                </div>

                <motion.div 
                  className="flex flex-col gap-3"
                  variants={itemVariants}
                >
                  <EditProfile />
                  <Button
                    className="cursor-pointer"
                    onClick={() => {
                      setLogoutDialogOpen(true);
                    }}
                    variant="destructive"
                  >
                    <span>Logout</span>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Enhanced Stats Section */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={itemVariants}
              >
                <motion.div variants={statsVariants}>
                  <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-6">
                      <motion.div
                        className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-500 rounded-full"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <BookOpen className="w-6 h-6 text-white" />
                      </motion.div>
                      <motion.div
                        className="text-3xl font-bold text-blue-600 dark:text-blue-400"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                      >
                        {totalPublications}
                      </motion.div>
                      <p className="text-sm text-muted-foreground">Publications</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={statsVariants}>
                  <Card className="text-center bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/50 border-pink-200 dark:border-pink-800">
                    <CardContent className="p-6">
                      <motion.div
                        className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-pink-500 rounded-full"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Heart className="w-6 h-6 text-white" />
                      </motion.div>
                      <motion.div
                        className="text-3xl font-bold text-pink-600 dark:text-pink-400"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                      >
                        {totalLikes}
                      </motion.div>
                      <p className="text-sm text-muted-foreground">Total Likes</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={statsVariants}>
                  <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800">
                    <CardContent className="p-6">
                      <motion.div
                        className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-500 rounded-full"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <TrendingUp className="w-6 h-6 text-white" />
                      </motion.div>
                      <motion.div
                        className="text-3xl font-bold text-green-600 dark:text-green-400"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                      >
                        {publications.length > 0 ? Math.round(totalLikes / publications.length * 10) / 10 : 0}
                      </motion.div>
                      <p className="text-sm text-muted-foreground">Avg. Likes</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
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

          {/* Enhanced Publications Section */}
          <div className="max-w-6xl mx-auto px-4 py-12">
            <motion.div 
              className="flex items-center justify-between mb-8"
              variants={itemVariants}
            >
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">My Publications</h2>
                <p className="text-muted-foreground">Manage and organize your content</p>
              </div>
              <div className="flex items-center gap-3">
                <Link href="/home/create">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Publication
                  </Button>
                </Link>
                <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                                     <Button
                     variant={viewMode === 'grid' ? 'default' : 'ghost'}
                     size="sm"
                     onClick={() => setViewMode('grid')}
                     className="h-8 w-8 p-0"
                   >
                     <Grid3X3 className="w-4 h-4" />
                   </Button>
                   <Button
                     variant={viewMode === 'list' ? 'default' : 'ghost'}
                     size="sm"
                     onClick={() => setViewMode('list')}
                     className="h-8 w-8 p-0"
                   >
                     <List className="w-4 h-4" />
                   </Button>
                </div>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  className="flex items-center justify-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="ml-3 text-muted-foreground">Loading your publications...</span>
                </motion.div>
              ) : sortedPublications.length === 0 ? (
                <motion.div 
                  className="flex flex-col items-center justify-center gap-6 py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="w-24 h-24 bg-muted rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <BookOpen className="w-12 h-12 text-muted-foreground" />
                  </motion.div>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">No publications yet</h3>
                    <p className="text-muted-foreground mb-6">Start building your digital library by creating your first publication</p>
                                         <Link href="/home/create">
                       <Button size="lg" className="gap-2">
                         <Plus className="w-5 h-5" />
                         Create Your First Publication
                       </Button>
                     </Link>
                  </div>
                </motion.div>
              ) : viewMode === 'grid' ? (
                // Enhanced Grid View
                <motion.div 
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                  layout
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  {sortedPublications.map((pub, index) => {
                    const likeCount = likes[pub.id] || 0;
                    return (
                      <motion.div 
                        key={pub.id} 
                        className="relative group"
                        variants={cardVariants}
                        layout
                        whileHover="hover"
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="overflow-hidden bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <CardContent className="p-3 flex flex-col h-full">
                            <div className="relative mb-3 group-hover:scale-105 transition-transform duration-300">
                              {pub.thumb_url ? (
                                <motion.div
                                  className="relative overflow-hidden rounded-lg"
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Image
                                    src={pub.thumb_url}
                                    alt={pub.title}
                                    width={300}
                                    height={128}
                                    className="w-full h-32 object-cover border border-border/50"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </motion.div>
                              ) : null}
                              <div className={`w-full h-32 flex items-center justify-center bg-gradient-to-br from-muted to-muted/70 text-muted-foreground rounded-lg border border-border/50 text-xs ${pub.thumb_url ? 'hidden' : ''}`}>
                                <BookOpen className="w-8 h-8 mb-2" />
                              </div>
                            </div>
                            
                            <div className="flex-1 flex flex-col">
                              <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2">{pub.title}</h3>
                              <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{pub.description}</p>
                            </div>
                          </CardContent>

                          <motion.div 
                            className="absolute top-3 right-3 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <motion.span 
                              className="text-xs font-medium"
                              animate={{ color: likeCount > 0 ? "#ef4444" : "#6b7280" }}
                            >
                              {likeCount}
                            </motion.span>
                            <Heart className={`w-3 h-3 ${likeCount > 0 ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                          </motion.div>

                          <motion.div 
                            className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                            initial={{ y: 10, opacity: 0 }}
                            whileHover={{ y: 0, opacity: 1 }}
                          >
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex-1"
                            >
                              <Button
                                size="sm"
                                variant="secondary"
                                className="w-full h-7 text-xs backdrop-blur-sm bg-background/90"
                                onClick={() => { setViewMode('list'); startEdit(pub); }}
                              >
                                <Pencil className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex-1"
                            >
                              <Button
                                size="sm"
                                variant="destructive"
                                className="w-full h-7 text-xs backdrop-blur-sm bg-destructive/90"
                                onClick={() => handleDelete(pub)}
                                disabled={actionLoading}
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            </motion.div>
                          </motion.div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                // Enhanced List View
                <motion.div 
                  className="space-y-6"
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  {sortedPublications.map((pub, index) => (
                    <motion.div
                      key={pub.id}
                      variants={cardVariants}
                      layout
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden bg-gradient-to-r from-card to-card/80 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6 flex gap-6 items-center">
                          {editingId === pub.id ? (
                            <>
                              <input
                                type="file"
                                accept="image/*"
                                ref={editThumbInputRef}
                                className="hidden"
                                onChange={e => setEditThumb(e.target.files?.[0] || null)}
                              />
                              <motion.div 
                                className="w-24 h-32 flex items-center justify-center bg-muted text-muted-foreground rounded-lg border border-border cursor-pointer hover:bg-muted/80 transition-colors"
                                onClick={() => editThumbInputRef.current?.click()}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {editThumb ? (
                                  <Image src={URL.createObjectURL(editThumb)} alt="New Thumb" width={96} height={128} className="w-24 h-32 object-cover rounded-lg" />
                                ) : editThumbUrl ? (
                                  <Image src={editThumbUrl} alt="Thumb" width={96} height={128} className="w-24 h-32 object-cover rounded-lg" />
                                ) : (
                                  <div className="flex flex-col items-center gap-2">
                                    <BookOpen className="w-8 h-8" />
                                    <span className="text-xs">Click to add</span>
                                  </div>
                                )}
                              </motion.div>
                              <div className="flex-1">
                                <motion.input 
                                  className="font-semibold text-lg text-foreground bg-muted/50 border border-border rounded-lg px-3 py-2 mb-3 w-full focus:ring-2 focus:ring-primary/50 transition-all"
                                  value={editTitle}
                                  onChange={e => setEditTitle(e.target.value)}
                                  placeholder="Publication title..."
                                  whileFocus={{ scale: 1.01 }}
                                />
                                <motion.textarea 
                                  className="text-muted-foreground text-sm mb-3 bg-muted/50 border border-border rounded-lg px-3 py-2 w-full min-h-[80px] focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                  value={editDescription}
                                  onChange={e => setEditDescription(e.target.value)}
                                  placeholder="Publication description..."
                                  whileFocus={{ scale: 1.01 }}
                                />
                                <div className="text-xs text-muted-foreground mb-4">{new Date(pub.created_at).toLocaleString()}</div>
                                <div className="flex gap-3">
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button 
                                      size="sm" 
                                      variant="default" 
                                      onClick={() => handleEditSave(pub)} 
                                      disabled={actionLoading}
                                      className="gap-2"
                                    >
                                      <Save className="w-4 h-4" />Save Changes
                                    </Button>
                                  </motion.div>
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={cancelEdit} 
                                      disabled={actionLoading}
                                      className="gap-2"
                                    >
                                      <X className="w-4 h-4" />Cancel
                                    </Button>
                                  </motion.div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <motion.div
                                className="relative"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                              >
                                {pub.thumb_url ? (
                                  <Image
                                    src={pub.thumb_url}
                                    alt="Thumbnail"
                                    width={96}
                                    height={128}
                                    className="w-24 h-32 object-cover rounded-lg border border-border/50 shadow-sm"
                                  />
                                ) : (
                                  <div className="w-24 h-32 flex items-center justify-center bg-gradient-to-br from-muted to-muted/70 text-muted-foreground rounded-lg border border-border/50">
                                    <BookOpen className="w-8 h-8" />
                                  </div>
                                )}
                              </motion.div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-semibold text-xl text-foreground">{pub.title}</h3>
                                  <motion.div 
                                    className="flex items-center gap-1 bg-muted/50 rounded-full px-3 py-1"
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    <span className="text-sm font-medium">{likes[pub.id] || 0}</span>
                                    <Heart className={`w-4 h-4 ${(likes[pub.id] || 0) > 0 ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                                  </motion.div>
                                </div>
                                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{pub.description}</p>
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="inline-block"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push(`/view?pdf=${encodeURIComponent(pub.pdf_url)}&title=${encodeURIComponent(pub.title)}`)}
                                    className="cursor-pointer gap-2 mb-4"
                                  >
                                    <BookOpen className="w-4 h-4" />
                                    View Publication
                                  </Button>
                                </motion.div>
                                <div className="text-xs text-muted-foreground mb-4">{new Date(pub.created_at).toLocaleString()}</div>
                                <div className="flex gap-3">
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={() => startEdit(pub)}
                                      className="gap-2"
                                    >
                                      <Pencil className="w-4 h-4" />Edit
                                    </Button>
                                  </motion.div>
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    <Button 
                                      size="sm" 
                                      variant="destructive" 
                                      onClick={() => handleDelete(pub)} 
                                      disabled={actionLoading}
                                      className="gap-2"
                                    >
                                      <Trash2 className="w-4 h-4" />Delete
                                    </Button>
                                  </motion.div>
                                </div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      ): (
        <motion.div 
          className="min-h-screen bg-background flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-4">You are not logged in</h1>
            <p className="text-muted-foreground mb-6">Please log in to view your profile and manage your publications.</p>
            <div className="flex gap-4 justify-center">
              <Link href="/auth/register?mode=login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button>Login</Button>
                </motion.div>
              </Link>
              <Link href="/auth/register?mode=register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline">Register</Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )
    }
    </>
  );
}
