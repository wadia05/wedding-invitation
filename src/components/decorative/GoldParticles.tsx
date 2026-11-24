import type { CSSProperties } from 'react';
import { useOnScreen } from '../../hooks/useOnScreen';
import { cx } from '../../lib/cx';

interface Particle {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  dx: number;
  dy: number;
  opacity: number;
}

// Deterministic pseudo-random layout so the composition is stable.
function makeParticles(count: number, seed: number): Particle[] {
  let s = seed;
  const rnd = () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  return Array.from({ length: count }, () => {
    const duration = 11 + rnd() * 9;
    return {
      x: 4 + rnd() * 92,
      y: 20 + rnd() * 78,
      size: 2 + rnd() * 3.5,
      duration,
      delay: rnd() * duration,
      dx: (rnd() - 0.5) * 60,
      dy: -(90 + rnd() * 140),
      opacity: 0.45 + rnd() * 0.5,
    };
  });
}

interface GoldParticlesProps {
  count?: number;
  seed?: number;
  className?: string;
}

/** A few softly glowing gold motes drifting upwards. CSS-only, paused off screen. */
export function GoldParticles({ count = 14, seed = 7, className }: GoldParticlesProps) {
  const [ref, animate] = useOnScreen<HTMLDivElement>();
  const particles = makeParticles(count, seed);
  return (
    <div
      ref={ref}
      data-animate={animate}
      aria-hidden="true"
      className={cx('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={
            {
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              '--d': `${p.duration}s`,
              '--delay': `${-p.delay}s`,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              '--o': p.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
