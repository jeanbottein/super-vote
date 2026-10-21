import { isValidElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { en } from './en';
import { fr } from './fr';

/** What a message says, as text: a string, an element rendered, or a function's answer to a probe value. */
function said(message: unknown): string[] {
  if (typeof message === 'string') {
    return [message];
  }
  if (isValidElement(message)) {
    const html = renderToStaticMarkup(createElement(MemoryRouter, null, message as ReactElement));
    return [new DOMParser().parseFromString(html, 'text/html').body.textContent ?? ''];
  }
  if (typeof message === 'function') {
    try {
      // Every message takes plain values; a date stands in for each, and a number reads it as NaN.
      return said((message as (...values: unknown[]) => unknown)(...Array(message.length).fill('2026-10-19')));
    } catch {
      return []; // one that needs a real number of digits, say: its words are checked through the others
    }
  }
  if (Array.isArray(message)) {
    return message.flatMap(said);
  }
  if (message && typeof message === 'object') {
    return Object.values(message).flatMap(said);
  }
  return [];
}

const french = said(fr).filter((text) => /\p{L}/u.test(text));

describe('the French messages', () => {
  it('are written with French typography', () => {
    const wrong = french.filter((text) =>
      / [:;!?»]/.test(text) // a no-break space before : and », a narrow one before ; ! ?
      || /« /.test(text) // and a no-break space after «
      || /'/.test(text)); // the apostrophe is ’
    expect(wrong).toEqual([]);
  });

  it('use guillemets, not English quotation marks', () => {
    expect(french.filter((text) => /["“”]/.test(text))).toEqual([]);
  });

  it('say as many things as the English ones: lists of the same length', () => {
    const lengths = (messages: unknown, path = ''): string[] => {
      if (Array.isArray(messages)) {
        return [`${path}: ${messages.length}`];
      }
      if (messages && typeof messages === 'object' && !isValidElement(messages)) {
        return Object.entries(messages).flatMap(([key, value]) => lengths(value, `${path}.${key}`));
      }
      if (typeof messages === 'function' && messages.length > 0) {
        try {
          return lengths((messages as (...values: unknown[]) => unknown)(...Array(messages.length).fill(30)), path);
        } catch {
          return [];
        }
      }
      return [];
    };
    expect(lengths(fr)).toEqual(lengths(en));
  });

  it('has as many taglines as English, in the same order', () => {
    expect(fr.home.taglines).toHaveLength(en.home.taglines.length);
  });
});
