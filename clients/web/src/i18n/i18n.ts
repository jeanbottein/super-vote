import { useChosenLanguage } from '../preferences/preferences';
import { en, type Messages } from './en';
import { deviceLanguage, type Language } from './format';

/**
 * Every language but English is a chunk of its own, fetched when someone speaks it: fourteen languages of
 * messages would otherwise weigh on every visit. English is always there, as what a chunk that has not
 * arrived falls back to.
 */
const LOADERS: Record<Exclude<Language, 'en'>, () => Promise<Messages>> = {
  fr: () => import('./fr').then((module) => module.fr),
  es: () => import('./es').then((module) => module.es),
  pt: () => import('./pt').then((module) => module.pt),
  de: () => import('./de').then((module) => module.de),
  it: () => import('./it').then((module) => module.it),
  ru: () => import('./ru').then((module) => module.ru),
  tr: () => import('./tr').then((module) => module.tr),
  zh: () => import('./zh').then((module) => module.zh),
  ja: () => import('./ja').then((module) => module.ja),
  ko: () => import('./ko').then((module) => module.ko),
  id: () => import('./id').then((module) => module.id),
  hi: () => import('./hi').then((module) => module.hi),
  ar: () => import('./ar').then((module) => module.ar),
};

const loaded = new Map<Language, Messages>([['en', en]]);

/**
 * Fetches a language's messages, so that choosing it, or opening the page in it, is only ever done once they
 * are there: nothing renders half in one language and half in another. Rejects when the network fails.
 */
export async function loadMessages(language: Language): Promise<void> {
  if (!loaded.has(language)) {
    loaded.set(language, await LOADERS[language as Exclude<Language, 'en'>]());
  }
}

/**
 * What the web app says, in the language chosen in Settings or, until one
 * is, in the device's. Everything people read comes from here: the server
 * speaks English, to people and agents alike.
 */
export function useI18n(): { language: Language; t: Messages } {
  const wanted = useChosenLanguage() ?? deviceLanguage();
  const t = loaded.get(wanted);
  return t ? { language: wanted, t } : { language: 'en', t: en };
}
