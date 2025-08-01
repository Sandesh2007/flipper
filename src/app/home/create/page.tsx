"use client"
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/database/supabase/client';
import { CheckCircle, FileText, Image as ImageIcon, RefreshCw, UploadCloud } from 'lucide-react';
import { DFlipViewer, Label, usePdfUpload } from '@/components';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { toastify } from '@/components/toastify';

const steps = [
  'Upload',
  'Details',
  'Preview',
  'Review',
  'Share',
];

export default function CreatePublicationPage() {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pdf, setPdf] = useState<File | null>(null);
  const [published, setPublished] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [thumbUrl] = useState('');
  const [error, setError] = useState('');
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [hasShownToast, setHasShownToast] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const { pdf: pdfCtx, setPdf: setPdfCtx, clearPdf, loadStoredPdf, storedPdfData } = usePdfUpload();
  const router = useRouter();
  const [isLoadingStoredPdf, setIsLoadingStoredPdf] = useState(false);

  // Add beforeunload warning to prevent accidental data loss
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isCompleted || (step === 4 && published)) {
        return;
      }
      // Only show warning if user has made progress
      if (pdf || title.trim() || description.trim() || step > 0) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [pdf, title, description, step, isCompleted, published]);

  useEffect(() => {
    const initializePdf = async () => {
      // Prevent multiple initializations
      if (hasShownToast) return;

      try {
        // Priority 1: Check if we have a PDF in context with actual file
        if (pdfCtx?.file && !pdf) {
          setPdf(pdfCtx.file);
          toast.success(`PDF "${pdfCtx.name}" loaded successfully!`);
          setHasShownToast(true);
          return;
        }

        if (storedPdfData && !pdf && !pdfCtx?.file) {
          setIsLoadingStoredPdf(true);
          try {
            const restoredFile = await loadStoredPdf();
            if (restoredFile) {
              setPdf(restoredFile);
              toast.success(`PDF "${storedPdfData.name}" restored from storage!`);
              setHasShownToast(true);
              return;
            }
          } catch (error) {
            console.error('Error restoring PDF:', error);
          } finally {
            setIsLoadingStoredPdf(false);
          }
        }

        if (pdfCtx?.name && !pdfCtx.file && !storedPdfData && !pdf) {
          toastify.error("Your PDF session expired. Please upload your PDF again.");
          setHasShownToast(true);
          return;
        }

        if (!pdf && !pdfCtx && !storedPdfData && !hasShownToast) {
          toastify.info("Ready to create a publication! Upload a PDF to get started.");
          setHasShownToast(true);
          return;
        }

        // If we reach here and still no PDF, mark as shown to prevent loops
        // Mehh idk what to do then
        if (!pdf && !hasShownToast) {
          setHasShownToast(true);
        }
      } catch (error) {
        console.error('Error initializing PDF:', error);
        toastify.error("Something went wrong. Please try again.");
        setHasShownToast(true);
      }
    };

    initializePdf();
  }, [pdfCtx, pdf, hasShownToast, storedPdfData, loadStoredPdf, router]);

  // When a PDF is selected, store it in context
  const handlePdfChange = (file: File | null) => {
    setPdf(file);
    if (file) {
      setPdfCtx({ file, name: file.name, lastModified: file.lastModified });
    } else {
      clearPdf();
    }
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handlePublish = async () => {
    console.log("Uploading started");

    setError('');
    setUploading(true);
    const supabase = createClient();
    let pdfPath = '';
    let pdfPublicUrl = '';
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        // Not logged in: store state and redirect to register
        localStorage.setItem('nekopress_publish_redirect', JSON.stringify({
          title,
          description,
          pdfMeta: pdfCtx,
          step,
        }));
        toastify.info('You need to be logged in to publish.');
        router.push('/auth/register?next=/home/create');
        return;
      }
      if (pdf) {
        pdfPath = `pdfs/${Date.now()}_${pdf.name}`;
        const { error: uploadError } = await supabase.storage.from('publications').upload(pdfPath, pdf);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('publications').getPublicUrl(pdfPath);
        pdfPublicUrl = urlData.publicUrl;
        setPdfUrl(pdfPublicUrl);
      }
      // Insert publication row
      const { error: insertError } = await supabase.from('publications').insert([
        {
          user_id: user.id,
          title,
          description,
          pdf_url: pdfPublicUrl,
        }
      ]);
      if (insertError) throw insertError;
      setPublished(true);
      handleNext();

      // If we published successfully, clear the PDF context ofc why not huh :?
      clearPdf();
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Upload failed';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // On mount, if redirected from register, restore state
  useEffect(() => {
    const redirectData = localStorage.getItem('nekopress_publish_redirect');
    if (redirectData) {
      try {
        const { title, description, pdfMeta, step } = JSON.parse(redirectData);
        setTitle(title || '');
        setDescription(description || '');
        setStep(step || 0);

        // If we have pdfMeta and it contains the file, well then wel will restore it
        if (pdfMeta && pdfMeta.file) {
          setPdf(pdfMeta.file);
          setPdfCtx(pdfMeta);
        }
      } catch { }
      localStorage.removeItem('nekopress_publish_redirect');
    }
  }, [setPdfCtx]);

  function handleRetry(): void {
    // Retry to process the pdf
    // TODO
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 py-8 px-2">
      <div className="w-full max-w-2xl bg-card shadow-xl rounded-2xl p-0 sm:p-0 overflow-hidden">
        {/* Stepper */}
        <div className="flex items-center justify-between px-8 pt-8 pb-4">
          {steps.map((label, idx) => (
            <div key={label} className="flex-1 flex flex-col items-center">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors duration-200 ${idx === step ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted text-muted-foreground border-border'} ${idx < step ? 'bg-primary/80 text-primary-foreground border-primary' : ''}`}>{idx < step ? <CheckCircle className="w-5 h-5" /> : idx + 1}</div>
              <span className={`mt-2 text-xs font-medium ${idx === step ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
            </div>
          ))}
        </div>
        <div className="border-b border-border mx-8" />
        {/* Content */}
        <div className="p-8">
          {error && <div className="text-destructive mb-4 text-center">{error}</div>}
          {step === 0 && (
            <div className="flex flex-col gap-6 items-center">
              {!pdf && (
                <div className="w-full text-center mb-4">
                  <h2 className="text-2xl font-bold mb-2">Create Your Publication</h2>
                  <p className="text-muted-foreground">
                    Transform your PDF into an interactive flipbook that engages your audience.
                  </p>
                </div>
              )}
              
              <div className="w-full flex flex-col items-center gap-4">
                <div 
                  className="w-full max-w-md p-8 flex flex-col items-center justify-center rounded-xl bg-muted border-2 border-dashed border-border cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-200" 
                  onClick={() => pdfInputRef.current?.click()}
                >
                  {pdf ? (
                    <>
                      <FileText className="w-12 h-12 text-primary mb-3" />
                      <div className="text-center">
                        <div className="font-semibold text-lg text-primary">PDF Ready!</div>
                        <div className="text-sm text-muted-foreground mt-1">{pdf.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {(pdf.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-12 h-12 text-muted-foreground mb-3" />
                      <div className="text-center">
                        <div className="font-semibold text-lg">Upload your PDF</div>
                        <div className="text-muted-foreground text-sm mt-1">
                          Drag & drop or click to select a PDF file
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          Maximum size: 50MB • Supported format: PDF
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <input 
                  ref={pdfInputRef} 
                  type="file" 
                  accept="application/pdf" 
                  className="hidden" 
                  onChange={e => handlePdfChange(e.target.files?.[0] || null)} 
                />
                
                {pdf && (
                  <div className="flex gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handlePdfChange(null)}
                      className="cursor-pointer"
                    >
                      Remove PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => pdfInputRef.current?.click()}
                      className="cursor-pointer"
                    >
                      Choose Different PDF
                    </Button>
                  </div>
                )}
              </div>
              
              {!pdf && (
                <div className="w-full max-w-md text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have a PDF ready? You can also{' '}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary underline cursor-pointer"
                      onClick={() => router.push('/')}
                    >
                      go back to the main upload page
                    </Button>
                    {' '}for more options.
                  </p>
                </div>
              )}
              
              <Button 
                onClick={handleNext} 
                disabled={!pdf || isLoadingStoredPdf} 
                className="w-full mt-4 cursor-pointer" 
                size="lg"
              >
                {isLoadingStoredPdf ? 'Loading PDF...' : 'Continue to Details'}
              </Button>
            </div>
          )}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Title</label>
                <Input placeholder="Enter a title for your publication" value={title} onChange={e => setTitle(e.target.value)} className="bg-muted border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-foreground">Description</label>
                <Textarea placeholder="Describe your publication" value={description} onChange={e => setDescription(e.target.value)} className="bg-muted border-border min-h-[80px]" />
              </div>
              <div className="flex gap-2 justify-between mt-2">
                <Button variant="secondary" onClick={handleBack} className='cursor-pointer'>Back</Button>
                <Button onClick={handleNext} disabled={!title || !description} className='cursor-pointer' >Next</Button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold text-center">Preview your PDF</h2>
              {pdf ? (
                <div className="border rounded-lg overflow-hidden">
                  <DFlipViewer
                    pdfFile={pdf}
                    options={{
                      webgl: true,
                      autoEnableOutline: true,
                      pageMode: typeof window !== 'undefined' && window.innerWidth <= 768 ? 1 : 2,
                      singlePageMode: typeof window !== 'undefined' && window.innerWidth <= 768 ? 1 : 0,
                      responsive: true
                    }}
                  />
                </div>
              ) : (
                <p className="text-muted-foreground text-center">No PDF selected for preview.</p>
              )}
              <div>
                <span>Failed to view preview ??</span>
                &nbsp;&nbsp;&nbsp;
              <Button onClick={handleRetry} className="cursor-pointer">
                <RefreshCw className="w-4 h-4" />
              </Button>
              </div>
              <div className="flex gap-2 justify-between mt-2">
                <Button variant="secondary" onClick={handleBack} className='cursor-pointer'>Back</Button>
                <Button onClick={handleNext} disabled={!pdf} className="cursor-pointer">Next</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 flex items-center justify-center rounded-xl bg-muted border border-border">
                  <ImageIcon className="w-10 h-10 text-muted-foreground" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                  <div id='title' className="font-semibold text-lg text-foreground">{title}</div>

                  <Label className="text-sm mt-2 font-medium text-gray-400">Description</Label>
                  <div id='description' className="text-foreground text-lg mt-1">{description}</div>
                  <div className="mt-2 flex items-center gap-2 border border-border rounded-lg p-2 bg-muted">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-primary text-sm font-medium">{pdf?.name}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-between mt-2">
                <Button variant="secondary" onClick={handleBack} disabled={uploading} className='cursor-pointer'>Back</Button>
                <Button onClick={handlePublish} disabled={uploading} className={uploading ? '' : 'cursor-pointer'} > {uploading ? 'Publishing...' : 'Publish'} </Button>
              </div>
            </div>
          )}
          {step === 4 && published && (
            <div className="flex flex-col gap-6 items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-2">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-lg font-bold text-green-700 dark:text-green-400">Publication Created!</div>
              <div className="w-full">
                <div className="text-muted-foreground text-xs mb-1">Share your publication link:</div>
                <div className="flex flex-col gap-2 items-center justify-center">
                  <span
                  onClick={() => {navigator.clipboard.writeText(`/view?pdf=${pdfUrl}`); toastify.success("Copied to clipboard!");}} 
                  className="bg-muted border-border rounded-2xl cursor-pointer p-2" >{`nekopress.vercel.app/view?pdf=${pdfUrl}`}</span>
                  <Button size="sm" variant="outline" onClick={() => {window.open(`/view?pdf=${pdfUrl}`, '_blank');}} className='cursor-pointer' >View</Button>
                </div>
                <Button
                className='w-full mt-2 cursor-pointer'
                onClick={() => {
                  setIsCompleted(true);
                  window.location.href = `/`; 
                }}
                >
                Finish
                </Button>
              </div>
              {thumbUrl && (
                <div className="mt-2">
                  <Image
                    src={thumbUrl}
                    alt="PDF Thumbnail"
                    width={160}
                    height={160}
                    className="mx-auto max-h-40 rounded-xl border border-border shadow"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
