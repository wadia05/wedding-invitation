import { m, type Variants } from 'framer-motion';
import { GoldParticles } from '../components/decorative/GoldParticles';
import { GoldSeparator } from '../components/decorative/GoldSeparator';
import { Gypsophila } from '../components/decorative/Gypsophila';
import { Ltr } from '../components/ui/Ltr';
import { EASE_LUXE } from '../components/ui/Reveal';
import { wedding, type HeroPhoto } from '../config/wedding';
import { useExperience } from '../hooks/useExperience';
import { useLanguage } from '../hooks/useLanguage';
import { useOnScreen } from '../hooks/useOnScreen';
import { cx } from '../lib/cx';
import { coupleNames, eventDate, localize, numericDate } from '../lib/wedding';

/**
 * SECTION 02 — Hero. Typographic by default; when a couple photograph is set
 * in src/config/wedding.ts it becomes a full-height portrait with the names
 * set over it.
 */
export function HeroSection() {
  const { t, lang } = useLanguage();
  const phase = useExperience();
  const [ref, animate] = useOnScreen<HTMLElement>();
  const names = coupleNames(t);
  const photo = wedding.heroPhoto;
  const onPhoto = Boolean(photo);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.13, delayChildren: 0.5 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 1.3, ease: EASE_LUXE } },
  };

  return (
    <section
      id="hero"
      ref={ref}
      data-animate={animate}
      aria-labelledby="hero-title"
      className={cx(
        'relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pb-28 pt-24',
        onPhoto ? 'bg-navy' : 'paper-grain',
      )}
      style={
        onPhoto
          ? undefined
          : {
              background:
                'radial-gradient(90% 60% at 50% 45%, var(--color-paper) 0%, var(--color-ivory) 55%, var(--color-cream) 100%)',
            }
      }
    >
      {photo ? (
        <PhotoBackdrop photo={photo} alt={localize(photo.alt, lang) ?? ''} />
      ) : (
        <>
          <HeroWatermark />
          <Gypsophila
            variant="corner"
            eager
            sway
            flip="y"
            className="left-[-22%] top-[-4%] w-[min(62vw,25rem)] sm:left-[-4%]"
          />
          <Gypsophila
            variant="cornerAlt"
            eager
            sway
            swayDelay={4}
            flip="xy"
            className="right-[-22%] top-[-4%] w-[min(62vw,25rem)] sm:right-[-4%]"
          />
          <Gypsophila variant="sprig" className="bottom-[5%] left-[5%] hidden w-40 opacity-90 md:block" />
          <Gypsophila variant="sprig" flip="x" className="bottom-[5%] right-[5%] hidden w-40 opacity-90 md:block" />
        </>
      )}
      <GoldParticles count={16} seed={11} />

      <m.div
        variants={container}
        initial="hidden"
        animate={phase === 'closed' ? 'hidden' : 'show'}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <m.p
          variants={item}
          className={cx(
            'flex items-center gap-3',
            onPhoto ? 'text-light-gold' : 'text-gold-ink',
            t.script === 'arabic' ? 'font-display text-[2rem] leading-[1.6]' : 'eyebrow !text-inherit',
          )}
        >
          <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
          {t.hero.occasion}
          <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
        </m.p>

        <h1
          id="hero-title"
          className={cx(
            'font-display mt-3 flex flex-col items-center',
            onPhoto ? 'text-ivory' : 'text-navy',
            'ar:text-[clamp(4.4rem,23vw,8.75rem)] ar:font-bold ar:leading-[1.12]',
            'latin:text-[clamp(4.4rem,21vw,9rem)] latin:italic latin:leading-[0.98]',
          )}
        >
          <m.span variants={item}>{names.bride}</m.span>
          <m.span variants={item} className="ampersand my-1 text-[clamp(2.4rem,11vw,4rem)] leading-none ar:mb-[-0.38em]">
            <span aria-hidden="true">&amp;</span>
            <span className="sr-only">{t.script === 'arabic' ? 'و' : '&'}</span>
          </m.span>
          <m.span variants={item}>{names.groom}</m.span>
        </h1>

        <m.div variants={item}>
          <GoldSeparator className="mt-7" tone={onPhoto ? 'light' : 'gold'} />
        </m.div>

        <m.p
          variants={item}
          className={cx('mt-5 text-[1.15rem] ar:text-[1.25rem]', onPhoto ? 'text-ivory/90' : 'text-text/85')}
        >
          {t.format.longDate(eventDate, t)}
        </m.p>
        <m.p
          variants={item}
          className={cx(
            'numerals mt-1 text-[1.35rem] tracking-[0.34em]',
            onPhoto ? 'text-light-gold' : 'text-navy',
          )}
        >
          <Ltr>{numericDate}</Ltr>
        </m.p>
      </m.div>

      <m.a
        href="#countdown"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'open' ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className={cx(
          'absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 rounded px-3 py-1',
          onPhoto ? 'text-light-gold' : 'text-gold-ink',
        )}
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <span className={cx('whitespace-nowrap text-[0.95rem]', t.script === 'latin' && 'eyebrow !text-inherit')}>{t.hero.scrollCue}</span>
        <span aria-hidden="true" className="anim-cue block h-10 w-px bg-current" />
      </m.a>
    </section>
  );
}

function PhotoBackdrop({ photo, alt }: { photo: HeroPhoto; alt: string }) {
  return (
    <div className="absolute inset-0 -z-10">
      <picture>
        {photo.mobileSrc && <source media="(max-width: 767px)" srcSet={photo.mobileSrc} />}
        <img
          src={photo.src}
          alt={alt}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
          style={{ objectPosition: photo.position ?? 'center 30%' }}
        />
      </picture>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgb(23 35 67 / 0.82) 0%, rgb(23 35 67 / 0.45) 38%, rgb(23 35 67 / 0.15) 65%, rgb(23 35 67 / 0.35) 100%)',
        }}
      />
    </div>
  );
}

/** A large, faint zellige star behind the names. */
function HeroWatermark() {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[min(118vw,40rem)] -translate-x-1/2 -translate-y-1/2 text-gold opacity-[0.13]"
      fill="none"
      stroke="currentColor"
    >
      <g strokeWidth="0.16">
        <rect x="19" y="19" width="62" height="62" transform="rotate(22.5 50 50)" />
        <rect x="19" y="19" width="62" height="62" transform="rotate(67.5 50 50)" />
        <circle cx="50" cy="50" r="43.5" />
        <circle cx="50" cy="50" r="42.6" strokeDasharray="0.4 1.2" />
      </g>
    </svg>
  );
}
