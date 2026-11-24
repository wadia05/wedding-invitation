import { cx } from '../../lib/cx';

interface GoldSeparatorProps {
  className?: string;
  /** Width of each side line, e.g. 'w-16'. */
  lineClassName?: string;
  tone?: 'gold' | 'light';
}

/** Hairline — diamond — hairline. Symmetric, so it ignores text direction. */
export function GoldSeparator({ className, lineClassName = 'w-14 sm:w-20', tone = 'gold' }: GoldSeparatorProps) {
  const color = tone === 'gold' ? 'var(--color-gold)' : 'var(--color-light-gold)';
  return (
    <div dir="ltr" className={cx('flex items-center justify-center gap-2.5', className)} aria-hidden="true">
      <span className={cx('h-px', lineClassName)} style={{ background: `linear-gradient(to right, transparent, ${color})` }} />
      <svg width="34" height="12" viewBox="0 0 34 12" fill="none" className="shrink-0">
        <circle cx="3" cy="6" r="1.3" fill={color} />
        <path d="M17 1 L22 6 L17 11 L12 6 Z" stroke={color} strokeWidth="0.9" />
        <circle cx="17" cy="6" r="1.4" fill={color} />
        <circle cx="31" cy="6" r="1.3" fill={color} />
      </svg>
      <span className={cx('h-px', lineClassName)} style={{ background: `linear-gradient(to left, transparent, ${color})` }} />
    </div>
  );
}
