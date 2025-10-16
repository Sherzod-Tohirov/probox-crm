import { useState, useCallback, useEffect } from 'react';

const MIN_UI_SCALE = 0.5;
const MAX_UI_SCALE = 2;
const UI_SCALE_STEP = 0.1;

/**
 * Custom hook for managing global UI scale
 * @returns {Object} UI scale state and control functions
 */
export default function useUIScale() {
  const [uiScale, setUiScale] = useState(() => {
    if (typeof window === 'undefined') return 1;
    const saved = localStorage.getItem('uiScale');
    const parsed = parseFloat(saved);
    return Number.isFinite(parsed) ? parsed : 1;
  });

  const setGlobalScale = useCallback((value) => {
    const raw = typeof value === 'number' ? value : parseFloat(value);
    const clamped = Math.min(
      MAX_UI_SCALE,
      Math.max(MIN_UI_SCALE, Number.isFinite(raw) ? raw : 1)
    );
    setUiScale(clamped);
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--ui-scale', String(clamped));
    }
    localStorage.setItem('uiScale', String(clamped));
  }, []);

  const increaseScale = useCallback(() => {
    setGlobalScale(uiScale + UI_SCALE_STEP);
  }, [uiScale, setGlobalScale]);

  const decreaseScale = useCallback(() => {
    setGlobalScale(uiScale - UI_SCALE_STEP);
  }, [uiScale, setGlobalScale]);

  const resetScale = useCallback(() => setGlobalScale(1), [setGlobalScale]);

  // Initialize scale on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--ui-scale', String(uiScale));
    }
  }, []);

  return {
    uiScale,
    increaseScale,
    decreaseScale,
    resetScale,
    canIncrease: uiScale < MAX_UI_SCALE,
    canDecrease: uiScale > MIN_UI_SCALE,
    isDefault: uiScale === 1,
  };
}
