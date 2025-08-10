import { useEffect, useRef } from 'react';

const useDFlip = (containerRef, pdfURL, options = {}) => {
    const flipbookRef = useRef(null);
    const initializationRef = useRef(false);

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
            // FIXED: Better initialization checks
            if (!containerRef?.current || !pdfURL || initializationRef.current) {
                return;
            }

            // Prevent multiple initializations
            initializationRef.current = true;

            try {
                // Dispose any existing flipbook first
                if (flipbookRef.current?.dispose) {
                    flipbookRef.current.dispose();
                    flipbookRef.current = null;
                }

                // Clear the container
                if (containerRef.current) {
                    containerRef.current.innerHTML = '';
                    containerRef.current.removeAttribute('data-dflip-initialized');
                }

                // Load required resources
                loadStyle('/dflip/css/dflip.min.css');
                await loadScript('/dflip/js/libs/jquery.min.js');

                // Wait until jQuery is available with timeout
                let jqueryWaitCount = 0;
                while (typeof window.jQuery === 'undefined' && jqueryWaitCount < 100) {
                    await new Promise((r) => setTimeout(r, 50));
                    jqueryWaitCount++;
                }

                if (typeof window.jQuery === 'undefined') {
                    console.error('jQuery failed to load');
                    return;
                }

                await loadScript('/dflip/js/dflip.min.js');

                // FIXED: Add additional wait for dFlip to be ready
                let dflipWaitCount = 0;
                while (typeof window.jQuery.fn.flipBook === 'undefined' && dflipWaitCount < 100) {
                    await new Promise((r) => setTimeout(r, 50));
                    dflipWaitCount++;
                }

                if (!isMounted || !containerRef.current || typeof window.jQuery.fn.flipBook === 'undefined') {
                    console.error('dFlip failed to load or component unmounted');
                    return;
                }

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

                // FIXED: Add a small delay before initializing to ensure DOM is ready
                await new Promise(resolve => setTimeout(resolve, 100));

                if (!isMounted || !containerRef.current) {
                    return;
                }

                // Mark as initialized
                containerRef.current.dataset.dflipInitialized = 'true';

                // Initialize the flipbook
                flipbookRef.current = window.jQuery(containerRef.current).flipBook(pdfURL, mergedOptions);

                console.log('DFlip initialized successfully');
            } catch (error) {
                console.error('Error initializing dFlip:', error);
            } finally {
                initializationRef.current = false;
            }
        };

        if (typeof window !== 'undefined' && pdfURL) {
            // FIXED: Add a small delay to ensure component is fully mounted
            const initTimer = setTimeout(() => {
                initFlipbook();
            }, 50);

            return () => {
                clearTimeout(initTimer);
                isMounted = false;
            };
        }

        return () => {
            isMounted = false;
        };
    }, [pdfURL]); // FIXED: Only depend on pdfURL, not options to prevent re-initialization

    // FIXED: Cleanup effect
    useEffect(() => {
        return () => {
            // Dispose flipbook on unmount
            if (flipbookRef.current?.dispose) {
                flipbookRef.current.dispose();
                flipbookRef.current = null;
            }
            
            // Reset initialization flag
            initializationRef.current = false;
            
            // Clear container
            if (containerRef?.current) {
                containerRef.current.innerHTML = '';
                containerRef.current.removeAttribute('data-dflip-initialized');
            }
        };
    }, []);

    return flipbookRef.current;
};

export default useDFlip;
