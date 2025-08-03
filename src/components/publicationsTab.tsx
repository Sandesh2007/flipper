'use client';

import React, { useState } from 'react'
import { AlertDialog, Button } from '@/components';
import { Calendar, Edit, Eye, FileText, Trash2, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePublications } from '@/components';
import { createClient } from '@/lib/database/supabase/client';
import { toastify } from './toastify';

export default function PublicationsTab() {
    const router = useRouter();
    const { publications, loading, deletePublication, refreshPublications } = usePublications();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingPublicationId, setDeletingPublicationId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Add a refresh mechanism
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshPublications();
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleDeleteClick = (pubId: string) => {
        setDeletingPublicationId(pubId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingPublicationId) return;

        setIsDeleting(true);

        try {
            const supabase = createClient();

            // Get publication details first
            const { data: publication, error: fetchError } = await supabase
                .from('publications')
                .select('*')
                .eq('id', deletingPublicationId)
                .single();

            if (fetchError) throw fetchError;
            if (!publication) throw new Error('Publication not found');

            // Delete likes first (foreign key constraint)
            const { error: likesError } = await supabase
                .from('publication_likes')
                .delete()
                .eq('publication_id', deletingPublicationId);
            if (likesError && likesError.code !== 'PGRST116') throw likesError;

            // Delete the publication record
            const { error: deleteError } = await supabase
                .from('publications')
                .delete()
                .eq('id', deletingPublicationId);
            if (deleteError) throw deleteError;

            // Wait a moment for the deletion to propagate
            await new Promise(resolve => setTimeout(resolve, 500));

            // Try multiple times to verify deletion
            let retries = 3;
            while (retries > 0) {
                const { data: verifyData, error: verifyError } = await supabase
                    .from('publications')
                    .select('id')
                    .eq('id', deletingPublicationId)
                    .maybeSingle();
                if (!verifyData) break;
                if (retries === 1) throw new Error('Publication deletion could not be verified');
                retries--;
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Delete associated files from storage (do this after DB deletion succeeds)
            try {
                if (publication.pdf_url) {
                    const pdfPath = new URL(publication.pdf_url).pathname.split('/').pop();
                    if (pdfPath) {
                        await supabase.storage.from('publications').remove([`pdfs/${pdfPath}`]);
                    }
                }
                if (publication.thumb_url) {
                    const thumbPath = new URL(publication.thumb_url).pathname.split('/').pop();
                    if (thumbPath) {
                        await supabase.storage.from('publications').remove([`thumbs/${thumbPath}`]);
                    }
                }
            } catch (storageError) {
                // Non-blocking
            }

            // Update local state only if everything succeeded
            deletePublication(deletingPublicationId);
            toastify.success("Successfully deleted publication");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            toastify.error(`Failed to delete publication: ${errorMessage}`);
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setDeletingPublicationId(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setDeletingPublicationId(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getPublicationToDelete = () => {
        return publications.find(pub => pub.id === deletingPublicationId);
    };

    return (
        <div>
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground mb-4">Loading publications...</p>
                    <Button 
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        variant="outline"
                        size="sm"
                        className="transition-all duration-200 hover:scale-105"
                    >
                        {isRefreshing ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                                Refreshing...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </>
                        )}
                    </Button>
                </div>
            ) : publications.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">No Publications Yet</h3>
                    <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">Start by creating your first publication to showcase your work.</p>
                    <Button 
                        onClick={() => router.push('/home/create')}
                        className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-soft hover:shadow-glow transition-all duration-300"
                    >
                        Create Publication
                    </Button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-foreground">Your Publications</h3>
                            <p className="text-sm text-muted-foreground">{publications.length} publication{publications.length !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                variant="outline"
                                size="sm"
                                className="transition-all duration-200 hover:scale-105"
                            >
                                {isRefreshing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                                        Refreshing...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Refresh
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push('/home/profile')}
                                className="bg-card border border-border/30 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-300"
                            >
                                View All
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {publications.map((pub) => (
                            <div key={pub.id} className="flex items-center gap-4 p-6 bg-card border border-border/30 rounded-xl shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-102">
                                {pub.thumb_url ? (
                                    <Image
                                        src={pub.thumb_url}
                                        alt="Thumbnail"
                                        width={60}
                                        height={60}
                                        className="w-15 h-15 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-15 h-15 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-primary" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h4 className="font-semibold text-foreground mb-1">{pub.title}</h4>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{pub.description}</p>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                            {formatDate(pub.created_at)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push(`/view?pdf=${encodeURIComponent(pub.pdf_url)}&title=${encodeURIComponent(pub.title)}`)}
                                        className="hover:bg-primary/10 transition-all duration-300"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push(`/profile?edit=${pub.id}`)}
                                        className="hover:bg-primary/10 transition-all duration-300"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteClick(pub.id)}
                                        className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 transition-all duration-300"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Publication"
                description={`Are you sure you want to delete "${getPublicationToDelete()?.title}"? This action cannot be undone and will permanently remove the publication from your account.`}
                confirmText="Delete Publication"
                cancelText="Cancel"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                variant="destructive"
                isLoading={isDeleting}
            />
        </div>
    );
}