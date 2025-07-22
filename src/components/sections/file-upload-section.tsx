import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  onFileUpload?: (file: File) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            setUploadedFile(file);
            onFileUpload?.(file);
            toast.success("PDF uploaded successfully!");
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const handleUploadClick = () => {
    document.getElementById("file-input")?.click();
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
              onClick={() => {
                setUploadedFile(null);
                setUploadProgress(0);
              }}
            >
              Upload Another
            </Button>
            <Button className="bg-gradient-hero bg-neutral-700 dark:bg-neutral-50 shadow-soft">
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
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 bg-gradient-card shadow-soft hover:shadow-upload ${
          isDragActive
            ? "border-primary bg-primary/5 shadow-glow"
            : "border-primary/20 hover:border-primary/40"
        }`}
      >
        <input {...getInputProps()} id="file-input" />
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10">
          <FileText className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {isDragActive ? "Drop your PDF here" : "Drag & Drop"}
        </h3>
        <p className="text-muted-foreground mb-4">
          {isDragActive
            ? "Release to upload your PDF"
            : "Drag your PDF file here, or click to browse"}
        </p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xs text-muted-foreground">OR</span>
        </div>
        <Button
          onClick={handleUploadClick}
          className="bg-gradient-hero bg-neutral-700 dark:bg-neutral-50 shadow-soft"
          size="lg"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload file
        </Button>
      </div>
    </div>
  );
};