import { useId } from 'react';
import { cx } from '../../lib/cx';

function useSvgId(prefix: string): string {
  return prefix + useId().replace(/[^a-zA-Z0-9_-]/g, '');
}

interface SilkBowProps {
  className?: string;
  /** Ripple the tails gently. */
  animated?: boolean;
}

/** A satin bow with flowing tails. The knot sits at the centre of the top third. */
export function SilkBow({ className, animated = true }: SilkBowProps) {
  const id = useSvgId('bow');
  const satin = `url(#${id}-satin)`;
  const shade = `url(#${id}-shade)`;
  return (
    <svg viewBox="-80 -52 160 180" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-satin`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E7D7BC" />
          <stop offset="0.32" stopColor="#FBF5EB" />
          <stop offset="0.58" stopColor="#E2CFAF" />
          <stop offset="0.8" stopColor="#F6EDDF" />
          <stop offset="1" stopColor="#D4BD97" />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9AF85" stopOpacity="0.6" />
          <stop offset="1" stopColor="#C9AF85" stopOpacity="0" />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.4" floodColor="#6B5435" floodOpacity="0.26" />
        </filter>
      </defs>
      <g filter={`url(#${id}-shadow)`}>
        <path
          className={cx(animated && 'anim-ribbon-left')}
          d="M-4 4C-18 34-40 58-44 104L-33 95-26 112C-24 72-6 40 3 6Z"
          fill={satin}
        />
        <path
          className={cx(animated && 'anim-ribbon-right')}
          d="M3 4C16 30 30 62 26 118L37 106 46 121C50 70 30 34 8 2Z"
          fill={satin}
        />
        <path d="M-2-2C-24-32-66-44-70-18-73 4-36 10-2 4Z" fill={satin} />
        <path d="M-6-3C-26-22-52-28-56-14-57-4-34 2-6 2Z" fill={shade} />
        <path d="M2-2C24-34 68-42 70-14 72 8 34 10 2 4Z" fill={satin} />
        <path d="M6-3C26-24 54-28 56-12 57-2 34 2 6 2Z" fill={shade} />
        <path d="M-9-7C-4-11 4-11 9-7 11 0 9 7 4 9-1 10-6 9-9 6-11 1-11-3-9-7Z" fill={satin} />
        <path d="M-9-7C-4-11 4-11 9-7" fill="none" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="1" />
      </g>
    </svg>
  );
}

/** A horizontal satin band, like the ribbon wrapped around a printed card. */
export function SilkBand({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cx('h-3.5', className)}
      style={{
        background:
          'linear-gradient(180deg, #D9C29C 0%, #F1E4CF 22%, #FCF7EE 44%, #EADBC2 70%, #D3BB93 100%)',
        boxShadow: '0 1px 1px rgb(107 84 53 / 0.18), 0 6px 14px -8px rgb(107 84 53 / 0.35)',
      }}
    />
  );
}
