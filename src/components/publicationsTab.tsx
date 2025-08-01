'use client';

import React, { useState } from 'react'
import { AlertDialog, Button } from '@/components';
import { Calendar, Edit, Eye, FileText, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePublications } from '@/components';
import { createClient } from '@/lib/database/supabase/client';
import { toastify } from './toastify';

export default function PublicationsTab() {
    const router = useRouter();
    const { publications, loading, deletePublication } = usePublications();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingPublicationId, setDeletingPublicationId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (pubId: string) => {
        setDeletingPublicationId(pubId);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingPublicationId) return;

        setIsDeleting(true);

        try {
            const supabase = createClient();

            console.log('Starting deletion for publication ID:', deletingPublicationId);

            // Get publication details first
            const { data: publication, error: fetchError } = await supabase
                .from('publications')
                .select('*')
                .eq('id', deletingPublicationId)
                .single();

            if (fetchError) {
                console.error('Error fetching publication:', fetchError);
                throw fetchError;
            }

            if (!publication) {
                console.error('Publication not found');
                throw new Error('Publication not found');
            }

            console.log('Found publication:', publication);

            // Delete likes first (foreign key constraint)
            const { error: likesError } = await supabase
                .from('publication_likes')
                .delete()
                .eq('publication_id', deletingPublicationId);

            if (likesError) {
                console.error('Error deleting likes:', likesError);
                // Don't throw here if it's just because no likes exist
                if (likesError.code !== 'PGRST116') { // PGRST116 is "no rows found"
                    throw likesError;
                }
            }

            console.log('Deleted associated likes');

            // Delete the publication record
            const { error: deleteError } = await supabase
                .from('publications')
                .delete()
                .eq('id', deletingPublicationId);

            if (deleteError) {
                console.error('Error deleting publication:', deleteError);
                throw deleteError;
            }

            // Wait a moment for the deletion to propagate
            await new Promise(resolve => setTimeout(resolve, 500));

            // Try multiple times to verify deletion
            let retries = 3;
            while (retries > 0) {
                const { data: verifyData, error: verifyError } = await supabase
                    .from('publications')
                    .select('id')
                    .eq('id', deletingPublicationId)
                    .maybeSingle();  // Use maybeSingle instead of single to avoid error when not found

                if (verifyError) {
                    console.warn('Verification attempt error:', verifyError);
                } else if (!verifyData) {
                    // Successfully verified deletion
                    console.log('Confirmed publication deletion from database');
                    break;
                }

                if (retries === 1) {
                    throw new Error('Publication deletion could not be verified');
                }

                retries--;
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            // Delete associated files from storage (do this after DB deletion succeeds)
            try {
                if (publication.pdf_url) {
                    const pdfPath = new URL(publication.pdf_url).pathname.split('/').pop();
                    if (pdfPath) {
                        const { error: pdfDeleteError } = await supabase.storage
                            .from('publications')
                            .remove([`pdfs/${pdfPath}`]);

                        if (pdfDeleteError) {
                            console.warn('Error deleting PDF file:', pdfDeleteError);
                        }
                    }
                }

                if (publication.thumb_url) {
                    const thumbPath = new URL(publication.thumb_url).pathname.split('/').pop();
                    if (thumbPath) {
                        const { error: thumbDeleteError } = await supabase.storage
                            .from('publications')
                            .remove([`thumbs/${thumbPath}`]);

                        if (thumbDeleteError) {
                            console.warn('Error deleting thumbnail file:', thumbDeleteError);
                        }
                    }
                }
            } catch (storageError) {
                console.warn('Error with storage operations:', storageError);
            }

            // Update local state only if everything succeeded
            deletePublication(deletingPublicationId);
            toastify.success("Successfully deleted publication");

        } catch (err) {
            console.error('Error deleting publication:', err);
            // Extract error message from Supabase error if available
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            toastify.error(`Failed to delete publication: ${errorMessage}`);
            
            // Log detailed error for debugging
            if (err && typeof err === 'object' && 'code' in err) {
                console.error('Database error code:', (err as any).code);
                console.error('Database error details:', err);
            }
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setDeletingPublicationId(null);
            
            // Update UI state immediately
            deletePublication(deletingPublicationId);
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
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-600 dark:border-neutral-400 mx-auto mb-4"></div>
                    <p className="text-neutral-500 dark:text-neutral-400">Loading publications...</p>
                </div>
            ) : publications.length === 0 ? (
                <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Publications Yet</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-4">Start by creating your first publication.</p>
                    <Button onClick={() => router.push('/home/create')}>
                        Create Publication
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Your Publications ({publications.length})</h3>
                        <Button
                            className='cursor-pointer'
                            variant="outline"
                            size="sm"
                            onClick={() => router.push('/profile')}
                        >
                            View All
                        </Button>
                    </div>
                    <div className="space-y-3">
                        {publications.map((pub) => (
                            <div key={pub.id} className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
                                {pub.thumb_url ? (
                                    <Image
                                        src={pub.thumb_url}
                                        alt="Thumbnail"
                                        width={60}
                                        height={60}
                                        className="w-15 h-15 object-cover rounded"
                                    />
                                ) : (
                                    <div className="w-15 h-15 bg-neutral-200 dark:bg-neutral-700 rounded flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-neutral-400" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100">{pub.title}</h4>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">{pub.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Calendar className="w-3 h-3 text-neutral-400" />
                                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                            {formatDate(pub.created_at)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className='cursor-pointer'
                                        onClick={() => router.push(`/view?pdf=${encodeURIComponent(pub.pdf_url)}`)}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className='cursor-pointer'
                                        onClick={() => router.push(`/profile?edit=${pub.id}`)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteClick(pub.id)}
                                        className="text-red-500 hover:text-red-700 cursor-pointer"
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