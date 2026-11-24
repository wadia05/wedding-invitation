export type LanguageCode = 'ar' | 'fr' | 'en';

export interface DateParts {
  year: number;
  /** 1–12 */
  month: number;
  day: number;
  /** 0 = Sunday … 6 = Saturday */
  weekday: number;
}

export interface TimeParts {
  hour: number;
  minute: number;
}

export interface CoupleNames {
  bride: string;
  groom: string;
}

/**
 * Every piece of visible text on the website. Each language file implements
 * this interface, so a missing translation is a type error at build time.
 */
export interface Translation {
  code: LanguageCode;
  dir: 'rtl' | 'ltr';
  /** BCP 47 tag for <html lang>. */
  htmlLang: string;
  /** Label in the language switcher, written in the language itself. */
  nativeName: string;
  shortName: string;
  /** Which spelling of the couple's names to use. */
  script: 'arabic' | 'latin';

  calendar: {
    /** January … December */
    months: readonly string[];
    /** Sunday … Saturday */
    weekdays: readonly string[];
    /** Sunday … Saturday — shown in the calendar header. */
    weekdaysShort: readonly string[];
    /** 0 = weeks start on Sunday, 1 = on Monday. */
    weekStartsOn: 0 | 1;
  };

  format: {
    longDate: (d: DateParts, t: Translation) => string;
    monthYear: (d: DateParts, t: Translation) => string;
    /** Compact time, e.g. 17:00 / 17h00 / 5:00 PM */
    time: (time: TimeParts) => string;
    /** Time as it is said in a sentence. */
    spokenTime: (time: TimeParts) => string;
  };

  meta: {
    title: (names: CoupleNames, d: DateParts, t: Translation) => string;
    description: (names: CoupleNames, d: DateParts, t: Translation) => string;
  };

  a11y: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    mainNavigation: string;
    chooseLanguage: string;
    backToTop: string;
    opensInNewTab: string;
    invitationDialog: string;
  };

  nav: {
    hero: string;
    countdown: string;
    invitation: string;
    calendar: string;
    details: string;
    note: string;
  };

  opening: {
    occasion: string;
    cta: string;
  };

  hero: {
    occasion: string;
    scrollCue: string;
  };

  countdown: {
    eyebrow: string;
    title: string;
    units: { days: string; hours: string; minutes: string; seconds: string };
    live: string;
    past: string;
    /** Concise, screen-reader friendly summary of the remaining time. */
    summary: (parts: { days: number; hours: number; minutes: number }) => string;
  };

  invitation: {
    eyebrow: string;
    /** Shown under the Arabic basmala in French/English; null in Arabic. */
    basmalaTranslation: string | null;
    lead: string;
    body: string;
  };

  calendarSection: {
    eyebrow: string;
    title: string;
    atTime: (time: string) => string;
    /** Screen-reader label for the highlighted day. */
    highlightLabel: string;
  };

  details: {
    eyebrow: string;
    title: string;
    occasion: string;
    occasionValue: string;
    date: string;
    arrival: string;
    venue: string;
    address: string;
    venueToBeAnnounced: string;
    directionsCta: string;
  };

  announcement: {
    title: string;
    arrival: (spokenTime: string) => string;
    photography: string;
  };

  closing: {
    line1: string;
    line2: string;
  };

  music: {
    play: string;
    pause: string;
  };
}
