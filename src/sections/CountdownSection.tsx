import { Fragment } from 'react';
import { Gypsophila } from '../components/decorative/Gypsophila';
import { Ltr } from '../components/ui/Ltr';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeading } from '../components/ui/SectionHeading';
import { useCountdown } from '../hooks/useCountdown';
import { useLanguage } from '../hooks/useLanguage';
import { arrivalTime, eventDate, eventEndMs, eventStartMs } from '../lib/wedding';

const UNITS = ['days', 'hours', 'minutes', 'seconds'] as const;

/** SECTION 03 — live countdown to the arrival time at the venue. */
export function CountdownSection() {
  const { t } = useLanguage();
  const state = useCountdown(eventStartMs, eventEndMs);

  return (
    <section
      id="countdown"
      aria-labelledby="countdown-title"
      className="relative overflow-hidden bg-cream px-5 pb-32 pt-24 sm:py-32"
    >
      <Gypsophila variant="sprig" className="-bottom-10 -left-8 w-28 opacity-80 sm:-bottom-6 sm:-left-6 sm:w-48" />
      <Gypsophila variant="sprig" flip="xy" className="-right-6 -top-6 w-32 opacity-80 sm:w-44" />

      <SectionHeading id="countdown-title" eyebrow={t.countdown.eyebrow} title={t.countdown.title} />

      <Reveal delay={0.15} className="mt-12 sm:mt-14">
        {state === null || state.status === 'upcoming' ? (
          <div role="timer" aria-label={state ? t.countdown.summary(state) : undefined} className="mx-auto max-w-2xl">
            <div aria-hidden="true" className="flex items-stretch justify-center">
              {UNITS.map((unit, i) => (
                <Fragment key={unit}>
                  {i > 0 && (
                    <span className="mx-1.5 flex w-px flex-col items-center sm:mx-6">
                      <span className="w-px flex-1 bg-gradient-to-b from-transparent via-gold/70 to-transparent" />
                    </span>
                  )}
                  <div className="flex min-w-[4.1rem] flex-col items-center sm:min-w-[6.5rem]">
                    <span className="numerals text-[3.15rem] font-light leading-none text-navy sm:text-[4.75rem]">
                      {state ? String(state[unit]).padStart(2, '0') : '––'}
                    </span>
                    <span className="mt-3 font-sans text-[0.62rem] font-medium uppercase tracking-[0.16em] text-gold-ink ar:font-arabic ar:text-[0.98rem] ar:normal-case ar:tracking-normal sm:text-[0.7rem]">
                      {t.countdown.units[unit]}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        ) : (
          <p role="status" className="font-display mx-auto max-w-lg text-balance text-center text-[2rem] leading-snug text-navy ar:leading-[1.6]">
            {state.status === 'live' ? t.countdown.live : t.countdown.past}
          </p>
        )}

        <p className="mt-12 text-center text-[1.05rem] text-text/80 ar:text-[1.15rem]">
          {t.format.longDate(eventDate, t)}
          <span aria-hidden="true" className="mx-3 text-gold">◆</span>
          <Ltr className="numerals">{t.format.time(arrivalTime)}</Ltr>
        </p>
      </Reveal>
    </section>
  );
}
