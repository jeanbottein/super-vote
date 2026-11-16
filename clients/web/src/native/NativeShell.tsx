import { App } from '@capacitor/app';
import { SystemBars, SystemBarsStyle } from '@capacitor/core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { usePreferences, type Preferences } from '../preferences/preferences';

/**
 * What the Android app does that a website leaves to the browser: the back
 * button, links to polls that open the app (App Links), and the status bar's
 * icons, which follow the appearance chosen in the app rather than the
 * phone's. Draws nothing; loaded in the app only (App.tsx).
 */
export default function NativeShell() {
  const navigate = useNavigate();
  const [{ appearance }] = usePreferences();

  useEffect(() => {
    const listening = [
      // Back closes an open dialog first, as Escape does, then goes back a page; at the first page, it leaves
      // the app in the background, as Android's own apps do.
      App.addListener('backButton', ({ canGoBack }) => {
        const dialog = openDialog();
        if (dialog) {
          dialog.close();
        } else if (canGoBack) {
          goBackAPage();
        } else {
          leaveTheApp();
        }
      }),
      App.addListener('appUrlOpen', ({ url }) => navigate(pathIn(url))),
    ];
    return () => listening.forEach((listener) => void listener.then((handle) => handle.remove()));
  }, [navigate]);

  useEffect(() => {
    void SystemBars.setStyle({ style: systemBarsStyleFor(appearance, chromiumVersion(navigator.userAgent)) });
  }, [appearance]);

  return null;
}

function openDialog(): HTMLDialogElement | null {
  return document.querySelector<HTMLDialogElement>('dialog[open]');
}

function goBackAPage(): void {
  window.history.back();
}

function leaveTheApp(): void {
  void App.minimizeApp();
}

/** Where in the app a link to the site leads: its path, and its fragment, where an invitation travels. */
export function pathIn(url: string): string {
  const { pathname, search, hash } = new URL(url);
  return pathname + search + hash;
}

/**
 * Light icons on a dark page, dark ones on a light page; the phone's own choice when the app follows it. Before
 * Chromium 140 the page does not reach under the bars: Capacitor pads it, and what shows behind them is the
 * window, which follows the phone's dark mode, so the icons must too.
 */
export function systemBarsStyleFor(appearance: Preferences['appearance'], chromium: number): SystemBarsStyle {
  if (chromium < 140) {
    return SystemBarsStyle.Default;
  }
  return { dark: SystemBarsStyle.Dark, light: SystemBarsStyle.Light, system: SystemBarsStyle.Default }[appearance];
}

/** The WebView's Chromium major version, from its user agent; 0 when it does not say. */
export function chromiumVersion(userAgent: string): number {
  return Number(userAgent.match(/Chrome\/(\d+)/)?.[1] ?? 0);
}
