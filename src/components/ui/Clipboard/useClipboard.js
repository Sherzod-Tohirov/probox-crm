import { useCallback, useRef, useState } from 'react';

export default function useClipboard(options = {}) {
  const { timeout = 1500 } = options || {};
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  const copy = useCallback(
    async (text) => {
      const value = typeof text === 'string' ? text : String(text ?? '');
      let ok = false;
      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          ok = true;
        } else {
          const ta = document.createElement('textarea');
          ta.value = value;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          ok = true;
        }
      } catch (_) {
        ok = false;
      }

      if (ok) {
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), timeout);
      }

      return ok;
    },
    [timeout]
  );

  return { copied, copy };
}
