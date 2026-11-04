/**
 * An entry of its own in index.html, before the app's: it starts fetching the voter's language as soon as
 * its few kilobytes arrive, rather than once the whole app has. index.tsx then waits for the same fetch
 * (`loadMessages` fetches a language once). Offline, the app finds out for itself.
 */
import { loadPreferences } from '../preferences/preferences';
import { deviceLanguage } from './format';
import { loadMessages } from './i18n';

loadMessages(loadPreferences().language ?? deviceLanguage()).catch(() => {});
