import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef, type MouseEvent } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useScrollLock } from '../../hooks/useScrollLock';
import { numericDate } from '../../lib/wedding';
import { GoldSeparator } from '../decorative/GoldSeparator';
import { KhatamStar } from '../decorative/KhatamStar';
import { Ltr } from '../ui/Ltr';
import { EASE_LUXE } from '../ui/Reveal';

export const SECTION_IDS = ['hero', 'countdown', 'invitation', 'calendar', 'details', 'note'] as const;

interface MenuOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    closeButton.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !panel.current) return;
      const focusable = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const goTo = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    onClose();
    // Wait for the scroll lock to be released before scrolling.
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }),
      ),
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <m.div
          ref={panel}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t.a11y.mainNavigation}
          className="paper-grain fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ivory"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE_LUXE }}
          style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex h-16 shrink-0 items-center justify-end px-4 sm:px-8">
            <button
              ref={closeButton}
              type="button"
              onClick={onClose}
              aria-label={t.a11y.closeMenu}
              className="grid size-11 place-items-center rounded-full text-navy transition-colors hover:bg-cream"
            >
              <X className="size-6" strokeWidth={1.3} aria-hidden="true" />
            </button>
          </div>

          <nav aria-label={t.a11y.mainNavigation} className="flex flex-1 flex-col items-center justify-center px-6 pb-16">
            <KhatamStar size={28} className="mb-8 text-gold" />
            <ol className="flex flex-col items-center gap-1 text-center">
              {SECTION_IDS.map((id, i) => (
                <m.li
                  key={id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.08 + i * 0.06, ease: EASE_LUXE }}
                >
                  <a
                    href={`#${id}`}
                    onClick={goTo(id)}
                    className="font-display group flex items-baseline gap-3 rounded px-3 py-1.5 text-[2.1rem] leading-snug text-navy transition-colors hover:text-gold-ink ar:text-[1.9rem]"
                  >
                    <span className="numerals text-xs tracking-[0.2em] text-gold" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {t.nav[id]}
                  </a>
                </m.li>
              ))}
            </ol>
            <GoldSeparator className="mt-10" />
            <p className="numerals mt-4 text-sm tracking-[0.3em] text-navy/70">
              <Ltr>{numericDate}</Ltr>
            </p>
          </nav>
        </m.div>
      )}
    </AnimatePresence>
  );
}
