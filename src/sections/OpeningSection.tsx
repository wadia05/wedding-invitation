import { m, useReducedMotion, type Variants } from 'framer-motion';
import { useCallback, useEffect, useRef, type CSSProperties } from 'react';
import { ARCH_MASK, ArchFrame } from '../components/decorative/ArchFrame';
import { GoldParticles } from '../components/decorative/GoldParticles';
import { GoldSeparator } from '../components/decorative/GoldSeparator';
import { Gypsophila } from '../components/decorative/Gypsophila';
import { KhatamStar } from '../components/decorative/KhatamStar';
import { SilkBand, SilkBow } from '../components/decorative/SilkRibbon';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';
import { Ltr } from '../components/ui/Ltr';
import { EASE_LUXE } from '../components/ui/Reveal';
import { wedding } from '../config/wedding';
import type { ExperiencePhase } from '../context/ExperienceContext';
import { useLanguage } from '../hooks/useLanguage';
import { cx } from '../lib/cx';
import { coupleNames, numericDate } from '../lib/wedding';

interface OpeningSectionProps {
  phase: ExperiencePhase;
  onOpen: () => void;
  onDone: () => void;
}

const EASE_DOOR = [0.65, 0, 0.35, 1] as const;
const VIDEO = wedding.openingVideo;
const CARD_POSITION = cx(
  'card-box absolute left-1/2 -translate-x-1/2 -translate-y-1/2',
  // With a video the card is a little smaller and the button sits beneath
  // it, so nothing covers the text in the video.
  VIDEO ? 'card-box-video top-[46%]' : 'top-1/2',
);

/** Staggered CSS entrance (see .intro-rise in animations.css). */
const rise = (i: number) => ({ className: 'intro-rise', style: { '--i': i } as CSSProperties });

/**
 * SECTION 01 — the invitation card. Two arched “doors” share one artwork;
 * when the guest taps the button, the satin bow unties and the doors swing
 * open onto the invitation behind. Reduced-motion visitors get a simple fade,
 * and Escape (or a second tap) skips straight to the end.
 *
 * The entrance is pure CSS so it plays from the prerendered HTML before any
 * JavaScript has loaded; Framer Motion only drives the opening itself.
 * Sizes inside the card use container units (cqw = 1% of the card's width).
 *
 * When `wedding.openingVideo` is set, the video fills the arch in place of the
 * card's text. On opening, its current frame is painted onto both doors so the
 * picture itself splits open.
 */
