import { AnimatePresence, m } from 'framer-motion';
import { VolumeX } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { useMusic } from '../../hooks/useMusic';

/** Floating play / pause control for the background music. */
export function MusicToggle({ visible }: { visible: boolean }) {
  const { playing, available, toggle } = useMusic();
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {visible && available && (
        <m.button
          type="button"
          onClick={toggle}
          aria-label={playing ? t.music.pause : t.music.play}
          title={playing ? t.music.pause : t.music.play}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="fixed end-4 z-40 grid size-[3.25rem] place-items-center rounded-full bg-navy text-light-gold shadow-[0_10px_28px_-10px_rgb(23_35_67/0.6)] ring-1 ring-gold/70 ring-offset-2 ring-offset-ivory/60 transition-transform hover:scale-105 active:scale-95 sm:end-6"
          style={{ bottom: 'max(1rem, calc(env(safe-area-inset-bottom) + 0.5rem))' }}
        >
          {playing ? (
            <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
              {[0, 0.25, 0.5, 0.15].map((delay, i) => (
                <span
                  key={i}
                  className="anim-eq block h-full w-[3px] rounded-full bg-light-gold"
                  style={{ animationDelay: `${delay}s`, animationDuration: `${0.9 + i * 0.12}s` }}
                />
              ))}
            </span>
          ) : (
            <VolumeX className="size-5" strokeWidth={1.5} aria-hidden="true" />
          )}
        </m.button>
      )}
    </AnimatePresence>
  );
}
