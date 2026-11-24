import type { TimeParts, Translation } from './types';

const pad = (n: number) => String(n).padStart(2, '0');
const time = ({ hour, minute }: TimeParts) => `${hour}h${pad(minute)}`;

export const fr: Translation = {
  code: 'fr',
  dir: 'ltr',
  htmlLang: 'fr',
  nativeName: 'Français',
  shortName: 'FR',
  script: 'latin',

  calendar: {
    months: [
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'août',
      'septembre',
      'octobre',
      'novembre',
      'décembre',
    ],
    weekdays: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
    weekdaysShort: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
    weekStartsOn: 1,
  },

  format: {
    longDate: (d, t) => {
      const s = `${t.calendar.weekdays[d.weekday]} ${d.day} ${t.calendar.months[d.month - 1]} ${d.year}`;
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    monthYear: (d, t) => {
      const m = t.calendar.months[d.month - 1];
      return `${m.charAt(0).toUpperCase() + m.slice(1)} ${d.year}`;
    },
    time,
    spokenTime: time,
  },

  meta: {
    title: (n, d, t) => `${n.bride} & ${n.groom} — Cérémonie de mariage | ${d.day} ${t.calendar.months[d.month - 1]} ${d.year}`,
    description: (n, d, t) =>
      `Vous êtes conviés à la cérémonie de mariage de ${n.bride} & ${n.groom}, le ${t.format.longDate(d, t).toLowerCase()}.`,
  },

  a11y: {
    skipToContent: 'Aller au contenu',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    mainNavigation: "Navigation de l'invitation",
    chooseLanguage: 'Choisir la langue',
    backToTop: 'Retour en haut',
    opensInNewTab: "(s'ouvre dans un nouvel onglet)",
    invitationDialog: "Carte d'invitation",
  },

  nav: {
    hero: 'Accueil',
    countdown: 'Compte à rebours',
    invitation: 'Invitation',
    calendar: 'La date',
    details: 'Informations',
    note: 'Note importante',
  },

  opening: {
    occasion: 'Cérémonie de mariage',
    cta: 'Ouvrez notre invitation',
  },

  hero: {
    occasion: 'Cérémonie de mariage',
    scrollCue: 'Découvrir',
  },

  countdown: {
    eyebrow: 'Compte à rebours',
    title: 'Bientôt, le grand jour',
    units: { days: 'Jours', hours: 'Heures', minutes: 'Minutes', seconds: 'Secondes' },
    live: 'La célébration a commencé — soyez les bienvenus',
    past: "La cérémonie a eu lieu — merci d'avoir partagé notre joie",
    summary: ({ days, hours, minutes }) =>
      `Il reste ${days} jours, ${hours} heures et ${minutes} minutes`,
  },

  invitation: {
    eyebrow: "L'invitation",
    basmalaTranslation: 'Au nom de Dieu, le Tout Miséricordieux, le Très Miséricordieux',
    lead: "Nous avons l'honneur de vous convier à la cérémonie de mariage de",
    body: "Votre présence à nos côtés en cette heureuse et bénie occasion nous comblerait de joie. Nous prions Dieu d'en faire le commencement d'une vie remplie d'affection, de bonté et de bénédictions.",
  },

  calendarSection: {
    eyebrow: 'La date',
    title: 'Réservez la date',
    atTime: (t) => `à ${t}`,
    highlightLabel: 'jour de la cérémonie',
  },

  details: {
    eyebrow: 'Informations',
    title: 'Détails de la cérémonie',
    occasion: 'Occasion',
    occasionValue: 'Cérémonie de mariage (Aqd Qirane)',
    date: 'Date',
    arrival: "Heure d'arrivée",
    venue: 'Lieu',
    address: 'Adresse',
    venueToBeAnnounced: 'Le lieu de la cérémonie sera communiqué prochainement.',
    directionsCta: 'Itinéraire sur Google Maps',
  },

  announcement: {
    title: 'Note importante',
    arrival: (t) => `Nous vous prions d'arriver à l'avance, à ${t}.`,
    photography:
      'Merci de ne pas prendre de photos. Un photographe professionnel sera présent pour immortaliser cette occasion.',
  },

  closing: {
    line1: 'Votre présence nous réjouit et rend notre bonheur plus beau encore.',
    line2: 'Que Dieu nous bénisse, vous et nous, et nous réunisse toujours dans le bien.',
  },

  music: {
    play: 'Lancer la musique',
    pause: 'Couper la musique',
  },
};
