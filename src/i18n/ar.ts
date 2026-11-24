import type { TimeParts, Translation } from './types';

const pad = (n: number) => String(n).padStart(2, '0');

const HOUR_WORDS = [
  'الثانية عشرة',
  'الواحدة',
  'الثانية',
  'الثالثة',
  'الرابعة',
  'الخامسة',
  'السادسة',
  'السابعة',
  'الثامنة',
  'التاسعة',
  'العاشرة',
  'الحادية عشرة',
];

/** “الخامسة مساءً”, “السابعة والنصف مساءً”… */
function spokenTime({ hour, minute }: TimeParts): string {
  const period = hour < 12 ? 'صباحاً' : hour < 15 ? 'ظهراً' : 'مساءً';
  const word = HOUR_WORDS[hour % 12];
  if (minute === 0) return `${word} ${period}`;
  if (minute === 15) return `${word} والربع ${period}`;
  if (minute === 30) return `${word} والنصف ${period}`;
  return `${pad(hour)}:${pad(minute)}`;
}

export const ar: Translation = {
  code: 'ar',
  dir: 'rtl',
  htmlLang: 'ar',
  nativeName: 'العربية',
  shortName: 'عربي',
  script: 'arabic',

  calendar: {
    // Moroccan usage alternative: يناير، فبراير، مارس، أبريل، ماي، يونيو، يوليوز، غشت، شتنبر، أكتوبر، نونبر، دجنبر
    months: [
      'يناير',
      'فبراير',
      'مارس',
      'أبريل',
      'مايو',
      'يونيو',
      'يوليو',
      'أغسطس',
      'سبتمبر',
      'أكتوبر',
      'نوفمبر',
      'ديسمبر',
    ],
    weekdays: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    weekdaysShort: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
    weekStartsOn: 1,
  },

  format: {
    longDate: (d, t) => `${t.calendar.weekdays[d.weekday]} ${d.day} ${t.calendar.months[d.month - 1]} ${d.year}`,
    monthYear: (d, t) => `${t.calendar.months[d.month - 1]} ${d.year}`,
    time: ({ hour, minute }) => `${pad(hour)}:${pad(minute)}`,
    spokenTime,
  },

  meta: {
    title: (n, d, t) => `عقد قران ${n.bride} و${n.groom} | ${d.day} ${t.calendar.months[d.month - 1]} ${d.year}`,
    description: (n, d, t) =>
      `دعوتكم لحضور حفل عقد قران ${n.bride} و${n.groom}، يوم ${t.format.longDate(d, t)}.`,
  },

  a11y: {
    skipToContent: 'الانتقال إلى المحتوى',
    openMenu: 'فتح القائمة',
    closeMenu: 'إغلاق القائمة',
    mainNavigation: 'التنقل في الدعوة',
    chooseLanguage: 'اختيار اللغة',
    backToTop: 'العودة إلى الأعلى',
    opensInNewTab: '(يُفتح في نافذة جديدة)',
    invitationDialog: 'بطاقة الدعوة',
  },

  nav: {
    hero: 'الرئيسية',
    countdown: 'العد التنازلي',
    invitation: 'الدعوة',
    calendar: 'الموعد',
    details: 'تفاصيل الحفل',
    note: 'ملاحظة مهمة',
  },

  opening: {
    occasion: 'عقد قران',
    cta: 'افتحوا دعوتنا',
  },

  hero: {
    occasion: 'عقد قران',
    scrollCue: 'اكتشفوا الدعوة',
  },

  countdown: {
    eyebrow: 'العد التنازلي',
    title: 'على موعدٍ مع الفرح',
    units: { days: 'أيام', hours: 'ساعات', minutes: 'دقائق', seconds: 'ثوانٍ' },
    live: 'بدأ الحفل، أهلاً وسهلاً بكم',
    past: 'تمّ الحفل بحمد الله، شكراً لمشاركتكم فرحتنا',
    summary: ({ days, hours, minutes }) =>
      `الوقت المتبقي — أيام: ${days}، ساعات: ${hours}، دقائق: ${minutes}`,
  },

  invitation: {
    eyebrow: 'الدعوة',
    basmalaTranslation: null,
    lead: 'نتشرف بدعوتكم إلى حفل عقد القران',
    body: 'ويسعدنا حضوركم ومشاركتنا هذه المناسبة المباركة، سائلين الله أن يجعلها بداية حياة مليئة بالمودة والرحمة والبركة.',
  },

  calendarSection: {
    eyebrow: 'الموعد',
    title: 'احفظوا التاريخ',
    atTime: (time) => `على الساعة ${time}`,
    highlightLabel: 'يوم الحفل',
  },

  details: {
    eyebrow: 'التفاصيل',
    title: 'تفاصيل الحفل',
    occasion: 'المناسبة',
    occasionValue: 'حفل عقد القران',
    date: 'التاريخ',
    arrival: 'موعد الحضور',
    venue: 'المكان',
    address: 'العنوان',
    venueToBeAnnounced: 'سيتم الإعلان عن مكان الحفل قريباً',
    directionsCta: 'عرض الموقع على خرائط Google',
  },

  announcement: {
    title: 'ملاحظة مهمة',
    arrival: (time) => `المرجو الحضور مبكراً، على الساعة ${time}.`,
    photography: 'يرجى عدم التصوير، حيث لدينا مصور خاص لتوثيق هذه المناسبة.',
  },

  closing: {
    line1: 'حضوركم يسعدنا ويزيد فرحتنا جمالاً.',
    line2: 'بارك الله لنا ولكم وجمع بيننا في الخير.',
  },

  music: {
    play: 'تشغيل الموسيقى',
    pause: 'إيقاف الموسيقى',
  },
};
