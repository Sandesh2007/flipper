"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onPdfDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setPdfFile(file);
      toast.success("PDF file selected!");
    },
    []
  );

  const onThumbnailDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      setThumbnailFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      toast.success("Thumbnail selected!");
    },
    []
  );

  const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps, isDragActive: isPdfDragActive } = useDropzone({
    onDrop: onPdfDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps, isDragActive: isThumbnailDragActive } = useDropzone({
    onDrop: onThumbnailDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const handleCreatePublication = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    if (!pdfFile) {
      toast.error("Please upload a PDF file");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          toast.success("Publication created successfully!");
          // Redirect to the publication page or dashboard
          router.push("/home/publisher/publications");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Publication</h1>
          <p className="text-muted-foreground">Upload your PDF and create a stunning publication</p>
        </div>

        {uploading && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10">
                  <Upload className="w-8 h-8 text-primary animate-bounce" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Creating your publication...
                </h3>
                <div className="w-full max-w-xs mx-auto mb-4">
                  <Progress value={uploadProgress} className="h-2" />
                </div>
                <p className="text-muted-foreground">
                  {uploadProgress}% complete
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {/* Title and Description */}
          <Card>
            <CardHeader>
              <CardTitle>Publication Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter publication title"
                  disabled={uploading}
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter publication description"
                  rows={4}
                  disabled={uploading}
                />
              </div>
            </CardContent>
          </Card>

          {/* PDF Upload */}
          <Card>
            <CardHeader>
              <CardTitle>PDF File *</CardTitle>
            </CardHeader>
            <CardContent>
              {pdfFile ? (
                <div className="border-2 border-dashed border-green-200 rounded-lg p-6 text-center bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/20">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    PDF Selected
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setPdfFile(null)}
                    disabled={uploading}
                  >
                    Change PDF
                  </Button>
                </div>
              ) : (
                <div
                  {...getPdfRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 hover:shadow-md ${
                    isPdfDragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/40"
                  }`}
                >
                  <input {...getPdfInputProps()} />
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {isPdfDragActive ? "Drop your PDF here" : "Upload PDF"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {isPdfDragActive
                      ? "Release to upload your PDF"
                      : "Drag your PDF file here, or click to browse"}
                  </p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById("pdf-input")?.click();
                    }}
                    disabled={uploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose PDF
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Thumbnail Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Thumbnail Image (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              {thumbnailPreview ? (
                <div className="border-2 border-dashed border-green-200 rounded-lg p-6 text-center bg-green-50 dark:bg-green-900/20">
                  <div className="relative inline-block mb-4">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                      onClick={removeThumbnail}
                      disabled={uploading}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {thumbnailFile?.name}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setThumbnailFile(null);
                      setThumbnailPreview(null);
                    }}
                    disabled={uploading}
                  >
                    Change Thumbnail
                  </Button>
                </div>
              ) : (
                <div
                  {...getThumbnailRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 hover:shadow-md ${
                    isThumbnailDragActive
                      ? "border-primary bg-primary/5"
                      : "border-muted-foreground/25 hover:border-primary/40"
                  }`}
                >
                  <input {...getThumbnailInputProps()} />
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10">
                    <ImageIcon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {isThumbnailDragActive ? "Drop your image here" : "Upload Thumbnail"}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {isThumbnailDragActive
                      ? "Release to upload your image"
                      : "Drag your image file here, or click to browse"}
                  </p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById("thumbnail-input")?.click();
                    }}
                    disabled={uploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Create Publication Button */}
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePublication}
              disabled={uploading || !title.trim() || !description.trim() || !pdfFile}
              className="bg-gradient-hero bg-neutral-700 dark:bg-neutral-50 shadow-soft"
            >
              {uploading ? "Creating..." : "Create Publication"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 