'use client'

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import DFlipViewer from "@/components/DearFlipViewer";
import { usePdfUpload } from "@/components/PdfUploadContext";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, FileText, ArrowLeft } from "lucide-react";
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";

export default function View() {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [viewerHeight, setViewerHeight] = useState('600px');
    const [isMounted, setIsMounted] = useState(true);
    const [somethingWentWrong, setSomethingWentWrong] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const { pdf: pdfContext, loadStoredPdf } = usePdfUpload();

    const pdfId = searchParams?.get('id');
    const pdfName = searchParams?.get('name');
    const pdfUrl = searchParams?.get('pdf');
    const publicationTitle = searchParams?.get('title');

    const calculateViewerHeight = useCallback(() => {
        if (typeof window !== 'undefined') {
            const headerHeight = 64;
            const paddingAndMargin = 96;
            const availableHeight = window.innerHeight - headerHeight - paddingAndMargin;
            setViewerHeight(`${Math.max(400, availableHeight)}px`);
        }
    }, []);

    // Handle window resize
    useEffect(() => {
        calculateViewerHeight();

        const handleResize = () => {
            calculateViewerHeight();
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [calculateViewerHeight]);

    const loadPdfFile = useCallback(async () => {
        if (!isMounted) return;
        setIsLoading(true);
        setError(null);

        try {
            // First check if we have a PDF URL from query parameters
            if (pdfUrl) {
                try {
                    const response = await fetch(pdfUrl);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
                    }

                    const blob = await response.blob();
                    if (blob.type !== 'application/pdf') {
                        throw new Error('The provided URL does not point to a valid PDF file');
                    }

                    // Extract filename from URL or use default
                    const urlParts = pdfUrl.split('/');
                    const filename = decodeURIComponent(urlParts[urlParts.length - 1]) || 'document.pdf';

                    // Create a File object from the blob
                    const file = new File([blob], filename, { type: 'application/pdf' });
                    if (isMounted) {
                        setPdfFile(file);
                        toast.success(`Loaded "${filename}"`);
                    }
                    return;
                } catch (fetchError) {
                    console.error('Error fetching PDF from URL:', fetchError);
                    throw new Error(`Failed to load PDF from URL: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
                }
            }

            // Try to load from context if available
            if (pdfContext?.file) {
                if (isMounted) {
                    setPdfFile(pdfContext.file);
                    toast.success(`Loaded "${pdfContext.name || pdfContext.file.name}"`);
                }
                return;
            }

            // Try to load from localStorage
            try {
                const storedFile = await loadStoredPdf();
                if (storedFile && isMounted) {
                    setPdfFile(storedFile);
                    toast.success(`Loaded "${storedFile.name}" from storage`);
                    return;
                }
            } catch (storageError) {
                console.warn('Failed to load from storage:', storageError);
            }

            // If we have URL parameters, try to load based on them
            if (pdfId || pdfName) {
                throw new Error(`PDF with ${pdfId ? `ID: ${pdfId}` : `name: ${pdfName}`} not found`);
            }

            // No PDF found anywhere
            throw new Error('No PDF file available to view');

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF file';
            if (isMounted) {
                setError(errorMessage);
                toast.error(errorMessage);
            }
            console.error('PDF loading error:', err);
        } finally {
            if (isMounted) {
                setIsLoading(false);
            }
        }
    }, [pdfUrl, pdfContext, loadStoredPdf, pdfId, pdfName, isMounted]);

    const handleReload = useCallback(() => {
        setRetryCount(prev => prev + 1);
        loadPdfFile();
    }, [loadPdfFile]);

    const handleGoBack = useCallback(() => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/'); // Fallback to home page
        }
    }, [router]);

    useEffect(() => {
        const timer = setTimeout(() => {
            loadPdfFile();
        }, 300);

        return () => clearTimeout(timer);
    }, [loadPdfFile, retryCount]);

    // Cleanup effect to handle component unmounting
    useEffect(() => {
        return () => {
            setIsMounted(false);
            setPdfFile(null);
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSomethingWentWrong(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, [isLoading]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/20">
                <div className="text-center space-y-4 p-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <h2 className="text-xl font-semibold">Loading PDF...</h2>
                    <p className="text-muted-foreground">Please wait while we prepare your document</p>
                    {somethingWentWrong && (
                        <div
                        className='flex flex-col justify-center gap-4'
                        >
                        <p className="text-muted-foreground">Stuck on loading??</p>
                        <Button onClick={
                            () => {
                                window.location.reload();
                            }
                        } className="gap-2 cursor-pointer">
                            <RefreshCw className="h-4 w-4" />
                            Reload
                        </Button>
                        </div>
                        )}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
                <div className="text-center space-y-6 max-w-md w-full">
                    <div className="flex justify-center">
                        <AlertCircle className="h-16 w-16 text-destructive" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-foreground">Unable to Load PDF</h2>
                        <p className="text-muted-foreground break-words">{error}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={handleReload} className="flex items-center gap-2 cursor-pointer">
                            <RefreshCw className="h-4 w-4" />
                            Reload
                        </Button>
                        <Button variant="outline" onClick={handleGoBack} className="flex items-center gap-2 cursor-pointer">
                            <ArrowLeft className="h-4 w-4" />
                            Go Back
                        </Button>
                    </div>
                    {retryCount > 0 && (
                        <p className="text-sm text-muted-foreground">
                            Retry attempts: {retryCount}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    if (!pdfFile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
                <div className="text-center space-y-4">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
                    <h2 className="text-xl font-semibold">No PDF file loaded</h2>
                    <Button onClick={handleGoBack} variant="outline" className="cursor-pointer">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    // Show PDF viewer
    return (
        <div className="min-h-screen bg-muted/20 flex flex-col">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Button variant="ghost" size="sm" onClick={handleGoBack} className="cursor-pointer flex-shrink-0">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex items-center gap-2 min-w-0">
                            <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                            <h1 className="text-lg font-semibold truncate">
                                Publication: {publicationTitle || pdfName || pdfFile.name}
                            </h1>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleReload} className="cursor-pointer flex-shrink-0 ml-2">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reload
                    </Button>
                </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 self-center container py-6">
                <div className="border rounded-lg overflow-hidden bg-card h-full">
                    <DFlipViewer
                        key={`${pdfFile.name}-${pdfFile.size}-${retryCount}`} // Well force it to rerender if pdfFile changes
                        pdfFile={pdfFile}
                        options={{
                            webgl: true,
                            autoEnableOutline: true,
                            pageMode: typeof window !== 'undefined' && window.innerWidth <= 768 ? 1 : 2,
                            singlePageMode: typeof window !== 'undefined' && window.innerWidth <= 768 ? 1 : 0,
                            responsive: true,
                            height: viewerHeight,
                            duration: 800,
                            backgroundColor: 'transparent',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
