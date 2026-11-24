/**
 * Build-time prerender (see scripts/prerender.mjs): renders the invitation in
 * the default language to static HTML, so the card appears before any
 * JavaScript has loaded. The browser then hydrates it (src/main.tsx).
 */
import { renderToString } from 'react-dom/server';
import { wedding } from './config/wedding';
import { Root } from './Root';

export function render(): string {
  return renderToString(<Root initialLanguage={wedding.defaultLanguage} />);
}
