/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  WEDDING CONFIGURATION — the single place to update the invitation's details.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  • Text values can be a plain string (shown in every language) or an object
 *    with one entry per language: { ar: '…', fr: '…', en: '…' }.
 *    Missing languages fall back to Arabic.
 *  • Files referenced below (photos, music, sharing image) live in /public.
 *    A file at  public/images/couple.webp  is referenced as '/images/couple.webp'.
 *  • Leave a value as `null` while it is unknown — the website will not show
 *    any invented or placeholder information in its place.
 *
 *  See README.md for step-by-step instructions.
 */

import type { LanguageCode } from '../i18n/types';

export type LocalizedText = string | ({ ar: string } & Partial<Record<LanguageCode, string>>);

export interface HeroPhoto {
  /** Path inside /public, e.g. '/images/couple.webp'. Use WebP/AVIF, ~1600px tall. */
  src: string;
  /** Optional portrait-cropped version for phones, e.g. '/images/couple-mobile.webp'. */
  mobileSrc?: string;
  /** Describes the photograph for screen-reader users. */
  alt: LocalizedText;
  /** CSS object-position used for cropping, e.g. 'center 30%'. */
  position?: string;
}

export interface OpeningVideo {
  /** Path inside /public, e.g. '/video/opening.mp4' (H.264 MP4, 9:16, no sound). */
  src: string;
  /** A still frame shown until the video plays (and to guests who prefer reduced motion). */
  poster: string;
}

export interface WeddingConfig {
  couple: {
    bride: { ar: string; latin: string };
    groom: { ar: string; latin: string };
  };

  /** Local wall-clock date and time at the venue. */
  event: {
    year: number;
    /** 1–12 */
    month: number;
    day: number;
    arrivalHour: number;
    arrivalMinute: number;
    /**
     * The venue's offset from UTC on the wedding day, e.g. '+00:00'. This is
     * the authoritative value for the countdown, so every guest's phone counts
     * down to the same moment — even phones whose time-zone data is out of date.
     */
    utcOffset: string;
    /** IANA time zone of the venue, used only as a developer cross-check. */
    timeZone: string;
    /** After the arrival time, the countdown says “the celebration has begun” for this long. */
    durationHours: number;
  };

  /** Venue — keep `null` until confirmed. */
  venueName: LocalizedText | null;
  venueAddress: LocalizedText | null;
  /** A Google Maps link (https://maps.app.goo.gl/… or https://www.google.com/maps/…). */
  googleMapsUrl: string | null;

  /** Couple photograph for the hero section. `null` shows the typographic design. */
  heroPhoto: HeroPhoto | null;

  /**
   * Video shown inside the arch of the opening card. It replaces the card's
   * text (names, date …), so the video itself should show them.
   * `null` shows the typographic card instead.
   */
  openingVideo: OpeningVideo | null;

  backgroundMusic: {
    /** Path inside /public. Replace with the family's authorised track. */
    src: string;
    /** 0–1 */
    volume: number;
    /** Start the music when the guest taps “open the invitation”. */
    startOnOpen: boolean;
  };

  /** Image shown when the link is shared on WhatsApp etc. (1200 × 630, JPG). */
  shareImage: string;

  /**
   * Public address of the website, e.g. 'https://rania-said.com'.
   * Leave empty when deploying on Vercel: the production domain (including a
   * custom domain) is detected automatically at build time.
   */
  siteUrl: string;

  /** Keep private invitations out of Google search results. */
  allowSearchIndexing: boolean;

  defaultLanguage: LanguageCode;
}

export const wedding: WeddingConfig = {
  couple: {
    bride: { ar: 'رانية', latin: 'Rania' },
    groom: { ar: 'سعيد', latin: 'Said' },
  },

  event: {
    year: 2026,
    month: 12,
    day: 12,
    arrivalHour: 17,
    arrivalMinute: 0,
    // Morocco has used GMT (UTC+0) all year round since 20 September 2026
    // (government decision of June 2026; IANA tzdata 2026c). Phones that have
    // not received that update would still assume UTC+1, which is why the
    // offset is stated explicitly here.
    utcOffset: '+00:00',
    timeZone: 'Africa/Casablanca',
    durationHours: 6,
  },

  venueName: null,
  venueAddress: null,
  googleMapsUrl: null,

  heroPhoto: null,

  openingVideo: {
    src: '/video/opening.mp4',
    poster: '/video/opening-poster.jpg',
  },

  backgroundMusic: {
    src: '/audio/placeholder-music.mp3',
    volume: 0.6,
    startOnOpen: true,
  },

  shareImage: '/og-image.jpg',

  siteUrl: '',

  allowSearchIndexing: false,

  defaultLanguage: 'ar',
};
