import { ar } from './ar.ts';
import { en } from './en.ts';
import { fr } from './fr.ts';
import type { LanguageCode, Translation } from './types';

export const translations: Record<LanguageCode, Translation> = { ar, fr, en };

/** Order shown in the language switcher. */
export const LANGUAGES: readonly LanguageCode[] = ['ar', 'fr', 'en'];

export function isLanguageCode(value: unknown): value is LanguageCode {
  return typeof value === 'string' && (LANGUAGES as readonly string[]).includes(value);
}

export type { LanguageCode, Translation } from './types';
