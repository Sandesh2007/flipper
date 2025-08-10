'use client'

import { useState, useEffect } from 'react';
import DFlipViewer from "./DearFlipViewer";
import { usePdfUpload } from "./PdfUploadContext";
import { Button } from "./ui/button";
import { Upload, FileText, X, Download, Eye } from "lucide-react";
import { pdfUtils } from "@/lib/utils";
import toast from "react-hot-toast";

interface PdfViewerProps {
  title?: string;
  description?: string;
  showUploadInterface?: boolean;
  className?: string;
}

export default function PdfViewer({ 
  title = "PDF Flipbook Viewer",
  description = "Upload a PDF to view it as an interactive flipbook",
  showUploadInterface = true,
  className = ""
}: PdfViewerProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { 
    pdf: pdfContext, 
    storedPdfData, 
    setPdf, 
    clearPdf, 
    storePdfFile, 
    loadStoredPdf 
  } = usePdfUpload();

  // Check for PDF in context on component mount
  useEffect(() => {
    if (pdfContext?.file) {
      setUploadedFile(pdfContext.file);
    }
  }, [pdfContext]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setIsUploading(true);
      
      try {
        // Store in localStorage using context
        await storePdfFile(file);
        
        // Update state
        setUploadedFile(file);
        setPdf({ file, name: file.name, lastModified: file.lastModified });
        
      } catch (error) {
        toast.error('Failed to upload PDF. Please try again.');
        console.error('Upload error:', error);
      } finally {
        setIsUploading(false);
      }
    } else if (file) {
      toast.error('Please select a valid PDF file.');
    }
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    clearPdf();
    toast.success('PDF cleared successfully');
  };

  const handleLoadStoredPdf = async () => {
    try {
      const file = await loadStoredPdf();
      if (file) {
        setUploadedFile(file);
        toast.error('Failed to load stored PDF');
      }
    } catch (error) {
      console.error('Error loading stored PDF:', error);
      toast.error('Failed to load stored PDF');
    }
  };

  const currentPdfFile = uploadedFile;
  const currentPdfName = uploadedFile?.name || storedPdfData?.name;
  const currentPdfSize = uploadedFile?.size || storedPdfData?.size;

  return (
    <div className={`p-4 max-w-6xl mx-auto ${className}`}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {!currentPdfFile && !storedPdfData ? (
        showUploadInterface ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Upload your PDF</h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop your PDF file here or click to browse
                </p>
              </div>
              <Button 
                onClick={() => document.getElementById('pdf-upload')?.click()}
                disabled={isUploading}
                className="bg-primary hover:bg-primary/90 cursor-pointer"
              >
                {isUploading ? 'Uploading...' : 'Choose PDF'}
              </Button>
              <input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No PDF available to view</p>
          </div>
        )
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{currentPdfName}</p>
                <p className="text-sm text-muted-foreground">
                  {currentPdfSize ? pdfUtils.formatFileSize(currentPdfSize) : ''}
                  {storedPdfData && ' (Stored)'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {storedPdfData && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadStoredPdf}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Load
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFile}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {uploadedFile && (
            <div className="border rounded-lg overflow-hidden">
              <DFlipViewer
                pdfFile={uploadedFile}
                options={{
                  webgl: true,
                  autoEnableOutline: true,
                  backgroundColor: "rgb(245, 245, 245)",
                  pageMode: window.innerWidth <= 768 ? 1 : 2,
                  singlePageMode: window.innerWidth <= 768 ? 1 : 0,
                  responsive: true
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
