import { CalendarDays, Clock, MapPin, Navigation } from 'lucide-react';
import type { ReactNode } from 'react';
import { KhatamStar } from '../components/decorative/KhatamStar';
import { Ltr } from '../components/ui/Ltr';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeading } from '../components/ui/SectionHeading';
import { wedding } from '../config/wedding';
import { useLanguage } from '../hooks/useLanguage';
import { arrivalTime, eventDate, localize, validMapsUrl } from '../lib/wedding';

/**
 * SECTION 06 — practical details. Venue fields stay hidden behind a
 * “to be announced” line until they are set in src/config/wedding.ts, and the
 * directions button only appears for a valid Google Maps link.
 */
export function EventDetailsSection() {
  const { t, lang } = useLanguage();
  const venueName = localize(wedding.venueName, lang);
  const venueAddress = localize(wedding.venueAddress, lang);
  const mapsUrl = validMapsUrl(wedding.googleMapsUrl);
  const showSpoken = t.format.spokenTime(arrivalTime) !== t.format.time(arrivalTime);

  const items: { icon: ReactNode; label: string; value: ReactNode }[] = [
    {
      icon: <KhatamStar size={20} />,
      label: t.details.occasion,
      value: t.details.occasionValue,
    },
    {
      icon: <CalendarDays className="size-5" strokeWidth={1.3} aria-hidden="true" />,
      label: t.details.date,
      value: t.format.longDate(eventDate, t),
    },
    {
      icon: <Clock className="size-5" strokeWidth={1.3} aria-hidden="true" />,
      label: t.details.arrival,
      value: (
        <>
          <Ltr className="numerals">{t.format.time(arrivalTime)}</Ltr>
          {showSpoken && <span className="text-text/70"> — {t.format.spokenTime(arrivalTime)}</span>}
        </>
      ),
    },
    {
      icon: <MapPin className="size-5" strokeWidth={1.3} aria-hidden="true" />,
      label: t.details.venue,
      value:
        venueName || venueAddress ? (
          <>
            {venueName && <span className="block">{venueName}</span>}
            {venueAddress && (
              <span className="mt-1 block text-[1rem] text-text/75 ar:text-[1.05rem]">
                <span className="sr-only">{t.details.address}: </span>
                {venueAddress}
              </span>
            )}
          </>
        ) : (
          <span className="italic text-text/65 ar:not-italic">{t.details.venueToBeAnnounced}</span>
        ),
    },
  ];

  return (
    <section id="details" aria-labelledby="details-title" className="relative bg-ivory px-5 py-24 sm:py-32">
      <SectionHeading id="details-title" eyebrow={t.details.eyebrow} title={t.details.title} />

      <Reveal delay={0.1} className="mx-auto mt-12 max-w-3xl">
        <ul className="grid gap-px overflow-hidden bg-gold/30 shadow-[0_24px_50px_-30px_rgb(110_85_50/0.4)] ring-1 ring-gold/40 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.label} className="flex items-start gap-4 bg-paper px-5 py-6 sm:px-7 sm:py-8">
              <span className="grid size-11 shrink-0 place-items-center rounded-full text-gold-ink ring-1 ring-gold/55">
                {item.icon}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="eyebrow !leading-snug">{item.label}</p>
                <div className="mt-1.5 text-[1.2rem] leading-snug text-navy ar:text-[1.25rem] ar:leading-[1.7]">
                  {item.value}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {mapsUrl && (
          <div className="mt-10 flex justify-center">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-navy px-7 py-3 text-ivory shadow-[0_12px_30px_-14px_rgb(23_35_67/0.65)] ring-1 ring-gold/60 ring-offset-2 ring-offset-ivory transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Navigation className="size-4 text-light-gold rtl:-scale-x-100" strokeWidth={1.5} aria-hidden="true" />
              <span className="ar:font-arabic ar:text-[1.1rem] latin:font-sans latin:text-[0.72rem] latin:font-medium latin:uppercase latin:tracking-[0.14em]">
                {t.details.directionsCta}
              </span>
              <span className="sr-only">{t.a11y.opensInNewTab}</span>
            </a>
          </div>
        )}
      </Reveal>
    </section>
  );
}
