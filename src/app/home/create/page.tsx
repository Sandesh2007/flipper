"use client"
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/database/supabase/client';
import { CheckCircle, FileText, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { Label, usePdfUpload } from '@/components';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { toastify } from '@/components/toastify';

const steps = [
  'Upload',
  'Details',
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

  const { pdf: pdfCtx, setPdf: setPdfCtx, clearPdf } = usePdfUpload();
  const router = useRouter();

  useEffect(() => {
    if (!hasShownToast) {
      if (pdfCtx && pdfCtx.file && !pdf) {
        setPdf(pdfCtx.file);
        toast.success(`PDF "${pdfCtx.name}" loaded successfully!`);
        setHasShownToast(true);
      } else if (!pdf && pdfCtx && pdfCtx.name && !pdfCtx.file) {
        // Only show error if we have metadata but not the actual file
        // This can happen if the user navigates back to this page without selecting a new file
        toastify.error("Oopsie!! your pdf fell from the stack, please reselect it.");
        setHasShownToast(true);
      }
    }
  }, [pdfCtx, pdf, hasShownToast]);

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
      } catch {}
      localStorage.removeItem('nekopress_publish_redirect');
    }
  }, [setPdfCtx]);

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
              <div className="w-full flex flex-col items-center gap-4">
                <div className="w-24 h-24 flex items-center justify-center rounded-xl bg-muted border-2 border-dashed border-border cursor-pointer hover:border-primary transition" onClick={() => pdfInputRef.current?.click()}>
                  {pdf ? <FileText className="w-10 h-10 text-primary" /> : <UploadCloud className="w-10 h-10 text-muted-foreground" />}
                </div>
                <input ref={pdfInputRef} type="file" accept="application/pdf" className="hidden" onChange={e => handlePdfChange(e.target.files?.[0] || null)} />
                <div className="text-center">
                  <div className="font-semibold text-lg">Upload your PDF</div>
                  <div className="text-muted-foreground text-xs mt-1">Drag & drop or click to select a PDF file</div>
                  {pdf && <div className="mt-2 flex items-center gap-2 border border-border rounded-lg p-2 bg-muted">{pdf.name}</div>}
                </div>
              </div>
              <Button onClick={handleNext} disabled={!pdf} className="w-full mt-4 cursor-pointer" size="lg">Next</Button>
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
                <Button onClick={handlePublish} disabled={uploading} className={uploading? '' : 'cursor-pointer'} > {uploading ? 'Publishing...' : 'Publish'} </Button>
              </div>
            </div>
          )}
          {step === 3 && published && (
            <div className="flex flex-col gap-6 items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-2">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-lg font-bold text-green-700 dark:text-green-400">Publication Created!</div>
              <div className="w-full">
                <div className="text-muted-foreground text-xs mb-1">Share your publication link:</div>
                <div className="flex gap-2 items-center justify-center">
                  <Input value={pdfUrl} readOnly className="bg-muted border-border" />
                  <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(pdfUrl)} className='cursor-pointer' >Copy</Button>
                </div>
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
