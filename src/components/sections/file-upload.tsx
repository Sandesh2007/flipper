'use client';
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle, X, Sparkles, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePdfUpload } from "../PdfUploadContext";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const ACCEPTED_EXTENSIONS = [
  '.pdf', '.epub',
];

export const FileUpload: React.FC<{ onFileSelected?: (file: File) => void }> = ({ onFileSelected }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setPdf, storePdfFile } = usePdfUpload();

  function onConvertClick(file: File) {
    setPdf({ file, name: file.name, lastModified: file.lastModified });
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
          setError('Invalid file type. Please upload a supported file: PDF, EPUB, image, CBZ, or ZIP.');
        } else {
          setError('File upload failed. Please try again.');
        }
        return;
      }

      // Instead of handling upload here, redirect to /home/create
      // for better user experience
      if (acceptedFiles.length > 0) {
        router.push('/home/create?from=upload');
        return;
      }

      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Additional file validation
      if (file.size > MAX_FILE_SIZE) {
        setError(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
        return;
      }

      // Validate by extension as well (for browsers that don't set type)
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ACCEPTED_EXTENSIONS.some(e => file.name.toLowerCase().endsWith(e))) {
        setError('Invalid file type. Please upload a supported file: PDF, EPUB, image, CBZ, or ZIP.');
        return;
      }

      setUploading(true);
      setUploadProgress(0);

      // Simulate upload progress with more realistic timing
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            setUploadedFile(file);

            // Store the PDF file for persistence
            storePdfFile(file).catch((error) => {
              console.warn('Failed to store file:', error);
            });

            return 100;
          }

          return Math.min(prev + 7 + Math.random() * 10, 100);
        });
      }, 300);

    },
    [router]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/epub+zip": [".epub"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/bmp": [".bmp"],
      "image/webp": [".webp"],
      "image/svg+xml": [".svg"],
      "image/tiff": [".tiff"],
      "image/x-icon": [".ico"],
      "image/heic": [".heic"],
      "application/vnd.comicbook+zip": [".cbz"],
      "application/zip": [".zip"],
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
        <div className="relative overflow-hidden rounded-2xl glass border border-border/50 shadow-soft p-8 text-center">
          {/* Success Background Animation */}
          <div className="absolute inset-0 bg-green-500/10 animate-pulse-slow"></div>
          <div className="relative">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-green-500 shadow-glow animate-scale-in">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3 animate-fade-in">
              Upload Complete!
            </h3>
            <p className="text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
            <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Button
                variant="outline"
                onClick={resetUpload}
                className=" hover:scale-105"
              >
                Upload Another
              </Button>
              <Button
                onClick={() => onConvertClick(uploadedFile!)}
                className="bg-blue-500 hover:shadow-glow text-white shadow-soft hover:scale-105"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Convert to Flipbook
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (uploading) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl glass border border-border/50 shadow-soft p-8 text-center">
          {/* Upload Background Animation */}
          <div className="absolute inset-0 bg-blue-500/10 animate-pulse-slow"></div>
          <div className="relative">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-blue-500 shadow-glow animate-bounce-slow">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4 animate-fade-in">
              Uploading your PDF...
            </h3>
            <div className="w-full max-w-md mx-auto mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Progress value={uploadProgress} className="h-3 bg-muted" />
            </div>
            <p className="text-muted-foreground animate-pulse-slow">
              {Math.round(uploadProgress)}% complete
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-6 bg-red-50 glass dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-4 animate-fade-in">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 dark:text-red-200 text-sm font-medium mb-1">
              Upload Error
            </p>
            <p className="text-red-700 dark:text-red-300 text-sm">
              {error}
            </p>
          </div>
          <button
            onClick={clearError}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
            aria-label="Dismiss error"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`relative overflow-hidden rounded-2xl p-8 text-center cursor-pointer transition-all duration-500 glass border-2 border-dashed shadow-soft hover:shadow-upload focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isDragActive && !isDragReject
            ? "border-blue-500 bg-blue-500/5 shadow-glow scale-105"
            : isDragReject
              ? "border-red-400 bg-red-50 dark:bg-red-900/20"
              : "border-blue-500/30 hover:border-blue-500/60 hover:scale-[1.02]"
          }`}
        role="button"
        tabIndex={0}
        aria-label="Upload PDF file by dragging and dropping or clicking to browse"
      >
        {/* Background Animation */}
        <div className="absolute inset-0 bg-blue-500/5 animate-pulse-slow"></div>

        <input {...getInputProps()} id="file-input" aria-describedby="upload-description" />
        <div className="relative">
          <div className={`flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-2xl transition-all duration-300 ${isDragReject
              ? "bg-red-100 dark:bg-red-900/30 animate-wiggle"
              : "bg-blue-500 shadow-glow"
            }`}>
            <FileText className={`w-12 h-12 transition-colors ${isDragReject ? "text-red-600 dark:text-red-400" : "text-white"
              }`} />
          </div>

          <h3 className="text-2xl font-bold text-foreground mb-4">
            {isDragActive && !isDragReject
              ? "Drop your PDF here"
              : isDragReject
                ? "Invalid file type"
                : "Drag & Drop your PDF"}
          </h3>

          <p id="upload-description" className="text-muted-foreground mb-6 text-lg">
            {isDragActive && !isDragReject
              ? "Release to upload your PDF"
              : isDragReject
                ? "Please select a PDF file"
                : "Drag your PDF file here, or click to browse"}
          </p>

          <div className="text-sm text-muted-foreground mb-8 space-y-1">
            <p>Maximum file size: {MAX_FILE_SIZE / 1024 / 1024}MB</p>
            <p>Supported formats: PDF, EPUB</p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-muted-foreground px-4">OR</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <Button
            onClick={handleUploadClick}
            className="bg-blue-500 hover:shadow-glow text-white shadow-soft hover:scale-105 px-8 py-4 text-lg"
            size="lg"
            disabled={uploading}
          >
            <Upload className="w-5 h-5 mr-3" />
            Browse Files
          </Button>
        </div>
      </div>
    </div>
  );
};
