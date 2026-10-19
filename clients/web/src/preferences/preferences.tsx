/**
 * The voter's display and ballot preferences, remembered in this browser.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { deviceLanguage, isLanguage, type Language } from '../i18n/format';

export interface Preferences {
  /** The language the web app speaks, or null for the device's own (src/i18n). */
  language: Language | null;
  /**
   * Light or dark. "system" follows the device, through the CSS color-scheme. Not to be confused with a
   * theme, which is a palette (data-theme, docs/DESIGN.md): there is one so far, so nothing chooses it.
   */
  appearance: 'system' | 'light' | 'dark';
  /** A grey mention ramp that does not rely on telling red from green. */
  colorblind: boolean;
  /** How a majority judgment ballot is filled in: a colour scale per option, or a dropdown per option. */
  mjBallot: 'scale' | 'dropdown';
  /** Live: every change is cast at once. Envelope: changes are reviewed, then submitted together. */
  submission: 'live' | 'envelope';
  /** The name last given on a poll that shows names, offered again on the next one. Empty: anonymous. */
  voterName: string;
}

const DEFAULTS: Preferences = {
  language: null, appearance: 'system', colorblind: false, mjBallot: 'scale', submission: 'live', voterName: '',
};
const STORAGE_KEY = 'super-vote.preferences'; // index.html reads it too, to set the appearance before the first paint

export function loadPreferences(): Preferences {
  try {
    const stored = { ...DEFAULTS, ...JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') };
    // A language this version does not speak (stored by another): the device's.
    return { ...stored, language: isLanguage(stored.language) ? stored.language : null };
  } catch {
    return DEFAULTS; // Storage disabled, or unreadable.
  }
}

/** Reflects the preferences on the document, where the stylesheets, and screen readers for its language, look. */
export function applyPreferences(
  { language, appearance, colorblind }: Pick<Preferences, 'language' | 'appearance' | 'colorblind'>,
) {
  const root = document.documentElement;
  root.lang = language ?? deviceLanguage();
  if (appearance === 'system') {
    delete root.dataset.appearance;
  } else {
    root.dataset.appearance = appearance;
  }
  // The browser's own bars (index.html's theme-color tags) follow a chosen appearance too.
  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"][data-scheme]')) {
    const scheme = meta.dataset.scheme;
    meta.media = appearance === 'system' ? `(prefers-color-scheme: ${scheme})` : appearance === scheme ? 'all' : 'not all';
  }
  // The grey mention palette (mentions.css) reads this attribute from <body>.
  if (colorblind) {
    document.body.dataset.colorblind = 'true';
  } else {
    delete document.body.dataset.colorblind;
  }
}

type PreferencesValue = [Preferences, (change: Partial<Preferences>) => void];

const PreferencesContext = createContext<PreferencesValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState(loadPreferences);

  useEffect(() => {
    applyPreferences(preferences);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Not remembered across visits; the app works the same.
    }
  }, [preferences]);

  const update = useCallback((change: Partial<Preferences>) => {
    setPreferences((current) => ({ ...current, ...change }));
  }, []);

  const value = useMemo<PreferencesValue>(() => [preferences, update], [preferences, update]);
  return <PreferencesContext value={value}>{children}</PreferencesContext>;
}

/**
 * The language chosen in Settings, or null for the device's. Null too outside
 * PreferencesProvider, as in a test of one component alone: what it says is
 * then in the device's language.
 */
export function useChosenLanguage(): Language | null {
  return useContext(PreferencesContext)?.[0].language ?? null;
}

export function usePreferences(): PreferencesValue {
  const value = useContext(PreferencesContext);
  if (!value) {
    throw new Error('usePreferences() must be used inside <PreferencesProvider>');
  }
  return value;
}
