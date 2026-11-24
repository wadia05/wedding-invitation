import { Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { wedding } from '../../config/wedding';
import { useLanguage } from '../../hooks/useLanguage';
import { cx } from '../../lib/cx';
import { coupleNames } from '../../lib/wedding';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { MenuOverlay } from './MenuOverlay';

/** Slim fixed header: monogram, language switcher and section menu. */
export function Header({ visible, interactive }: { visible: boolean; interactive: boolean }) {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const names = coupleNames(t);
  // Over a hero photograph the transparent header needs light ink.
  const onPhoto = Boolean(wedding.heroPhoto) && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        inert={!interactive}
        className={cx(
          'fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,opacity] duration-500',
          scrolled ? 'bg-ivory/85 shadow-[0_1px_0_rgb(185_154_102/0.35)] backdrop-blur-md' : 'bg-transparent',
          visible ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
          <a
            href="#hero"
            className={cx(
              'font-display flex items-baseline gap-1.5 text-[1.65rem] leading-none transition-colors ar:text-[1.5rem]',
              onPhoto ? 'text-ivory' : 'text-navy',
            )}
            aria-label={t.nav.hero}
          >
            <span>{names.bride.charAt(0)}</span>
            <span className="ampersand text-lg">&amp;</span>
            <span>{names.groom.charAt(0)}</span>
          </a>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
              ref={menuButton}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t.a11y.openMenu}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              className={cx(
                'grid size-11 place-items-center rounded-full transition-colors',
                onPhoto ? 'text-ivory hover:bg-ivory/15' : 'text-navy hover:bg-cream/80',
              )}
            >
              <Menu className="size-5" strokeWidth={1.4} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <MenuOverlay
        open={menuOpen}
        onClose={() => {
          setMenuOpen(false);
          menuButton.current?.focus({ preventScroll: true });
        }}
      />
    </>
  );
}
