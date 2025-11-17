import { useEffect, useState, useCallback, useRef } from 'react';
import useIsMobile from '@hooks/useIsMobile';

export const useSignatureCanvas = (onSignatureChange) => {
  const { isMobile } = useIsMobile();
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);
  const [hasSignature, setHasSignature] = useState(false);
  const signatureCanvasRef = useRef(null);
  const signatureContextRef = useRef(null);
  const signatureWrapperRef = useRef(null);

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

    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = isMobile ? 2 : 2.5;
    context.strokeStyle = '#111111';
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
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        context.restore();
        context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        context.imageSmoothingEnabled = false;
        context.beginPath();
      };
      image.src = signatureDataUrl;
    }
  }, [isMobile, signatureDataUrl]);

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
      }
    },
    [finishDrawing, isDrawing]
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

