import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Logo from './Logo';

describe('the logo', () => {
  it('is decorative: the name beside it says what it is', () => {
    const { container } = render(<Logo />);

    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });
});
