'use client'
import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useDFlip from '../hooks/useDearFlip';
import { useTheme } from 'next-themes';

// Main component
const DFlipViewer = ({
    pdfFile = null,
    options = {}
}: {
    pdfFile?: File | null;
    options?: any;
}) => {
    const containerRef = useRef(null);
    const [dataUrl, setDataUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const { theme, resolvedTheme } = useTheme();

    // Convert File to data URL
    useEffect(() => {
        if (pdfFile) {
            setIsLoading(true);
            setIsReady(false);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setDataUrl(result);
                setIsLoading(false);
                // Add a small delay to ensure the data URL is fully processed
                // Or else it will cause `pdf not loaded error` which is very annoying ;)
                setTimeout(() => setIsReady(true), 100);
            };
            reader.onerror = () => {
                console.error('Error reading PDF file');
                setIsLoading(false);
                setIsReady(false);
            };
            reader.readAsDataURL(pdfFile);
        } else {
            setDataUrl(null);
            setIsReady(false);
        }
    }, [pdfFile]);

    // Get theme-aware colors
    const getThemeColors = () => {
        if (typeof window === 'undefined') return {};
        
        const isDark = resolvedTheme === 'dark';
        
        return {
            backgroundColor: isDark 
                ? 'rgb(23, 23, 23)' 
                : 'rgb(248, 250, 252)', 
            controlsColor: isDark 
                ? 'rgb(255, 255, 255)'
                : 'rgb(64, 64, 64)',
            textColor: isDark 
                ? 'rgb(255, 255, 255)'
                : 'rgb(23, 23, 23)'
        };
    };

    // Merge theme-aware options
    const themeAwareOptions = {
        ...getThemeColors(),
        ...options
    };

    // Use the custom hook only when dataUrl is available and ready
    useDFlip(containerRef, (isReady && dataUrl) ? dataUrl : '', themeAwareOptions);

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
            data-pdf-url={dataUrl}
        />
    );
};

DFlipViewer.propTypes = {
    pdfFile: PropTypes.object,
    options: PropTypes.object
};

export default DFlipViewer;
