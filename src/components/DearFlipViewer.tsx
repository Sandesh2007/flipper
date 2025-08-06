'use client'
import { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import useDFlip from '../hooks/useDearFlip';
import { useTheme } from 'next-themes';

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
    const { resolvedTheme } = useTheme();
    const fileProcessedRef = useRef<File | null>(null);

    const convertFileToDataUrl = useCallback((file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                resolve(result);
            };
            reader.onerror = () => {
                reject(new Error('Error reading PDF file'));
            };
            reader.readAsDataURL(file);
        });
    }, []);

    useEffect(() => {
        if (pdfFile && pdfFile !== fileProcessedRef.current) {
            setIsLoading(true);
            setIsReady(false);
            fileProcessedRef.current = pdfFile;

            convertFileToDataUrl(pdfFile)
                .then((result) => {
                    setDataUrl(result);
                    setIsLoading(false);
                    setTimeout(() => setIsReady(true), 100);
                })
                .catch((error) => {
                    console.error('Error reading PDF file:', error);
                    setIsLoading(false);
                    setIsReady(false);
                });
        } else if (!pdfFile) {
            setDataUrl(null);
            setIsReady(false);
            fileProcessedRef.current = null;
        }
    }, [pdfFile, convertFileToDataUrl]);

    const themeColors = useMemo(() => {
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
    }, [resolvedTheme]);

    const memoizedOptions = useMemo(() => ({
        ...themeColors,
        ...options
    }), [themeColors, options]);

    // Only initialize when we have both dataUrl and isReady
    const shouldInitialize = isReady && dataUrl && !isLoading;
    const initializationUrl = shouldInitialize ? dataUrl : '';

    useDFlip(containerRef, initializationUrl, memoizedOptions);

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
