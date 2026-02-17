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
          // Fallback for older browsers without clipboard API
          const ta = document.createElement('textarea');
          ta.value = value;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          ta.style.pointerEvents = 'none';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          ta.setSelectionRange(0, ta.value.length);

          // Use Selection API as fallback instead of deprecated execCommand
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(ta);
          selection.removeAllRanges();
          selection.addRange(range);

          // Try clipboard API first, then fall back to execCommand as last resort
          try {
            await navigator.clipboard.writeText(value);
            ok = true;
          } catch {
            // execCommand is deprecated but still needed for some older browsers
            ok = document.execCommand('copy');
          }

          selection.removeAllRanges();
          document.body.removeChild(ta);
        }
      } catch {
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
