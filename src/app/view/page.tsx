'use client'

import PdfViewer from "@/components/PdfViewer";

export default function FlipbookPage() {
    return (
        <PdfViewer 
            title="PDF Flipbook Viewer"
            description="Upload a PDF to view it as an interactive flipbook with page-turning animations"
        />
    );
}
