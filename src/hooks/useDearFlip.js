import { useEffect, useRef } from 'react';

const useDFlip = (containerRef, pdfURL, options = {}) => {
    const flipbookRef = useRef(null);

    const loadScript = (src) => {
        if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve();

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    };

    const loadStyle = (href) => {
        if (document.querySelector(`link[href="${href}"]`)) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href;
        document.head.appendChild(link);
    };

    useEffect(() => {
        let isMounted = true;

        const initFlipbook = async () => {
            if (!containerRef?.current || containerRef.current.dataset.dflipInitialized === 'true') return;

            try {
                // Load required resources
                loadStyle('/dflip/css/dflip.min.css');
                await loadScript('/dflip/js/libs/jquery.min.js');

                // Wait until jQuery is available
                while (typeof window.jQuery === 'undefined') {
                    await new Promise((r) => setTimeout(r, 50));
                }

                await loadScript('/dflip/js/dflip.min.js');

                if (!isMounted || !containerRef.current) return;

                const defaultOptions = {
                    webgl: true,
                    autoEnableOutline: false,
                    autoEnableThumbnail: false,
                    overwritePDFOutline: false,
                    soundEnable: true,
                    backgroundColor: "rgb(217, 217, 217)",
                    autoPlay: false,
                    autoPlayDuration: 5000,
                    autoPlayStart: false,
                    hard: 'none',
                    maxTextureSize: 1600,
                    pageMode: window.innerWidth <= 768 ? 1 : 2,
                    singlePageMode: window.innerWidth <= 768 ? 1 : 0,
                    responsive: true,
                    transparent: false,
                    direction: 1,
                    duration: 800,
                    zoom: 1,
                    enableSound: true,
                };

                const mergedOptions = { ...defaultOptions, ...options };

                // Mark as initialized
                containerRef.current.dataset.dflipInitialized = 'true';

                // Initialize the flipbook
                flipbookRef.current = window.jQuery(containerRef.current).flipBook(pdfURL, mergedOptions);
            } catch (error) {
                console.error('Error initializing dFlip:', error);
            }
        };

        if (typeof window !== 'undefined') {
            initFlipbook();
        }

        return () => {
            isMounted = false;

            // Dispose flipbook if applicable
            if (flipbookRef.current?.dispose) {
                flipbookRef.current.dispose();
                if (containerRef?.current) {
                    containerRef.current.dataset.dflipInitialized = 'false';
                }
            }
        };
    }, [pdfURL]);

    return flipbookRef.current;
};

export default useDFlip;
