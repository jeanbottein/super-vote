import { SystemBarsStyle } from '@capacitor/core';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { chromiumVersion, onBackButton, pathIn, systemBarsStyleFor } from './NativeShell';

const minimizeApp = vi.hoisted(() => vi.fn(async () => {}));
vi.mock('@capacitor/app', () => ({ App: { minimizeApp, addListener: vi.fn() } }));

describe('the Android back button', () => {
  afterEach(() => {
    document.body.replaceChildren();
    vi.restoreAllMocks();
  });

  it('closes an open dialog first, and stays on the page', () => {
    const dialog = document.body.appendChild(document.createElement('dialog'));
    dialog.setAttribute('open', '');
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {});

    onBackButton({ canGoBack: true });

    expect(dialog.open).toBe(false);
    expect(back).not.toHaveBeenCalled();
  });

  it('goes back a page', () => {
    const back = vi.spyOn(window.history, 'back').mockImplementation(() => {});

    onBackButton({ canGoBack: true });

    expect(back).toHaveBeenCalled();
    expect(minimizeApp).not.toHaveBeenCalled();
  });

  it('leaves the app in the background from its first page', () => {
    onBackButton({ canGoBack: false });

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

  it("follows the phone under a WebView that keeps the page out from under the bars", () => {
    expect(systemBarsStyleFor('dark', 139)).toBe(SystemBarsStyle.Default);
  });

  it("reads the WebView's version from its user agent", () => {
    const webView = 'Mozilla/5.0 (Linux; Android 16; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/133.0.6943.137 Mobile Safari/537.36';
    expect(chromiumVersion(webView)).toBe(133);
    expect(chromiumVersion('Something else')).toBe(0);
  });
});
