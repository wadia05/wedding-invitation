/**
 * Values derived from the wedding configuration, computed once.
 */
import { wedding, type LocalizedText } from '../config/wedding.ts';
import type { CoupleNames, DateParts, LanguageCode, TimeParts, Translation } from '../i18n/types';
import { parseUtcOffset, weekdayOf, zonedTimeToUtc } from './time.ts';

const { event } = wedding;

export const eventDate: DateParts = {
  year: event.year,
  month: event.month,
  day: event.day,
  weekday: weekdayOf(event.year, event.month, event.day),
};

export const arrivalTime: TimeParts = { hour: event.arrivalHour, minute: event.arrivalMinute };

const wallClock = {
  year: event.year,
  month: event.month,
  day: event.day,
  hour: event.arrivalHour,
  minute: event.arrivalMinute,
};

/**
 * Absolute start instant (UTC ms) of the celebration, from the venue's
 * wall-clock time and its explicit UTC offset — identical on every device,
 * whatever the visitor's own time zone or time-zone database version.
 */
export const eventStartMs =
  Date.UTC(wallClock.year, wallClock.month - 1, wallClock.day, wallClock.hour, wallClock.minute) - safeOffsetMs();

function safeOffsetMs(): number {
  try {
    return parseUtcOffset(event.utcOffset);
  } catch {
    // A typo in the config must never break the invitation; fall back to the IANA zone.
    console.error(`[wedding config] Invalid utcOffset "${event.utcOffset}" — expected e.g. "+00:00".`);
    try {
      const naive = Date.UTC(wallClock.year, wallClock.month - 1, wallClock.day, wallClock.hour, wallClock.minute);
      return naive - zonedTimeToUtc(wallClock, event.timeZone);
    } catch {
      return 0;
    }
  }
}

/**
 * Developer cross-check: compares the configured offset with what this
 * runtime's time-zone database says for `event.timeZone`. A mismatch means
 * either the config or the runtime's tz data is out of date.
 */
export function timeZoneMismatchMinutes(): number {
  try {
    const fromZone = zonedTimeToUtc(wallClock, event.timeZone);
    return Math.round((eventStartMs - fromZone) / 60_000);
  } catch {
    return 0;
  }
}

export const eventEndMs = eventStartMs + event.durationHours * 60 * 60 * 1000;

/** “12 / 12 / 2026” */
export const numericDate = [event.day, event.month, event.year]
  .map((n, i) => (i < 2 ? String(n).padStart(2, '0') : String(n)))
  .join(' / ');

export function coupleNames(t: Translation): CoupleNames {
  const key = t.script === 'arabic' ? 'ar' : 'latin';
  return { bride: wedding.couple.bride[key], groom: wedding.couple.groom[key] };
}

export function localize(text: LocalizedText | null | undefined, lang: LanguageCode): string | null {
  if (text == null) return null;
  if (typeof text === 'string') return text.trim() || null;
  return (text[lang] ?? text.ar).trim() || null;
}

const MAPS_HOSTS = [
  /^(www\.)?google\.[a-z.]+$/,
  /^maps\.google\.[a-z.]+$/,
  /^maps\.app\.goo\.gl$/,
  /^goo\.gl$/,
  /^g\.co$/,
];

/** Returns the URL only if it is a well-formed https Google Maps link. */
export function validMapsUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== 'https:') return null;
    if (!MAPS_HOSTS.some((re) => re.test(url.hostname))) return null;
    const isGoogleDomain = /google\./.test(url.hostname) && !url.hostname.startsWith('maps.');
    if (isGoogleDomain && !url.pathname.startsWith('/maps')) return null;
    if (url.hostname === 'goo.gl' && !url.pathname.startsWith('/maps')) return null;
    return url.toString();
  } catch {
    return null;
  }
}
