import { createRoot, hydrateRoot } from 'react-dom/client';
import { wedding } from './config/wedding';
import { applyDocumentLanguage, resolveInitialLanguage } from './context/LanguageContext';
import { translations } from './i18n';
import { timeZoneMismatchMinutes } from './lib/wedding';
import { Root } from './Root';
import './styles/globals.css';

if (import.meta.env.DEV) {
  const drift = timeZoneMismatchMinutes();
  if (drift !== 0) {
    console.info(
      `[wedding config] utcOffset differs by ${drift} min from this browser's time-zone data for ` +
        'the venue. The countdown uses utcOffset; check it is right for the wedding day.',
    );
  }
}

const initialLanguage = resolveInitialLanguage();
// Set direction before the first paint so RTL/LTR never flickers.
applyDocumentLanguage(translations[initialLanguage]);

const container = document.getElementById('root')!;
const app = <Root initialLanguage={initialLanguage} />;

// The production HTML is prerendered in the default language: hydrate it.
// A guest arriving with ?lang=fr / ?lang=en gets a fresh render instead.
if (container.firstElementChild && initialLanguage === wedding.defaultLanguage) {
  hydrateRoot(container, app);
} else {
  container.textContent = '';
  createRoot(container).render(app);
}
