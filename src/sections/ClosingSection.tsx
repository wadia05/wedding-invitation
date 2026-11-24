import { m } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { GoldParticles } from '../components/decorative/GoldParticles';
import { Gypsophila } from '../components/decorative/Gypsophila';
import { KhatamStar } from '../components/decorative/KhatamStar';
import { Ltr } from '../components/ui/Ltr';
import { EASE_LUXE, Reveal } from '../components/ui/Reveal';
import { useLanguage } from '../hooks/useLanguage';
import { useOnScreen } from '../hooks/useOnScreen';
import { coupleNames, numericDate } from '../lib/wedding';

/** SECTION 08 — a blessing, the couple's names and a soft fade to paper. */
export function ClosingSection() {
  const { t } = useLanguage();
  const [ref, animate] = useOnScreen<HTMLElement>();
  const names = coupleNames(t);

  return (
    <section
      id="closing"
      ref={ref}
      data-animate={animate}
      aria-labelledby="closing-title"
      className="paper-grain relative overflow-hidden px-6 pb-40 pt-20 sm:pt-28"
      style={{ background: 'linear-gradient(to bottom, var(--color-ivory) 0%, var(--color-paper) 70%)' }}
    >
      <GoldParticles count={14} seed={23} />

      <div className="relative mx-auto flex max-w-xl flex-col items-center text-center">
        <m.div
          className="w-[min(64vw,17rem)]"
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.6, ease: EASE_LUXE }}
        >
          <Gypsophila variant="bouquet" inFlow sway className="w-full" />
        </m.div>

        <Reveal className="mt-10">
          <p className="text-balance text-[1.35rem] leading-relaxed text-text ar:text-[1.45rem] ar:leading-[1.95]">
            {t.closing.line1}
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-3">
          <p className="text-balance text-[1.2rem] italic leading-relaxed text-text/80 ar:text-[1.3rem] ar:not-italic ar:leading-[1.95]">
            {t.closing.line2}
          </p>
        </Reveal>

        <m.h2
          id="closing-title"
          className="font-display mt-10 text-navy ar:text-[3.4rem] ar:font-bold ar:leading-[1.45] latin:text-[3.6rem] latin:italic latin:leading-[1.1] sm:ar:text-[4.2rem] sm:latin:text-[4.6rem]"
          initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.8, ease: EASE_LUXE }}
        >
          {names.bride} <span className="ampersand mx-1 text-[0.6em]">&amp;</span> {names.groom}
        </m.h2>

        <m.span
          aria-hidden="true"
          className="gold-hairline mt-5 block h-px w-40"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.5, ease: EASE_LUXE }}
        />

        <Reveal delay={0.3}>
          <p className="numerals mt-5 text-[1.3rem] tracking-[0.34em] text-navy/85">
            <Ltr>{numericDate}</Ltr>
          </p>
        </Reveal>

        <m.div
          initial={{ opacity: 0, rotate: -45 }}
          whileInView={{ opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.6, ease: EASE_LUXE }}
          className="mt-9"
        >
          <KhatamStar size={28} className="text-gold" />
        </m.div>

        <Reveal delay={0.4} className="mt-12">
          <a
            href="#hero"
            className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-gold-ink transition-colors hover:text-navy"
          >
            <ArrowUp className="size-4" strokeWidth={1.4} aria-hidden="true" />
            <span className="ar:text-[1rem] latin:font-sans latin:text-[0.7rem] latin:font-medium latin:uppercase latin:tracking-[0.22em]">
              {t.a11y.backToTop}
            </span>
          </a>
        </Reveal>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-paper))' }}
      />
    </section>
  );
}
