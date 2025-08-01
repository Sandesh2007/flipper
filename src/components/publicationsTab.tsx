'use client';

import React from 'react'
import { Button } from './ui';
import { Calendar, Edit, Eye, FileText, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePublications } from '@/components';
import { createClient } from '@/lib/database/supabase/client';

export default function PublicationsTab() {
    const router = useRouter();
    const { publications, loading, deletePublication } = usePublications();

    const handleDelete = async (pubId: string) => {
        if (!window.confirm('Are you sure you want to delete this publication?')) return;
        
        // Delete from database
        const supabase = createClient();
        const { error } = await supabase.from('publications').delete().eq('id', pubId);
        
        if (!error) {
            deletePublication(pubId);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
                                        onClick={() => router.push(`/view?pdf=${encodeURIComponent(pub.pdf_url)}`)}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push(`/profile?edit=${pub.id}`)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(pub.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}