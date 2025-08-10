let pdfjsLib: any = null;

async function initializePdfJs() {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js can only be used in the browser');
  }
  
  if (!pdfjsLib) {
    try {
      if (typeof (window as any).pdfjsLib !== 'undefined') {
        pdfjsLib = (window as any).pdfjsLib;
      } else {

        const script = document.createElement('script');
        script.src = '/dflip/js/libs/pdf.min.js';
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load PDF.js'));
        });
        
        pdfjsLib = (window as any).pdfjsLib;
      }
      
      // Configure worker path to use dflip's worker
      if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/dflip/js/libs/pdf.worker.min.js';
      }
      
    } catch (error) {
      console.error('Failed to initialize PDF.js:', error);
      throw new Error(`Failed to initialize PDF.js: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  if (!pdfjsLib) {
    throw new Error('PDF.js library not available');
  }
  
  return pdfjsLib;
}

export interface ThumbnailOptions {
  width?: number;
  height?: number;
  page?: number;
  quality?: number;
  scale?: number;
}

export interface ThumbnailResult {
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

/**
 * Validates the browser environment and required APIs
 */
function validateBrowserEnvironment(): void {
  if (typeof window === 'undefined') {
    throw new Error('PDF thumbnail generation can only be used in the browser');
  }
  
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    throw new Error('Canvas API not available');
  }
  
  if (!window.File || !window.FileReader || !window.Blob) {
    throw new Error('File API not available');
  }
}

/**
 * Generates a thumbnail from a PDF file
 * @param file - The PDF file to generate thumbnail from
 * @param options - Thumbnail generation options
 * @returns Promise resolving to thumbnail data
 */
export async function generatePdfThumbnail(
  file: File,
  options: ThumbnailOptions = {}
): Promise<ThumbnailResult> {
  // Validate environment
  validateBrowserEnvironment();
  
  if (!file || typeof file.arrayBuffer !== 'function') {
    throw new Error('Invalid file object provided');
  }
  
  if (file.type !== 'application/pdf') {
    throw new Error('File must be a PDF');
  }

  const {
    width = 300,
    height = 400,
    page = 1,
    quality = 0.8,
    scale
  } = options;

  try {
    // Initialize PDF.js
    const pdfjs = await initializePdfJs();
    
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document
    const loadingTask = pdfjs.getDocument({
      data: arrayBuffer,
      disableAutoFetch: true,
      disableStream: true
    });
    
    const pdf = await loadingTask.promise;
    
    const pageNum = Math.min(Math.max(1, page), pdf.numPages);
    
    const pdfPage = await pdf.getPage(pageNum);
    
    // Calculate viewport
    let viewport;
    if (scale) {
      viewport = pdfPage.getViewport({ scale });
    } else {
      // Calculate scale to fit within specified dimensions while maintaining aspect ratio
      const originalViewport = pdfPage.getViewport({ scale: 1 });
      const calculatedScale = Math.min(width / originalViewport.width, height / originalViewport.height);
      viewport = pdfPage.getViewport({ scale: calculatedScale });
    }
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      throw new Error('Failed to get canvas context');
    }
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      renderTextLayer: false,
      renderAnnotations: false
    };
    
    await pdfPage.render(renderContext).promise;
    
    // Convert canvas to blob and data URL
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      }, 'image/jpeg', quality);
    });
    
    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    
    // Clean up
    pdfPage.cleanup();
    
    return {
      dataUrl,
      blob,
      width: viewport.width,
      height: viewport.height
    };
    
  } catch (error) {
    console.error('Error generating PDF thumbnail:', error);
    throw new Error(`Failed to generate thumbnail: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generates a thumbnail data URL from a PDF file
 * @param file - The PDF file to generate thumbnail from
 * @param options - Thumbnail generation options
 * @returns Promise resolving to thumbnail data URL
 */
export async function generatePdfThumbnailDataUrl(
  file: File,
  options: ThumbnailOptions = {}
): Promise<string> {
  validateBrowserEnvironment();
  const result = await generatePdfThumbnail(file, options);
  return result.dataUrl;
}

/**
 * Generates a thumbnail blob from a PDF file
 * @param file - The PDF file to generate thumbnail from
 * @param options - Thumbnail generation options
 * @returns Promise resolving to thumbnail blob
 */
export async function generatePdfThumbnailBlob(
  file: File,
  options: ThumbnailOptions = {}
): Promise<Blob> {
  validateBrowserEnvironment();
  const result = await generatePdfThumbnail(file, options);
  return result.blob;
}

/**
 * Utility function to check if PDF.js is already loaded
 * @returns boolean indicating if PDF.js is available
 */
export function isPdfJsLoaded(): boolean {
  return typeof window !== 'undefined' && 
         typeof (window as any).pdfjsLib !== 'undefined';
}

/**
 * Preload PDF.js library
 * @returns Promise that resolves when PDF.js is loaded
 */
export async function preloadPdfJs(): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('Can only preload PDF.js in browser environment');
  }
  
  await initializePdfJs();
}
