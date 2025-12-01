import { useState, useEffect } from 'react';

/**
 * Custom hook to manage column visibility state with localStorage persistence
 * @param {Array} columns - Array of column definitions
 * @param {Array} defaultVisibleKeys - Keys of columns that should be visible by default
 * @param {string} storageKey - localStorage key for persistence
 * @returns {Object} { visibleColumns, setVisibleColumns, columnsToUse }
 */
export default function useColumnVisibility(
  columns = [],
  defaultVisibleKeys = [],
  storageKey = 'clientsVisibleColumns'
) {
  const [visibleColumns, setVisibleColumns] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  });

  // Persist column visibility to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(visibleColumns));
    } catch (_) {}
  }, [visibleColumns, storageKey]);

  // Initialize default visible columns if none are saved
  useEffect(() => {
    try {
      const initKey = `${storageKey}Init`;
      const initialized = localStorage.getItem(initKey);
      if (initialized || columns.length === 0) return;

      const defaultSet = new Set(defaultVisibleKeys);
      const map = {};
      columns.forEach((c) => {
        if (!defaultSet.has(c.key)) {
          map[c.key] = false;
        }
      });

      setVisibleColumns(map);
      localStorage.setItem(initKey, '1');
    } catch (_) {}
  }, [columns, defaultVisibleKeys, storageKey]);

  // Filter columns based on visibility toggles
  const columnsToUse = columns.filter((c) => {
    const map = visibleColumns || {};
    // Always show first key in defaultVisibleKeys (e.g., CardName)
    return defaultVisibleKeys[0] && c.key === defaultVisibleKeys[0]
      ? true
      : map[c.key] !== false;
  });

  return {
    visibleColumns,
    setVisibleColumns,
    columnsToUse,
  };
}
