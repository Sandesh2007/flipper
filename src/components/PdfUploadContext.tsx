'use client'
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface PdfFile {
  file: File | null;
  name: string;
  lastModified: number;
}

interface PdfUploadContextType {
  pdf: PdfFile | null;
  setPdf: (pdf: PdfFile | null) => void;
  clearPdf: () => void;
}

const PdfUploadContext = createContext<PdfUploadContextType | undefined>(undefined);

const PDF_STORAGE_KEY = 'nekopress_pdf_upload';

export const PdfUploadProvider = ({ children }: { children: ReactNode }) => {
  const [pdf, setPdfState] = useState<PdfFile | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(PDF_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // File cannot be restored, but metadata can be used to prompt re-selection
        setPdfState(parsed);
      } catch {}
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (pdf) {
      // File objects can't be stringified, so only store metadata
      localStorage.setItem(PDF_STORAGE_KEY, JSON.stringify({
        name: pdf.name,
        lastModified: pdf.lastModified,
      }));
    } else {
      localStorage.removeItem(PDF_STORAGE_KEY);
    }
  }, [pdf]);

  const setPdf = (pdf: PdfFile | null) => {
    setPdfState(pdf);
  };

  const clearPdf = () => {
    setPdfState(null);
  };

  return (
    <PdfUploadContext.Provider value={{ pdf, setPdf, clearPdf }}>
      {children}
    </PdfUploadContext.Provider>
  );
};

export const usePdfUpload = () => {
  const ctx = useContext(PdfUploadContext);
  if (!ctx) throw new Error('usePdfUpload must be used within a PdfUploadProvider');
  return ctx;
}; 