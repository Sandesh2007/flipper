import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// PDF utility functions
export const PDF_STORAGE_KEY = 'nekopress_pdf_data';

export interface StoredPdfData {
  name: string;
  size: number;
  lastModified: number;
  dataUrl: string;
}

export const pdfUtils = {
  // Store PDF file in localStorage as data URL
  storePdfFile: (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const pdfData: StoredPdfData = {
          name: file.name,
          size: file.size,
          lastModified: file.lastModified,
          dataUrl
        };
        localStorage.setItem(PDF_STORAGE_KEY, JSON.stringify(pdfData));
        resolve();
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Get stored PDF data from localStorage
  getStoredPdfData: (): StoredPdfData | null => {
    try {
      const stored = localStorage.getItem(PDF_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  // Clear stored PDF data
  clearStoredPdfData: (): void => {
    localStorage.removeItem(PDF_STORAGE_KEY);
  },

  // Convert File to data URL
  fileToDataUrl: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};
