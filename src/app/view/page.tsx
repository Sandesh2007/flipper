'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DFlipViewer from "@/components/DearFlipViewer";
import { usePdfUpload } from "@/components/PdfUploadContext";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, FileText, ArrowLeft } from "lucide-react";
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";

export default function ViewPage() {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const { pdf: pdfContext, loadStoredPdf, storedPdfData } = usePdfUpload();
    
    // Get PDF file ID, name, or URL from URL params if provided
    const pdfId = searchParams.get('id');
    const pdfName = searchParams.get('name');
    const pdfUrl = searchParams.get('pdf');
    
    const loadPdfFile = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // First we'll check if we have a Pdf file link from query parameters
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
                    setPdfFile(file);
                    toast.success(`Loaded "${filename}"`);
                    return;
                } catch (fetchError) {
                    console.error('Error fetching PDF from URL:', fetchError);
                    throw new Error(`Failed to load PDF from URL: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
                }
            }
            
            // Try to load from context if it is available
            if (pdfContext?.file) {
                setPdfFile(pdfContext.file);
                toast.success(`Loaded "${pdfContext.name}"`);
                return;
            }
            
            // Try to load from localStorage, by chance we have it stored 
            const storedFile = await loadStoredPdf();
            if (storedFile) {
                setPdfFile(storedFile);
                toast.success(`Loaded "${storedFile.name}" from storage`);
                return;
            }
            
            // If we have URL parameters, try to load based on them
            if (pdfId || pdfName) {
                // For now just throw a err, i'll implement it later
                throw new Error(`PDF with ${pdfId ? `ID: ${pdfId}` : `name: ${pdfName}`} not found`);
            }
            
            // No PDF found anywhere
            throw new Error('No PDF file available to view');
            
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load PDF file';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('PDF loading error:', err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReload = () => {
        setRetryCount(prev => prev + 1);
        loadPdfFile();
    };
    
    const handleGoBack = () => {
        router.back();
    };
    
    useEffect(() => {
        const timer = setTimeout(() => {
            loadPdfFile();
        }, 300);
        
        return () => clearTimeout(timer);
    }, [retryCount]);
    
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <h2 className="text-xl font-semibold">Loading PDF...</h2>
                    <p className="text-muted-foreground">Please wait while we prepare your document</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="text-center space-y-6 max-w-md">
                    <div className="flex justify-center">
                        <AlertCircle className="h-16 w-16 text-destructive" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-foreground">Unable to Load PDF</h2>
                        <p className="text-muted-foreground">{error}</p>
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
    
    // show PDF viewer
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={handleGoBack} className='cursor-pointer'>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <h1 className="text-lg font-semibold truncate max-w-xs sm:max-w-md">
                                {pdfFile?.name || 'PDF Viewer'}
                            </h1>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleReload} className='cursor-pointer'>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reload
                    </Button>
                </div>
            </div>
            
            {/* PDF Viewer */}
            <div className="container py-6">
                <div className="border rounded-lg overflow-hidden bg-card">
                    <DFlipViewer
                        pdfFile={pdfFile}
                        options={{
                            webgl: true,
                            autoEnableOutline: true,
                            pageMode: typeof window !== 'undefined' && window.innerWidth <= 768 ? 1 : 2,
                            singlePageMode: typeof window !== 'undefined' && window.innerWidth <= 768 ? 1 : 0,
                            responsive: true,
                            height: 'calc(100vh - 200px)',
                            duration: 800,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
