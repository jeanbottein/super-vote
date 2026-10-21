import { useEffect, useRef, useState } from 'react';

/**
 * Copies a text to the clipboard, and says so for two seconds. copy answers
 * whether it could: without clipboard access (plain http, a refusal), the
 * caller offers the text to copy by hand.
 */
export function useCopy(): { copied: boolean; copy(text: string): Promise<boolean> } {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return false;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
    return true;
  }

  return { copied, copy };
}
