import { GoldSeparator } from '../decorative/GoldSeparator';
import { cx } from '../../lib/cx';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  tone?: 'light' | 'dark';
  className?: string;
}

/** Eyebrow, display title and a gold separator — the shared section opener. */
export function SectionHeading({ id, eyebrow, title, tone = 'light', className }: SectionHeadingProps) {
  const dark = tone === 'dark';
  return (
    <Reveal className={cx('flex flex-col items-center text-center', className)}>
      <p className={cx('eyebrow', dark && '!text-light-gold')}>{eyebrow}</p>
      <h2
        id={id}
        className={cx(
          'font-display mt-2 text-balance leading-[1.15]',
          'text-[2.6rem] sm:text-6xl ar:text-[2.4rem] ar:leading-[1.5] sm:ar:text-[3.25rem]',
          dark ? 'text-ivory' : 'text-navy',
        )}
      >
        {title}
      </h2>
      <GoldSeparator className="mt-4" tone={dark ? 'light' : 'gold'} />
    </Reveal>
  );
}
