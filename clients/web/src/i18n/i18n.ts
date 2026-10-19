import { useChosenLanguage } from '../preferences/preferences';
import { en, type Messages } from './en';
import { deviceLanguage, type Language } from './format';
import { fr } from './fr';

export const MESSAGES: Record<Language, Messages> = { en, fr };

/**
 * What the web app says, in the language chosen in Settings or, until one
 * is, in the device's. Everything people read comes from here: the server
 * speaks English, to people and agents alike.
 */
export function useI18n(): { language: Language; t: Messages } {
  const current = useChosenLanguage() ?? deviceLanguage();
  return { language: current, t: MESSAGES[current] };
}
