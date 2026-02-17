import { useEffect, useState, useCallback, useRef } from 'react';
import useIsMobile from '@hooks/useIsMobile';
import useTheme from '@/hooks/useTheme';

export const useSignatureCanvas = (onSignatureChange) => {
  const { isMobile } = useIsMobile();
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);
  const [hasSignature, setHasSignature] = useState(false);
  const { mode } = useTheme();
  const signatureCanvasRef = useRef(null);
  const signatureContextRef = useRef(null);
  const signatureWrapperRef = useRef(null);
  const signatureModeRef = useRef(null); // Track mode when signature was drawn

  const initializeSignatureCanvas = useCallback(() => {
    const canvas = signatureCanvasRef.current;
    const wrapper = signatureWrapperRef.current;

    if (!canvas || !wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const width = rect.width || wrapper.clientWidth || 320;
    const baseHeight = isMobile ? 160 : 220;
    const height = rect.height || baseHeight;
    const devicePixelRatio = window.devicePixelRatio || 1;

    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext('2d');
    if (!context) return;

    const strokeColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--tertiary-color')
        .trim() || 'currentColor';
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = isMobile ? 2 : 2.5;
    context.strokeStyle = strokeColor;
    context.imageSmoothingEnabled = false;

    const displayWidth = canvas.width / devicePixelRatio;
    const displayHeight = canvas.height / devicePixelRatio;
    context.clearRect(0, 0, displayWidth, displayHeight);
    context.beginPath();

    signatureContextRef.current = context;
    if (signatureDataUrl) {
      const image = new Image();
      image.onload = () => {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.imageSmoothingEnabled = false;

        // Only invert if current mode differs from the mode when signature was drawn
        const originalMode = signatureModeRef.current;
        const shouldInvert = originalMode && originalMode !== mode;

        if (shouldInvert) {
          context.filter = 'invert(1)';
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Reset filter
        if (shouldInvert) {
          context.filter = 'none';
        }

        context.restore();
        context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        context.imageSmoothingEnabled = false;
        context.beginPath();
      };
      image.src = signatureDataUrl;
    }
  }, [isMobile, signatureDataUrl, mode]);

  useEffect(() => {
    initializeSignatureCanvas();
    const handleResize = () => initializeSignatureCanvas();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [initializeSignatureCanvas]);

  useEffect(() => {
    setHasSignature(Boolean(signatureDataUrl));
    if (onSignatureChange) {
      onSignatureChange(signatureDataUrl);
    }
  }, [signatureDataUrl, onSignatureChange]);

  const getCanvasCoordinates = useCallback((event) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const pointerX =
      typeof event.clientX === 'number'
        ? event.clientX
        : (event.touches?.[0]?.clientX ?? 0);
    const pointerY =
      typeof event.clientY === 'number'
        ? event.clientY
        : (event.touches?.[0]?.clientY ?? 0);

    return {
      x: pointerX - rect.left,
      y: pointerY - rect.top,
    };
  }, []);

  const finishDrawing = useCallback(
    (event) => {
      if (!isDrawing) return;

      const context = signatureContextRef.current;
      if (context) {
        context.closePath();
      }

      const canvas = signatureCanvasRef.current;
      if (canvas && typeof event?.pointerId === 'number') {
        try {
          canvas.releasePointerCapture(event.pointerId);
        } catch {
          // ignore if capture was not set
        }
      }

      setIsDrawing(false);
      event?.preventDefault();
    },
    [isDrawing]
  );

  const handleSignaturePointerDown = useCallback(
    (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      const canvas = signatureCanvasRef.current;
      const context = signatureContextRef.current;
      if (!canvas || !context) return;

      const { x, y } = getCanvasCoordinates(event);
      context.beginPath();
      context.moveTo(x, y);
      setIsDrawing(true);

      if (typeof event.pointerId === 'number') {
        try {
          canvas.setPointerCapture(event.pointerId);
        } catch {
          // ignore if pointer capture not supported
        }
      }

      event.preventDefault();
    },
    [getCanvasCoordinates]
  );

  const handleSignaturePointerMove = useCallback(
    (event) => {
      if (!isDrawing) return;
      const context = signatureContextRef.current;
      if (!context) return;

      const { x, y } = getCanvasCoordinates(event);
      context.lineTo(x, y);
      context.stroke();
      event.preventDefault();
    },
    [getCanvasCoordinates, isDrawing]
  );

  const handleSignaturePointerUp = useCallback(
    (event) => {
      if (!isDrawing) return;
      const context = signatureContextRef.current;
      const canvas = signatureCanvasRef.current;
      if (context) {
        context.stroke();
      }
      finishDrawing(event);
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        setSignatureDataUrl(dataUrl);
        setHasSignature(true);
        // Store the current mode when signature is drawn
        signatureModeRef.current = mode;
      }
    },
    [finishDrawing, isDrawing, mode]
  );

  const clearSignature = useCallback(() => {
    const canvas = signatureCanvasRef.current;
    const context = signatureContextRef.current;
    if (!canvas || !context) return;

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
    context.beginPath();
    setIsDrawing(false);
    setSignatureDataUrl(null);
    setHasSignature(false);
    signatureModeRef.current = null; // Clear stored mode
  }, []);

  return {
    signatureCanvasRef,
    signatureWrapperRef,
    hasSignature,
    handleSignaturePointerDown,
    handleSignaturePointerMove,
    handleSignaturePointerUp,
    clearSignature,
  };
};
