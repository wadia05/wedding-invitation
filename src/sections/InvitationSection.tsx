import { GoldSeparator } from '../components/decorative/GoldSeparator';
import { Gypsophila } from '../components/decorative/Gypsophila';
import { KhatamStar } from '../components/decorative/KhatamStar';
import { Reveal } from '../components/ui/Reveal';
import { useLanguage } from '../hooks/useLanguage';
import { useOnScreen } from '../hooks/useOnScreen';
import { coupleNames } from '../lib/wedding';

/** SECTION 04 — the invitation itself, set like an editorial letter. */
export function InvitationSection() {
  const { t } = useLanguage();
  const [ref, animate] = useOnScreen<HTMLElement>();
  const names = coupleNames(t);

  return (
    <section
      id="invitation"
      ref={ref}
      data-animate={animate}
      aria-labelledby="invitation-title"
      className="paper-grain relative overflow-hidden bg-ivory px-6 pb-48 pt-24 sm:pb-56 sm:pt-36"
    >
      <Gypsophila variant="corner" sway className="-bottom-12 -left-20 w-[min(46vw,20rem)] opacity-90 sm:-left-8" />
      <Gypsophila
        variant="cornerAlt"
        sway
        swayDelay={3}
        flip="x"
        className="-bottom-12 -right-20 w-[min(46vw,20rem)] opacity-90 sm:-right-8"
      />

      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center text-center">
        <Reveal>
          <h2 id="invitation-title" className="eyebrow">
            {t.invitation.eyebrow}
          </h2>
        </Reveal>

        <Reveal delay={0.05} className="mt-8">
          <p lang="ar" dir="rtl" className="font-arabic text-[1.85rem] leading-[1.8] text-navy sm:text-[2.2rem]">
            بسم الله الرحمن الرحيم
          </p>
          {t.invitation.basmalaTranslation && (
            <p className="mt-1 text-[1.05rem] italic text-text/70">{t.invitation.basmalaTranslation}</p>
          )}
        </Reveal>

        <Reveal delay={0.1}>
          <KhatamStar size={30} className="my-9 text-gold" />
        </Reveal>

        <Reveal>
          <p className="text-balance text-[1.4rem] leading-relaxed text-text ar:text-[1.45rem] ar:leading-[1.9]">
            {t.invitation.lead}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <p
            className="font-display my-6 text-navy ar:text-[3.4rem] ar:font-bold ar:leading-[1.45] latin:text-[3.6rem] latin:italic latin:leading-[1.1] sm:ar:text-[4rem] sm:latin:text-[4.4rem]"
          >
            {names.bride} <span className="ampersand mx-1 text-[0.6em]">&amp;</span> {names.groom}
          </p>
        </Reveal>

        <Reveal>
          <GoldSeparator />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 text-pretty text-[1.2rem] leading-[1.85] text-text/90 ar:text-[1.3rem] ar:leading-[2.1]">
            {t.invitation.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
