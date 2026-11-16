import { SystemBarsStyle } from '@capacitor/core';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PreferencesProvider } from '../preferences/preferences';
import NativeShell, { chromiumVersion, pathIn, systemBarsStyleFor } from './NativeShell';

/** What the app's listeners receive from Android, captured as NativeShell registers them. */
const listeners = vi.hoisted(() => new Map<string, (event: never) => void>());
const minimizeApp = vi.hoisted(() => vi.fn(async () => {}));
vi.mock('@capacitor/app', () => ({
  App: {
    minimizeApp,
    addListener: async (name: string, listener: (event: never) => void) => {
      listeners.set(name, listener);
      return { remove: async () => { listeners.delete(name); } };
    },
  },
}));
vi.mock('@capacitor/core', async (actual) => ({
  ...(await actual<typeof import('@capacitor/core')>()),
  SystemBars: { setStyle: async () => {} },
}));

/** Android's back button, as the app is told of it. */
function pressBack(canGoBack: boolean) {
  render(<PreferencesProvider><MemoryRouter><NativeShell /></MemoryRouter></PreferencesProvider>);
  (listeners.get('backButton') as (event: { canGoBack: boolean }) => void)({ canGoBack });
}

describe('the Android back button', () => {
  afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
  });

  it('closes an open dialog first, and stays on the page', () => {
    const dialog = document.body.appendChild(document.createElement('dialog'));
    dialog.setAttribute('open', '');
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {});

    pressBack(true);

    expect(dialog.open).toBe(false);
    expect(back).not.toHaveBeenCalled();
  });

  it('goes back a page', () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {});

    pressBack(true);

    expect(back).toHaveBeenCalled();
    expect(minimizeApp).not.toHaveBeenCalled();
  });

  it('leaves the app in the background from its first page', () => {
    pressBack(false);

    expect(minimizeApp).toHaveBeenCalled();
  });
});

describe('a link that opens the app', () => {
  it('leads to the same page, its invitation kept', () => {
    expect(pathIn('https://super-vote.org/p/AbC123#invitation=xyz')).toBe('/p/AbC123#invitation=xyz');
  });
});

describe('the status bar', () => {
  it('follows the appearance chosen in the app, or the phone when it follows the phone', () => {
    expect(systemBarsStyleFor('dark', 140)).toBe(SystemBarsStyle.Dark);
    expect(systemBarsStyleFor('light', 140)).toBe(SystemBarsStyle.Light);
    expect(systemBarsStyleFor('system', 140)).toBe(SystemBarsStyle.Default);
  });

  it('follows the phone under a WebView that keeps the page out from under the bars', () => {
    expect(systemBarsStyleFor('dark', 139)).toBe(SystemBarsStyle.Default);
  });

  it("reads the WebView's version from its user agent", () => {
    const webView = 'Mozilla/5.0 (Linux; Android 16; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/133.0.6943.137 Mobile Safari/537.36';
    expect(chromiumVersion(webView)).toBe(133);
    expect(chromiumVersion('Something else')).toBe(0);
  });
});
