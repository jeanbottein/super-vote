import { isValidElement } from 'react';
import { describe, expect, it } from 'vitest';
import { said } from '../test/said';
import { en } from './en';
import { fr } from './fr';

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
});
