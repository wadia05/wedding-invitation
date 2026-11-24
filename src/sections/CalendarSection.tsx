import { m } from 'framer-motion';
import { Gypsophila } from '../components/decorative/Gypsophila';
import { Ltr } from '../components/ui/Ltr';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeading } from '../components/ui/SectionHeading';
import { useLanguage } from '../hooks/useLanguage';
import { buildMonthGrid, orderedWeekdays } from '../lib/calendar';
import { arrivalTime, eventDate } from '../lib/wedding';

/** SECTION 05 — an informational December calendar with the day encircled in gold. */
export function CalendarSection() {
  const { t } = useLanguage();
  const weeks = buildMonthGrid(eventDate.year, eventDate.month, t.calendar.weekStartsOn);
  const weekdays = orderedWeekdays(t.calendar.weekStartsOn);
  const monthTitle = t.format.monthYear(eventDate, t);

  return (
    <section id="calendar" aria-labelledby="calendar-title" className="relative overflow-hidden bg-cream px-5 py-24 sm:py-32">
      <SectionHeading id="calendar-title" eyebrow={t.calendarSection.eyebrow} title={t.calendarSection.title} />

      <Reveal delay={0.1} className="mx-auto mt-12 w-full max-w-[26rem]">
        <div className="relative bg-paper px-4 pb-6 pt-7 shadow-[0_24px_50px_-28px_rgb(110_85_50/0.45)] ring-1 ring-gold/55 sm:px-8 sm:pb-8 sm:pt-9">
          <div aria-hidden="true" className="pointer-events-none absolute inset-[6px] ring-1 ring-gold/25" />

          <p className="font-display text-center text-[2.1rem] leading-tight text-navy ar:leading-[1.5]">{monthTitle}</p>

          <table className="mt-5 w-full table-fixed border-collapse text-center">
            <caption className="sr-only">{monthTitle}</caption>
            <thead>
              <tr>
                {weekdays.map((d) => (
                  <th
                    key={d}
                    scope="col"
                    abbr={t.calendar.weekdays[d]}
                    className="pb-3 font-sans text-[0.62rem] font-medium uppercase tracking-[0.08em] text-gold-ink ar:font-arabic ar:text-[0.8rem] ar:font-normal ar:normal-case ar:tracking-normal"
                  >
                    {t.calendar.weekdaysShort[d]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, i) => (
                <tr key={i}>
                  {week.days.map((day, j) => (
                    <td key={j} className="h-11 p-0 align-middle sm:h-12">
                      {day === null ? null : day === eventDate.day ? (
                        <HighlightedDay day={day} label={`${t.format.longDate(eventDate, t)} — ${t.calendarSection.highlightLabel}`} />
                      ) : (
                        <span className="numerals text-[1.15rem] text-text/65">{day}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-9 text-center text-[1.15rem] leading-relaxed text-navy ar:text-[1.25rem]">
          <span className="font-display block text-[1.6rem] ar:text-[1.7rem] ar:leading-[1.6]">
            {t.format.longDate(eventDate, t)}
          </span>
          <span className="text-text/80">
            {t.calendarSection.atTime('')}
            <Ltr className="numerals">{t.format.time(arrivalTime)}</Ltr>
          </span>
        </p>
      </Reveal>
    </section>
  );
}

function HighlightedDay({ day, label }: { day: number; label: string }) {
  return (
    <span className="relative inline-grid size-11 place-items-center sm:size-12">
      <m.svg viewBox="0 0 60 60" aria-hidden="true" className="absolute -inset-1.5 size-[calc(100%+0.75rem)] overflow-visible">
        <m.path
          d="M31 5.5C45.5 5 55 15.5 55 30c0 14.5-10.6 25-25 25S5 44.5 5 30.2C5 16.6 14.8 6.8 28.8 6c7-.4 13 1.8 17.4 6"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.6, delay: 0.35, ease: [0.65, 0, 0.35, 1] }}
        />
      </m.svg>
      <Gypsophila variant="sprig" className="-right-4 -top-5 w-9 rotate-[8deg]" />
      <span className="numerals relative text-[1.3rem] font-medium text-navy">{day}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
