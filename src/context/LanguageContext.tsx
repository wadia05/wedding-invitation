import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { wedding } from '../config/wedding';
import { isLanguageCode, translations, type LanguageCode, type Translation } from '../i18n';
import { readSession, writeSession } from '../lib/storage';
import { coupleNames, eventDate } from '../lib/wedding';

export interface LanguageContextValue {
  lang: LanguageCode;
  t: Translation;
  setLang: (lang: LanguageCode) => void;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Initial language: `?lang=fr` in the link (handy for sharing a French or
 * English link) → the choice made earlier in this session → the default.
 */
export function resolveInitialLanguage(): LanguageCode {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (isLanguageCode(fromUrl)) return fromUrl;
  } catch {
    /* ignore malformed URLs */
  }
  const stored = readSession('lang');
  if (isLanguageCode(stored)) return stored;
  return wedding.defaultLanguage;
}

/** Applies direction, language and title to the document. */
export function applyDocumentLanguage(t: Translation): void {
  const root = document.documentElement;
  root.lang = t.htmlLang;
  root.dir = t.dir;
  const names = coupleNames(t);
  document.title = t.meta.title(names, eventDate, t);
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute('content', t.meta.description(names, eventDate, t));
}

export function LanguageProvider({ initial, children }: { initial: LanguageCode; children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(initial);
  const t = translations[lang];

  useEffect(() => {
    applyDocumentLanguage(t);
  }, [t]);

  const setLang = useCallback((next: LanguageCode) => {
    setLangState(next);
    writeSession('lang', next);
    // Keep the address bar in sync (no reload) so a shared link keeps the language.
    try {
      const url = new URL(window.location.href);
      if (next === wedding.defaultLanguage) url.searchParams.delete('lang');
      else url.searchParams.set('lang', next);
      window.history.replaceState(window.history.state, '', url);
    } catch {
      /* history API unavailable */
    }
  }, []);

  const value = useMemo(() => ({ lang, t, setLang }), [lang, t, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
