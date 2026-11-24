import { CameraOff, Clock } from 'lucide-react';
import { GoldSeparator } from '../components/decorative/GoldSeparator';
import { Gypsophila } from '../components/decorative/Gypsophila';
import { KhatamStar } from '../components/decorative/KhatamStar';
import { Reveal } from '../components/ui/Reveal';
import { useLanguage } from '../hooks/useLanguage';
import { arrivalTime } from '../lib/wedding';

const ARCH_RADIUS = '50% 50% 1.75rem 1.75rem / 10.5rem 10.5rem 1.75rem 1.75rem';
const ARCH_RADIUS_INNER = '50% 50% 1.2rem 1.2rem / 9.9rem 9.9rem 1.2rem 1.2rem';

/** SECTION 07 — the important note, set apart in a navy arched panel. */
export function AnnouncementSection() {
  const { t } = useLanguage();

  return (
    <section id="note" aria-labelledby="note-title" className="relative overflow-hidden bg-ivory px-5 pb-24 pt-10 sm:pb-32">
      <Reveal className="relative mx-auto max-w-[30rem]">
        {/* Sprigs tucked behind the card's shoulders. */}
        <Gypsophila variant="sprig" flip="x" className="-left-12 top-14 w-36 sm:-left-20 sm:w-44" />
        <Gypsophila variant="sprig" className="-right-12 top-14 w-36 sm:-right-20 sm:w-44" />
        <div
          className="relative overflow-hidden bg-navy px-7 pb-14 pt-24 text-center text-ivory shadow-[0_34px_70px_-34px_rgb(23_35_67/0.85)] sm:px-11 sm:pb-16"
          style={{ borderRadius: ARCH_RADIUS }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2.5 border border-gold/50"
            style={{ borderRadius: ARCH_RADIUS_INNER }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(70% 45% at 50% 0%, rgb(220 201 166 / 0.16), transparent 70%)' }}
          />

          <KhatamStar size={30} className="relative mx-auto text-gold" />
          <h2
            id="note-title"
            className="font-display relative mt-4 text-[2.4rem] leading-tight text-light-gold ar:leading-[1.55] sm:text-[2.75rem]"
          >
            {t.announcement.title}
          </h2>
          <GoldSeparator tone="light" className="relative mt-3" lineClassName="w-12" />

          <ul className="relative mx-auto mt-9 max-w-sm space-y-6 text-start text-[1.15rem] leading-relaxed text-ivory/95 ar:text-[1.22rem] ar:leading-[1.95]">
            <li className="flex items-start gap-4">
              <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full ring-1 ring-gold/60">
                <Clock className="size-4 text-light-gold" strokeWidth={1.4} aria-hidden="true" />
              </span>
              <p>{t.announcement.arrival(t.format.spokenTime(arrivalTime))}</p>
            </li>
            <li className="flex items-start gap-4">
              <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full ring-1 ring-gold/60">
                <CameraOff className="size-4 text-light-gold" strokeWidth={1.4} aria-hidden="true" />
              </span>
              <p>{t.announcement.photography}</p>
            </li>
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
