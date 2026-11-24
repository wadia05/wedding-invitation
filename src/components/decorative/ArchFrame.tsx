/**
 * A pointed Moroccan arch drawn as a double gold hairline, for a card with
 * fixed 9:16 proportions (see `.card-box`). Because the proportions are fixed,
 * the geometry is static: it renders straight from the prerendered HTML, and
 * `vector-effect` keeps the lines a crisp 1px at any size.
 */

const W = 450;
const H = 800;
const TOP = 20; // room for the finial above the apex
const GAP = 8; // between the outer and inner lines
const POINTEDNESS = 0.62; // 0.5 = round arch; larger = more pointed

function archPath(x: number, y: number, w: number, h: number): string {
  const half = w / 2;
  const r = w * POINTEDNESS;
  const apex = Math.sqrt(r * r - (r - half) * (r - half));
  const spring = y + Math.min(apex, h * 0.6);
  const n = (v: number) => Math.round(v * 100) / 100;
  return `M${n(x)} ${n(y + h)}L${n(x)} ${n(spring)}A${n(r)} ${n(r)} 0 0 1 ${n(x + half)} ${n(spring - apex)}A${n(r)} ${n(r)} 0 0 1 ${n(x + w)} ${n(spring)}L${n(x + w)} ${n(y + h)}Z`;
}

const OUTER = archPath(0.5, TOP, W - 1, H - TOP - 0.5);
const INNER = archPath(GAP + 0.5, TOP + GAP, W - 2 * GAP - 1, H - TOP - 2 * GAP - 0.5);

/**
 * CSS mask in the shape of the arch's inner line, for content placed inside
 * the arch (e.g. the opening video). Apply to an element covering the card.
 */
export const ARCH_MASK = (() => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' preserveAspectRatio='none'><path d='${INNER}'/></svg>`;
  const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  return {
    maskImage: url,
    WebkitMaskImage: url,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
  } as const;
})();

interface ArchFrameProps {
  className?: string;
  /** Paint the card surface inside the arch. */
  fill?: string;
}

export function ArchFrame({ className, fill = 'none' }: ArchFrameProps) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden="true" fill="none" overflow="visible">
      <path d={OUTER} fill={fill} stroke="var(--color-gold)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path
        d={INNER}
        stroke="var(--color-gold)"
        strokeOpacity="0.55"
        strokeWidth="0.75"
        vectorEffect="non-scaling-stroke"
      />
      <g transform={`translate(${W / 2} ${TOP})`} stroke="var(--color-gold)" strokeWidth="0.9">
        <path d="M0 -3V-11" vectorEffect="non-scaling-stroke" />
        <path d="M0-16.5 3.2-12 0-7.5-3.2-12Z" fill="var(--color-paper)" vectorEffect="non-scaling-stroke" />
        <circle cx="0" cy="-1.5" r="1.4" fill="var(--color-gold)" stroke="none" />
      </g>
    </svg>
  );
}
