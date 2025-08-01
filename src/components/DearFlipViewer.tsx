'use client'
import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useDFlip from '../hooks/useDearFlip';

// Main component
const DFlipViewer = ({
    pdfURL = '/pdf/the-three-musketeers.pdf',
    pdfFile = null, // New prop for File object
    options = {}
}: {
    pdfURL?: string;
    pdfFile?: File | null;
    options?: any;
}) => {
    const containerRef = useRef(null);
    const [dataUrl, setDataUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Convert File to data URL
    useEffect(() => {
        if (pdfFile) {
            setIsLoading(true);
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setDataUrl(result);
                setIsLoading(false);
            };
            reader.onerror = () => {
                console.error('Error reading PDF file');
                setIsLoading(false);
            };
            reader.readAsDataURL(pdfFile);
        } else {
            setDataUrl(null);
        }
    }, [pdfFile]);

    // Determine which URL to use
    const finalPdfURL = dataUrl || pdfURL;

    // Use the custom hook
    useDFlip(containerRef, finalPdfURL, options);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Loading PDF...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="dflip-container"
            data-pdf-url={finalPdfURL}
        />
    );
};

DFlipViewer.propTypes = {
    pdfURL: PropTypes.string,
    pdfFile: PropTypes.object, // File object
    options: PropTypes.object
};

export default DFlipViewer;