export function OpeningSection({ phase, onOpen, onDone }: OpeningSectionProps) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const names = coupleNames(t);
  const opening = phase === 'opening';
  const finished = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const doorFrames = useRef<(HTMLCanvasElement | null)[]>([]);

  // React does not write the `muted` attribute into prerendered HTML, and
  // mobile browsers only autoplay muted video — so make sure here. If autoplay
  // is refused (e.g. iPhone low-power mode) the poster simply stays.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    if (reduce) v.pause();
    else v.play().catch(() => {});
  }, [reduce]);

  /** Copy the video's current frame onto the doors and stop the video. */
  const freezeVideo = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    if (v.readyState < 2 || !v.videoWidth) return; // doors keep showing the poster
    for (const c of doorFrames.current) {
      if (!c) continue;
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      c.getContext('2d')?.drawImage(v, 0, 0, c.width, c.height);
    }
  };

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onDone();
  }, [onDone]);

  useEffect(() => {
    if (!opening) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
    };
    document.addEventListener('keydown', onKey);
    // Safety net: never leave the guest stuck behind the card.
    const safety = window.setTimeout(finish, 3500);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(safety);
    };
  }, [opening, finish]);

  const door = (side: 'left' | 'right') => ({
    initial: false as const,
    animate: opening
      ? reduce
        ? { opacity: 0 }
        : { rotateY: side === 'left' ? 76 : -76, opacity: [1, 1, 0] }
      : { opacity: 1, rotateY: 0 },
    transition: opening
      ? reduce
        ? { duration: 0.5 }
        : {
            rotateY: { duration: 1.4, delay: 0.42, ease: EASE_DOOR },
            opacity: { duration: 1.4, delay: 0.42, times: [0, 0.62, 1] },
          }
      : { duration: 0 },
    onAnimationComplete: () => {
      if (opening) finish();
    },
    style: { transformOrigin: `${side} center` },
  });

  const content: Variants = {
    show: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0.985, transition: { duration: 0.45, ease: EASE_LUXE } },
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.a11y.invitationDialog}
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ perspective: '1800px' }}
      onClick={opening ? finish : undefined}
    >
      {/* Doors: two halves of the same artwork. */}
      <m.div className="absolute inset-y-0 left-0 w-1/2 overflow-hidden" {...door('left')}>
        <div className="absolute inset-y-0 left-0 w-[200%]">
          <CardArt frameRef={(el) => void (doorFrames.current[0] = el)} />
        </div>
      </m.div>
      <m.div className="absolute inset-y-0 right-0 w-1/2 overflow-hidden" {...door('right')}>
        <div className="absolute inset-y-0 right-0 w-[200%]">
          <CardArt frameRef={(el) => void (doorFrames.current[1] = el)} />
        </div>
      </m.div>

      {/* Card content. */}
      <m.div className="absolute inset-0" variants={content} initial={false} animate={opening ? 'leave' : 'show'}>
        <GoldParticles count={12} seed={3} />

        <div className="absolute inset-x-0 z-10 flex justify-center" style={{ top: 'max(0.75rem, env(safe-area-inset-top))' }}>
          <div {...rise(0)}>
            <LanguageSwitcher />
          </div>
        </div>

        <div className={CARD_POSITION}>
          {VIDEO ? (
            <>
              <video
                ref={videoRef}
                className="absolute inset-0 h-full w-full object-cover"
                style={ARCH_MASK}
                src={VIDEO.src}
                poster={VIDEO.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                disablePictureInPicture
                disableRemotePlayback
                aria-hidden="true"
                tabIndex={-1}
              />
              <ArchFrame className="pointer-events-none absolute inset-0 h-full w-full" />
              {/* The video shows the names and date; this is for screen readers. */}
              <h1 className="sr-only">
                {t.opening.occasion} — {names.bride} {t.script === 'arabic' ? 'و' : '&'} {names.groom} — {numericDate}
              </h1>
            </>
          ) : (
            <>
            <div className="absolute inset-x-[6cqw] top-[21cqw] bottom-[calc(var(--band-y)+5cqw)] flex flex-col items-center justify-center text-center">
              <div {...rise(1)}>
                <KhatamStar size={26} className="size-[7.5cqw] text-gold" />
              </div>
              <p
                lang="ar"
                dir="rtl"
                style={{ '--i': 2 } as CSSProperties}
                className="intro-rise font-arabic mt-[2.5cqw] text-[4.9cqw] leading-[1.6] text-navy/80"
              >
                بسم الله الرحمن الرحيم
              </p>
              <div {...rise(3)}>
                <GoldSeparator className="mt-[2cqw]" lineClassName="w-[11cqw]" />
              </div>
              <p
                style={{ '--i': 4 } as CSSProperties}
                className={cx(
                  'intro-rise mt-[3cqw] text-gold-ink',
                  t.script === 'arabic' ? 'font-display text-[8.6cqw] leading-[1.45]' : 'eyebrow !text-[3.3cqw]',
                )}
              >
                {t.opening.occasion}
              </p>
              <h1
                style={{ '--i': 5 } as CSSProperties}
                className={cx(
                  'intro-rise font-display mt-[1cqw] flex flex-col items-center text-navy',
                  'ar:text-[15.5cqw] ar:leading-[0.98] ar:font-bold',
                  'latin:text-[17cqw] latin:italic latin:leading-[1.02]',
                )}
              >
                <span>{names.bride}</span>
                <span aria-hidden="true" className="ampersand my-[1cqw] text-[8cqw] leading-none ar:mb-[-0.3em]">
                  &amp;
                </span>
                <span>{names.groom}</span>
              </h1>
              <div {...rise(6)}>
                <GoldSeparator className="mt-[4.5cqw]" lineClassName="w-[13cqw]" />
              </div>
              <p
                style={{ '--i': 7 } as CSSProperties}
                className="intro-rise numerals mt-[3cqw] text-[5.6cqw] tracking-[0.3em] text-navy/85"
              >
                <Ltr>{numericDate}</Ltr>
              </p>
            </div>

            {/* The bow that “ties” the card closed — it unties first. */}
            <m.div
              className="pointer-events-none absolute left-1/2 z-10 w-[27cqw]"
              style={{ bottom: 'calc(var(--band-y) + 1.8cqw)', x: '-50%', y: '71%' }}
              variants={{
                show: { opacity: 1, scale: 1, y: '71%' },
                leave: { opacity: 0, scale: 1.18, y: '60%', transition: { duration: 0.45, ease: EASE_LUXE } },
              }}
            >
              <div className="intro-bow">
                <SilkBow className="block w-full" />
              </div>
            </m.div>
            </>
          )}

          <div
            className={cx(
              'absolute inset-x-0 z-20 flex justify-center',
              VIDEO ? 'top-[calc(100%+4cqw)]' : 'bottom-[6cqw]',
            )}
          >
            <div {...rise(8)}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (phase !== 'closed') return;
                  freezeVideo();
                  onOpen();
                }}
                disabled={phase !== 'closed'}
                className={cx(
                  'anim-halo anim-glint relative isolate overflow-hidden rounded-full bg-navy px-[9cqw] text-ivory',
                  'h-[14.5cqw] min-h-11 transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]',
                )}
              >
                <span aria-hidden="true" className="pointer-events-none absolute inset-[3px] rounded-full border border-gold/55" />
                <span className="relative block whitespace-nowrap ar:font-arabic ar:text-[5.4cqw] latin:font-sans latin:text-[3.2cqw] latin:font-medium latin:uppercase latin:tracking-[0.22em]">
                  {t.opening.cta}
                </span>
              </button>
            </div>
          </div>
        </div>
      </m.div>
    </div>
  );
}

