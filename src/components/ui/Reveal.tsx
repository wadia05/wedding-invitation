import { m } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Distance travelled upwards, px. */
  y?: number;
  /** Fraction of the element that must be visible before it reveals. */
  amount?: number;
}

export const EASE_LUXE = [0.22, 1, 0.36, 1] as const;

/** Fades content up softly the first time it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 22, amount = 0.25 }: RevealProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1.1, delay, ease: EASE_LUXE }}
    >
      {children}
    </m.div>
  );
}
