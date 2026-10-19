import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Logo from './Logo';

const ids = (svg: Element) => [...svg.querySelectorAll('[id]')].map((element) => element.id);

/** The ids that the mark's fills, strokes and clip paths point at. */
const references = (svg: Element) => [...svg.querySelectorAll('[fill], [stroke], [clip-path]')]
  .flatMap((element) => ['fill', 'stroke', 'clip-path'].map((name) => element.getAttribute(name)))
  .flatMap((value) => value?.match(/^url\(#(.+)\)$/)?.slice(1) ?? []);

describe('the logo', () => {
  it('draws each mark with its own gradients, so that two on a page never depend on each other', () => {
    const { container } = render(<><Logo /><Logo /></>);
    const [first, second] = container.querySelectorAll('svg');

    expect(ids(first)).toHaveLength(4); // paper, frame, the two halves
    expect(ids(first).filter((id) => ids(second).includes(id))).toEqual([]);
    for (const svg of [first, second]) {
      expect(references(svg)).toHaveLength(4);
      expect(references(svg).every((id) => ids(svg).includes(id))).toBe(true);
    }
  });

  it('is decorative: the name beside it says what it is', () => {
    const { container } = render(<Logo />);

    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
