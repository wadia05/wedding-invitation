interface KhatamStarProps {
  size?: number;
  className?: string;
}

/** The eight-pointed star of Moroccan zellige, drawn in a fine gold line. */
export function KhatamStar({ size = 28, className }: KhatamStarProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
    >
      <g vectorEffect="non-scaling-stroke" strokeWidth="1">
        <rect x="21" y="21" width="58" height="58" vectorEffect="non-scaling-stroke" />
        <rect x="21" y="21" width="58" height="58" transform="rotate(45 50 50)" vectorEffect="non-scaling-stroke" />
        <circle cx="50" cy="50" r="17" vectorEffect="non-scaling-stroke" />
        <path d="M50 33 L54 46 L67 50 L54 54 L50 67 L46 54 L33 50 L46 46 Z" vectorEffect="non-scaling-stroke" />
      </g>
      <circle cx="50" cy="50" r="3" fill="currentColor" stroke="none" />
    </svg>
  );
}