/** The paper, florals, arch frame and ribbon band — drawn once per door. */
function CardArt({ frameRef }: { frameRef: (el: HTMLCanvasElement | null) => void }) {
  return (
    <div
      className="paper-grain absolute inset-0"
      style={{
        background:
          'radial-gradient(120% 75% at 50% 42%, var(--color-paper) 0%, var(--color-ivory) 48%, var(--color-cream) 100%)',
      }}
    >
      <div className={CARD_POSITION} style={{ filter: 'drop-shadow(0 22px 34px rgb(110 85 50 / 0.13))' }}>
        <ArchFrame className="absolute inset-0 h-full w-full" fill="rgb(253 251 247 / 0.78)" />
        {VIDEO ? (
          <>
            <img
              src={VIDEO.poster}
              alt=""
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={ARCH_MASK}
            />
            <canvas ref={frameRef} aria-hidden="true" className="absolute inset-0 h-full w-full" style={ARCH_MASK} />
            <ArchFrame className="absolute inset-0 h-full w-full" />
          </>
        ) : (
          <div className="absolute -inset-x-2" style={{ bottom: 'var(--band-y)' }}>
            <SilkBand className="!h-[3.6cqw]" />
          </div>
        )}
      </div>
      <Gypsophila
        variant="corner"
        eager
        flip="xy"
        className="right-[-24%] top-[-9%] w-[min(66vw,24rem)] opacity-95 sm:right-[-4%] sm:top-[-6%]"
      />
      <Gypsophila
        variant="cornerAlt"
        eager
        className="bottom-[-7%] left-[-20%] w-[min(64vw,23rem)] opacity-95 sm:bottom-[-5%] sm:left-[-3%]"
      />
    </div>
  );
}
