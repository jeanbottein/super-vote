import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App';
import { deviceLanguage } from './i18n/format';
import { loadMessages, shownLanguage, showDocumentIn } from './i18n/i18n';
import { applyPreferences, loadPreferences } from './preferences/preferences';
import './style.css';

// Before the first render: the grey palette and the browser's bars. (index.html set the appearance already,
// before the first paint.)
const preferences = loadPreferences();
applyPreferences(preferences);

// The page opens in the voter's language, not in English first: its messages arrive before anything is drawn.
// Offline, the page opens in English rather than not at all.
const wanted = preferences.language ?? deviceLanguage();
loadMessages(wanted)
  .catch(() => {})
  .then(() => {
    showDocumentIn(shownLanguage(wanted));
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });
