'use client';
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePdfUpload } from "../PdfUploadContext";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_FILE_TYPES = ['application/pdf'];

export const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const {setPdf, storePdfFile} = usePdfUpload(); 

  function onConvertClick(file: File) {
    setPdf({file, name: file.name, lastModified: file.lastModified});
    router.push("/home/create");
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Clear previous errors
      setError(null);
      
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors.some((e: any) => e.code === 'file-too-large')) {
          setError(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
        } else if (rejection.errors.some((e: any) => e.code === 'file-invalid-type')) {
          setError('Invalid file type. Please upload a PDF file.');
        } else {
          setError('File upload failed. Please try again.');
        }
        return;
      }

      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      
      // Additional file validation
      if (file.size > MAX_FILE_SIZE) {
        setError(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
        return;
      }
      
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        setError('Invalid file type. Please upload a PDF file.');
        return;
      }

      setUploading(true);
      setUploadProgress(0);

      // Simulate upload progress with more realistic timing
      const interval = setInterval(async () => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            setUploadedFile(file);
            
            // Store the PDF file for persistence
            storePdfFile(file).catch(error => {
              console.warn('Failed to store PDF file:', error);
            });
            
            return 100;
          }
          return prev + Math.random() * 15 + 5; // More realistic progress
        });
      }, 300);
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    disabled: uploading,
    multiple: false,
  });

  const handleUploadClick = () => {
    setError(null); // Clear any previous errors
    document.getElementById("file-input")?.click();
  };

  const clearError = () => {
    setError(null);
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setError(null);
  };

  if (uploadedFile) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center bg-gradient-card shadow-soft">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Upload Complete!
          </h3>
          <p className="text-muted-foreground mb-4">
            {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={resetUpload}
            >
              Upload Another
            </Button>
            <Button
              onClick={() => onConvertClick(uploadedFile!)}
              className="bg-gradient-hero bg-neutral-700 dark:bg-neutral-50 shadow-soft cursor-pointer">
              Convert to Flipbook
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (uploading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center bg-gradient-card shadow-soft">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10">
            <Upload className="w-8 h-8 text-primary animate-bounce" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Uploading your PDF...
          </h3>
          <div className="w-full max-w-xs mx-auto mb-4">
            <Progress value={uploadProgress} className="h-2" />
          </div>
          <p className="text-muted-foreground">
            {uploadProgress}% complete
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 dark:text-red-200 text-sm font-medium">
              Upload Error
            </p>
            <p className="text-red-700 dark:text-red-300 text-sm mt-1">
              {error}
            </p>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 bg-gradient-card shadow-soft hover:shadow-upload focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          isDragActive && !isDragReject
            ? "border-primary bg-primary/5 shadow-glow"
            : isDragReject
            ? "border-red-400 bg-red-50 dark:bg-red-900/20"
            : "border-primary/20 hover:border-primary/40"
        }`}
        role="button"
        tabIndex={0}
        aria-label="Upload PDF file by dragging and dropping or clicking to browse"
      >
        <input {...getInputProps()} id="file-input" aria-describedby="upload-description" />
        <div className={`flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full transition-colors ${
          isDragReject ? "bg-red-100 dark:bg-red-900/30" : "bg-primary/10"
        }`}>
          <FileText className={`w-8 h-8 transition-colors ${
            isDragReject ? "text-red-600 dark:text-red-400" : "text-primary"
          }`} />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {isDragActive && !isDragReject
            ? "Drop your PDF here"
            : isDragReject
            ? "Invalid file type"
            : "Drag & Drop"}
        </h3>
        <p id="upload-description" className="text-muted-foreground mb-4">
          {isDragActive && !isDragReject
            ? "Release to upload your PDF"
            : isDragReject
            ? "Please select a PDF file"
            : "Drag your PDF file here, or click to browse"}
        </p>
        <div className="text-xs text-muted-foreground mb-4">
          <p>Maximum file size: {MAX_FILE_SIZE / 1024 / 1024}MB</p>
          <p>Supported format: PDF</p>
        </div>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xs text-muted-foreground">OR</span>
        </div>
        <Button
          onClick={handleUploadClick}
          className="bg-gradient-hero bg-neutral-700 dark:bg-neutral-50 shadow-soft"
          size="lg"
          disabled={uploading}
        >
          <Upload className="w-4 h-4 mr-2" />
          Browse Files
        </Button>
      </div>
    </div>
  );
};
