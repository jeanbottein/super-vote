import { useEffect, useSyncExternalStore } from 'react';
import { useChosenLanguage } from '../preferences/preferences';
import { en, type Messages } from './en';
import { deviceLanguage, direction, type Language } from './format';

/**
 * Every language but English is a chunk of its own, fetched when someone speaks it: fourteen languages of
 * messages would otherwise weigh on every visit. English is always there, as what a chunk that has not
 * arrived falls back to. Each file is named after its language, and exports its messages under that name.
 */
const CHUNKS = import.meta.glob<Record<string, Messages>>(['./*.tsx', '!./en.tsx']);

const loaded = new Map<Language, Messages>([['en', en]]);
const loading = new Map<Language, Promise<void>>();
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Fetches a language's messages, once however often it is asked, and redraws whatever speaks it when they
 * arrive. Rejects when the network fails, and a later call tries again.
 */
export function loadMessages(language: Language): Promise<void> {
  if (loaded.has(language)) return Promise.resolve();
  let pending = loading.get(language);
  if (!pending) {
    pending = CHUNKS[`./${language}.tsx`]()
      .then((module) => {
        loaded.set(language, module[language]);
        listeners.forEach((listener) => listener());
      })
      .finally(() => loading.delete(language));
    loading.set(language, pending);
  }
  return pending;
}

/** The language the page is in: the one wanted once its messages are there, English until then. */
export function shownLanguage(wanted: Language): Language {
  return loaded.has(wanted) ? wanted : 'en';
}

/**
 * What the web app says, in the language chosen in Settings or, until one
 * is, in the device's. Everything people read comes from here: the server
 * speaks English, to people and agents alike.
 */
export function useI18n(): { language: Language; t: Messages } {
  const wanted = useChosenLanguage() ?? deviceLanguage();
  const language = useSyncExternalStore(subscribe, () => shownLanguage(wanted));
  return { language, t: loaded.get(language)! };
}

/** Says which language the page is in, where screen readers and the stylesheets (`dir`) look. */
export function showDocumentIn(language: Language): void {
  document.documentElement.lang = language;
  document.documentElement.dir = direction(language);
}

/**
 * Once, at the root: fetches the language wanted, however it came to be wanted (Settings, another tab, the
 * device), and keeps the document in the language the page is actually in, English while it is on its way.
 */
export function useDocumentLanguage(): void {
  const wanted = useChosenLanguage() ?? deviceLanguage();
  const { language } = useI18n();
  useEffect(() => {
    loadMessages(wanted).catch(() => {}); // Offline: the page stays as it is.
  }, [wanted]);
  useEffect(() => showDocumentIn(language), [language]);
}
