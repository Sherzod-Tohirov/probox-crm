import { useState, useCallback, useEffect } from 'react';

const TABLE_DENSITY_OPTIONS = [
  'xxcompact',
  'xcompact',
  'compact',
  'normal',
  'large',
  'xlarge',
];

/**
 * Custom hook for managing table density
 * @param {string} storageKey - sessionStorage key for persistence
 * @returns {Object} Table density state and control functions
 */
export default function useTableDensity(storageKey = 'tableDensity') {
  const [tableDensity, setTableDensity] = useState(() => {
    if (typeof window === 'undefined') return 'normal';
    const saved = sessionStorage.getItem(storageKey);
    return saved && TABLE_DENSITY_OPTIONS.includes(saved) ? saved : 'normal';
  });

  const increaseDensity = useCallback(() => {
    setTableDensity((prev) => {
      const idx = TABLE_DENSITY_OPTIONS.indexOf(prev);
      if (idx === -1) return 'normal';
      return TABLE_DENSITY_OPTIONS[
        Math.min(idx + 1, TABLE_DENSITY_OPTIONS.length - 1)
      ];
    });
  }, []);

  const decreaseDensity = useCallback(() => {
    setTableDensity((prev) => {
      const idx = TABLE_DENSITY_OPTIONS.indexOf(prev);
      if (idx === -1) return 'normal';
      return TABLE_DENSITY_OPTIONS[Math.max(idx - 1, 0)];
    });
  }, []);

  const resetDensity = useCallback(() => setTableDensity('normal'), []);

  // Persist to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(storageKey, tableDensity);
    }
  }, [tableDensity, storageKey]);

  return {
    tableDensity,
    tableDensityClass: `table-density-${tableDensity}`,
    increaseDensity,
    decreaseDensity,
    resetDensity,
    isMinDensity: tableDensity === TABLE_DENSITY_OPTIONS[0],
    isMaxDensity:
      tableDensity === TABLE_DENSITY_OPTIONS[TABLE_DENSITY_OPTIONS.length - 1],
    isDefaultDensity: tableDensity === 'normal',
  };
}
