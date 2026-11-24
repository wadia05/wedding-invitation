import { LANGUAGES, translations } from '../../i18n';
import { useLanguage } from '../../hooks/useLanguage';
import { cx } from '../../lib/cx';

interface LanguageSwitcherProps {
  className?: string;
}

/** Arabic / Français / English — switches instantly, without reloading. */
export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { lang, setLang, t } = useLanguage();
  return (
    <div
      role="group"
      aria-label={t.a11y.chooseLanguage}
      dir="ltr"
      className={cx(
        'inline-flex items-center rounded-full border border-gold/45 bg-paper/75 p-[3px] backdrop-blur-sm',
        className,
      )}
    >
      {LANGUAGES.map((code) => {
        const tr = translations[code];
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            lang={tr.htmlLang}
            aria-pressed={active}
            aria-label={tr.nativeName}
            title={tr.nativeName}
            onClick={() => setLang(code)}
            className={cx(
              'h-9 min-w-11 rounded-full px-2.5 transition-colors duration-300',
              code === 'ar' ? 'font-arabic text-[0.95rem] leading-none' : 'font-sans text-[0.7rem] font-medium tracking-[0.16em]',
              active ? 'bg-navy text-ivory shadow-sm' : 'text-navy/80 hover:text-navy hover:bg-cream/70',
            )}
          >
            {tr.shortName}
          </button>
        );
      })}
    </div>
  );
}
