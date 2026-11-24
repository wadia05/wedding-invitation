import type { TimeParts, Translation } from './types';

const pad = (n: number) => String(n).padStart(2, '0');
const time = ({ hour, minute }: TimeParts) =>
  `${hour % 12 === 0 ? 12 : hour % 12}:${pad(minute)} ${hour < 12 ? 'AM' : 'PM'}`;

export const en: Translation = {
  code: 'en',
  dir: 'ltr',
  htmlLang: 'en',
  nativeName: 'English',
  shortName: 'EN',
  script: 'latin',

  calendar: {
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    weekStartsOn: 0,
  },

  format: {
    longDate: (d, t) =>
      `${t.calendar.weekdays[d.weekday]}, ${t.calendar.months[d.month - 1]} ${d.day}, ${d.year}`,
    monthYear: (d, t) => `${t.calendar.months[d.month - 1]} ${d.year}`,
    time,
    spokenTime: time,
  },

  meta: {
    title: (n, d, t) => `${n.bride} & ${n.groom} — Marriage Ceremony | ${t.calendar.months[d.month - 1]} ${d.day}, ${d.year}`,
    description: (n, d, t) =>
      `You are warmly invited to the marriage ceremony of ${n.bride} & ${n.groom} on ${t.format.longDate(d, t)}.`,
  },

  a11y: {
    skipToContent: 'Skip to content',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    mainNavigation: 'Invitation navigation',
    chooseLanguage: 'Choose language',
    backToTop: 'Back to top',
    opensInNewTab: '(opens in a new tab)',
    invitationDialog: 'Invitation card',
  },

  nav: {
    hero: 'Welcome',
    countdown: 'Countdown',
    invitation: 'Invitation',
    calendar: 'The date',
    details: 'Details',
    note: 'Important note',
  },

  opening: {
    occasion: 'Marriage Ceremony',
    cta: 'Open our invitation',
  },

  hero: {
    occasion: 'Marriage Ceremony',
    scrollCue: 'Scroll to discover',
  },

  countdown: {
    eyebrow: 'Countdown',
    title: 'Until we celebrate together',
    units: { days: 'Days', hours: 'Hours', minutes: 'Minutes', seconds: 'Seconds' },
    live: 'The celebration has begun — welcome',
    past: 'Our ceremony has taken place — thank you for sharing our joy',
    summary: ({ days, hours, minutes }) =>
      `${days} days, ${hours} hours and ${minutes} minutes to go`,
  },

  invitation: {
    eyebrow: 'The invitation',
    basmalaTranslation: 'In the name of God, the Most Gracious, the Most Merciful',
    lead: 'We are honoured to invite you to the marriage ceremony of',
    body: 'It would bring us great joy to have you with us on this blessed occasion. We pray that God makes it the beginning of a life filled with love, mercy and blessings.',
  },

  calendarSection: {
    eyebrow: 'The date',
    title: 'Save the date',
    atTime: (t) => `at ${t}`,
    highlightLabel: 'the ceremony day',
  },

  details: {
    eyebrow: 'Details',
    title: 'The celebration',
    occasion: 'Occasion',
    occasionValue: 'Marriage ceremony (Aqd Qiran)',
    date: 'Date',
    arrival: 'Arrival',
    venue: 'Venue',
    address: 'Address',
    venueToBeAnnounced: 'Venue details will be shared soon.',
    directionsCta: 'Open in Google Maps',
  },

  announcement: {
    title: 'Important Note',
    arrival: (t) => `Please arrive early, at ${t}.`,
    photography:
      'Kindly refrain from taking photographs, as a professional photographer will be present to capture this special occasion.',
  },

  closing: {
    line1: 'Your presence brings us joy and makes our happiness all the more beautiful.',
    line2: 'May God bless us all and keep us gathered in goodness.',
  },

  music: {
    play: 'Play music',
    pause: 'Pause music',
  },
};
