# PDF Viewer Component

This component provides a complete interface for uploading and viewing PDFs as interactive flipbooks using the DFlip library.

## Features

- **File Upload**: Drag and drop or click to upload PDF files
- **Local Storage**: PDFs are automatically stored in localStorage for persistence
- **Interactive Viewer**: Uses DFlip library for page-turning animations
- **Responsive Design**: Adapts to different screen sizes
- **Context Integration**: Works with PdfUploadContext for state management

## Usage

### Basic Usage

```tsx
import PdfViewer from "@/components/PdfViewer";

function MyPage() {
  return (
    <PdfViewer 
      title="My PDF Viewer"
      description="Upload and view your PDFs"
    />
  );
}
```

### Advanced Usage

```tsx
import PdfViewer from "@/components/PdfViewer";

function MyPage() {
  return (
    <PdfViewer 
      title="Custom PDF Viewer"
      description="View your documents"
      showUploadInterface={false} // Hide upload interface
      className="my-custom-class"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "PDF Flipbook Viewer" | Title displayed at the top |
| `description` | string | "Upload a PDF to view it as an interactive flipbook" | Description text |
| `showUploadInterface` | boolean | true | Whether to show the upload interface |
| `className` | string | "" | Additional CSS classes |

## DFlipViewer Component

The underlying DFlipViewer component can be used directly for more control:

```tsx
import DFlipViewer from "@/components/DearFlipViewer";

function MyComponent() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  return (
    <DFlipViewer
      pdfFile={pdfFile}
      pdfURL="/path/to/default.pdf" // Fallback URL
      options={{
        webgl: true,
        autoEnableOutline: true,
        backgroundColor: "rgb(245, 245, 245)",
        responsive: true
      }}
    />
  );
}
```

## PDF Utilities

The `pdfUtils` object provides helper functions for PDF handling:

```tsx
import { pdfUtils } from "@/lib/utils";

// Store a PDF file in localStorage
await pdfUtils.storePdfFile(file);

// Get stored PDF data
const stored = pdfUtils.getStoredPdfData();

// Clear stored PDF data
pdfUtils.clearStoredPdfData();

// Convert file to data URL
const dataUrl = await pdfUtils.fileToDataUrl(file);

// Format file size
const size = pdfUtils.formatFileSize(1024 * 1024); // "1 MB"
```

## Context Integration

The component integrates with `PdfUploadContext` for state management:

```tsx
import { usePdfUpload } from "@/components/PdfUploadContext";

function MyComponent() {
  const { 
    pdf, 
    storedPdfData, 
    setPdf, 
    clearPdf, 
    storePdfFile, 
    loadStoredPdf 
  } = usePdfUpload();

  // Use the context methods
  const handleUpload = async (file) => {
    await storePdfFile(file);
    setPdf({ file, name: file.name, lastModified: file.lastModified });
  };
}
```

## Local Storage

PDFs are automatically stored in localStorage with the following structure:

```json
{
  "name": "document.pdf",
  "size": 1024000,
  "lastModified": 1640995200000,
  "dataUrl": "data:application/pdf;base64,JVBERi0xLjQK..."
}
```

## Browser Compatibility

- Modern browsers with File API support
- Requires JavaScript enabled
- Local storage must be available 