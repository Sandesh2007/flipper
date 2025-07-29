"use client"
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/utils/supabase/client';
import { CheckCircle, FileText, Image as ImageIcon, UploadCloud, ArrowRight, ArrowLeft, Share2 } from 'lucide-react';

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
  const [thumb, setThumb] = useState<File | null>(null);
  const [published, setPublished] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [thumbUrl, setThumbUrl] = useState('');
  const [error, setError] = useState('');
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handlePublish = async () => {
    setError('');
    setUploading(true);
    const supabase = createClient();
    let pdfPath = '';
    let thumbPath = '';
    try {
      if (pdf) {
        pdfPath = `pdfs/${Date.now()}_${pdf.name}`;
        const { error: uploadError } = await supabase.storage.from('publications').upload(pdfPath, pdf);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('publications').getPublicUrl(pdfPath);
        setPdfUrl(urlData.publicUrl);
      }
      if (thumb) {
        thumbPath = `thumbs/${Date.now()}_${thumb.name}`;
        const { error: uploadError } = await supabase.storage.from('publications').upload(thumbPath, thumb);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('publications').getPublicUrl(thumbPath);
        setThumbUrl(urlData.publicUrl);
      }
      setPublished(true);
      handleNext();
    } catch (e: any) {
      setError(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

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
                <input ref={pdfInputRef} type="file" accept="application/pdf" className="hidden" onChange={e => setPdf(e.target.files?.[0] || null)} />
                <div className="text-center">
                  <div className="font-semibold text-lg">Upload your PDF</div>
                  <div className="text-muted-foreground text-xs mt-1">Drag & drop or click to select a PDF file</div>
                  {pdf && <div className="mt-2 text-sm text-primary font-medium">{pdf.name}</div>}
                </div>
              </div>
              <Button onClick={handleNext} disabled={!pdf} className="w-full mt-4" size="lg">Next</Button>
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
                <Button variant="secondary" onClick={handleBack}>Back</Button>
                <Button onClick={handleNext} disabled={!title || !description}>Next</Button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                {thumb ? (
                  <img src={URL.createObjectURL(thumb)} alt="Thumbnail preview" className="w-24 h-24 object-cover rounded-xl border border-border shadow" />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center rounded-xl bg-muted border border-border">
                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <div className="font-semibold text-lg text-foreground">{title}</div>
                  <div className="text-muted-foreground text-sm mt-1">{description}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-primary text-xs font-medium">{pdf?.name}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-between mt-2">
                <Button variant="secondary" onClick={handleBack} disabled={uploading}>Back</Button>
                <Button onClick={handlePublish} disabled={uploading}>{uploading ? 'Publishing...' : 'Publish'}</Button>
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
                  <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(pdfUrl)}>Copy</Button>
                </div>
              </div>
              {thumbUrl && <div className="mt-2"><img src={thumbUrl} alt="PDF Thumbnail" className="mx-auto max-h-40 rounded-xl border border-border shadow" /></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 