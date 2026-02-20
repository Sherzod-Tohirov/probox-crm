import { useEffect, useRef } from 'react';

const POLL_INTERVAL_MS = 5 * 60 * 1000;
const SS_KEY = 'probox.app.manifestHash';
const MANIFEST_URL = '/.vite/manifest.json';

async function fetchManifestHash() {
  try {
    const res = await fetch(`${MANIFEST_URL}?t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text.trim().slice(0, 64);
  } catch {
    return null;
  }
}

export default function useAppUpdateChecker() {
  const timerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const hash = await fetchManifestHash();
      if (!hash || cancelled) return;

      const stored = sessionStorage.getItem(SS_KEY);
      if (!stored) {
        sessionStorage.setItem(SS_KEY, hash);
        return;
      }

      if (stored !== hash) {
        sessionStorage.setItem(SS_KEY, hash);
        window.location.reload();
      }
    }

    async function poll() {
      const hash = await fetchManifestHash();
      if (!hash || cancelled) return;

      const stored = sessionStorage.getItem(SS_KEY);
      if (stored && stored !== hash) {
        sessionStorage.setItem(SS_KEY, hash);
        window.location.reload();
      }
    }

    init();
    timerRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(timerRef.current);
    };
  }, []);
}
