import { createElement, isValidElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';

/** What a message says, as text: a string, an element rendered, or a function's answer to probe values. */
export function said(message: unknown, probes: readonly unknown[] = []): string[] {
  if (typeof message === 'string') {
    return [message];
  }
  if (isValidElement(message)) {
    const html = renderToStaticMarkup(createElement(MemoryRouter, null, message as ReactElement));
    return [new DOMParser().parseFromString(html, 'text/html').body.textContent ?? ''];
  }
  if (typeof message === 'function') {
    try {
      // Every message takes plain values; a date stands in for each unless probes say otherwise.
      const values = Array.from({ length: message.length }, (_, index) => probes[index] ?? '2026-10-19');
      return said((message as (...values: unknown[]) => unknown)(...values), probes);
    } catch {
      return []; // one that needs a real number of digits, say: its words are checked through the others
    }
  }
  if (Array.isArray(message)) {
    return message.flatMap((each) => said(each, probes));
  }
  if (message && typeof message === 'object') {
    return Object.values(message).flatMap((each) => said(each, probes));
  }
  return [];
}
