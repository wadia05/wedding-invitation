#!/usr/bin/env node
/**
 * Procedural baby's-breath (gypsophila) illustrations.
 *
 * Generates the decorative floral SVGs used across the invitation into
 * src/assets/decor/. Output is deterministic (seeded), so re-running this
 * script reproduces the same artwork. Run with:  npm run generate:florals
 *
 * Every illustration is original vector art produced by this script — no
 * third-party imagery is involved.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets', 'decor');

/* ------------------------------------------------------------------ utils */

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n) => (Math.round(n * 10) / 10).toString();
const deg = (d) => (d * Math.PI) / 180;

/* --------------------------------------------------------------- palettes */

const PALETTES = {
  // On ivory / champagne paper.
  paper: {
    stem: '#9AA38B',
    stemOpacity: 0.75,
    leaf: '#A7AF95',
    petal: '#FFFFFF',
    petalBack: '#F1EADF',
    petalStroke: '#C9B89C',
    heart: '#F4EDE0',
    dot: '#D6C69C',
    bud: '#EEF0E4',
    budStroke: '#AEB59D',
    shadow: '#5E4B33',
    shadowOpacity: 0.32,
  },
  // On deep navy.
  night: {
    stem: '#C9CFBB',
    stemOpacity: 0.45,
    leaf: '#B9C0A7',
    petal: '#FFFFFF',
    petalBack: '#DCD9D2',
    petalStroke: '#CBC1AF',
    heart: '#F5EFE4',
    dot: '#E6D9B5',
    bud: '#E9ECDF',
    budStroke: '#C7CDB6',
    shadow: '#02050F',
    shadowOpacity: 0.6,
  },
};

/* ------------------------------------------------------------ flower defs */

function flowerSymbols(p) {
  // Overlapping petal circles with a fine warm outline give the ruffled,
  // double-flowered look of gypsophila. "Back" variants are a touch warmer
  // to add depth to the clouds.
  const shapes = [
    { petals: 5, pr: 2.75, pd: 2.05, rot: 0 },
    { petals: 6, pr: 2.45, pd: 2.2, rot: 15 },
    { petals: 7, pr: 2.2, pd: 2.35, rot: 8 },
  ];
  const out = [];
  shapes.forEach((v, i) => {
    for (const [suffix, fill] of [
      ['', p.petal],
      ['b', p.petalBack],
    ]) {
      const circles = [];
      for (let k = 0; k < v.petals; k++) {
        const a = deg(v.rot + (360 / v.petals) * k);
        circles.push(
          `<circle cx="${f(Math.cos(a) * v.pd)}" cy="${f(Math.sin(a) * v.pd)}" r="${v.pr}"/>`,
        );
      }
      out.push(
        `<symbol id="f${i}${suffix}" overflow="visible">` +
          `<g fill="${fill}" stroke="${p.petalStroke}" stroke-width="0.26">${circles.join('')}</g>` +
          `<circle r="0.6" fill="${p.dot}"/>` +
          `</symbol>`,
      );
    }
  });
  return out.join('');
}

/* ------------------------------------------------------------ the grower */

/**
 * Gypsophila grows as a loose panicle: wiry stems throw out side branches at
 * intervals, and every branch ends in a small, rounded "cloudlet" of blooms.
 */
function createSpray(seed, opts = {}) {
  const rand = mulberry32(seed);
  const r = (a, b) => a + rand() * (b - a);
  const flowerScale = opts.flowerScale ?? 1.12;
  const stems = [];
  const flowers = [];
  const buds = [];
  const leaves = [];
  const pts = [];

  const addFlower = (x, y, s) => {
    const k = s * flowerScale;
    flowers.push({ x, y, s: k, v: Math.floor(rand() * 3), back: rand() < 0.3 });
    pts.push([x - 6 * k, y - 6 * k], [x + 6 * k, y + 6 * k]);
  };

  const segment = (x, y, angle, len, width) => {
    const bend = r(-0.3, 0.3);
    const ex = x + Math.cos(angle) * len;
    const ey = y + Math.sin(angle) * len;
    const cx = x + Math.cos(angle + bend) * len * 0.5;
    const cy = y + Math.sin(angle + bend) * len * 0.5;
    stems.push({ d: `M${f(x)} ${f(y)}Q${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}`, w: width });
    pts.push([x, y], [ex, ey]);
    return { x: ex, y: ey, a: Math.atan2(ey - cy, ex - cx) };
  };

  /** A tiny dichotomous fork that gathers blooms into a rounded puff. */
  function cloudlet(x, y, angle, len, depth, width) {
    const end = segment(x, y, angle, len, width);
    if (depth === 0) {
      if (rand() < 0.12) {
        buds.push({ x: end.x, y: end.y, r: r(1.3, 1.9) * flowerScale * 0.75 });
        pts.push([end.x, end.y]);
      } else {
        addFlower(end.x, end.y, r(0.82, 1.18));
      }
      return;
    }
    const n = rand() < 0.3 ? 3 : 2;
    const spread = r(0.75, 1.15);
    for (let i = 0; i < n; i++) {
      const a = end.a + (i - (n - 1) / 2) * spread + r(-0.2, 0.2);
      cloudlet(end.x, end.y, a, len * r(0.6, 0.85), depth - 1, Math.max(width * 0.75, 0.3));
    }
  }

  /** A wiry stem with alternate side branches, ending in a cloudlet. */
  function stem(x, y, angle, length, width, level = 0) {
    const steps = 5;
    const seg = length / steps;
    let cur = { x, y, a: angle };
    const curl = r(-0.07, 0.07);
    let side = rand() < 0.5 ? -1 : 1;
    for (let i = 1; i <= steps; i++) {
      cur = segment(cur.x, cur.y, cur.a + curl + r(-0.06, 0.06), seg, width * (1 - i * 0.08));
      const t = i / steps;
      if (t < 0.3 || t === 1) continue;
      if (level === 0 && t < 0.5 && rand() < 0.5) {
        leaves.push({ x: cur.x, y: cur.y, a: cur.a + side * r(0.3, 0.5), l: r(14, 22) });
      }
      const branches = level === 0 ? (rand() < 0.45 ? 2 : 1) : rand() < 0.75 ? 1 : 0;
      for (let b = 0; b < branches; b++) {
        side = -side;
        const ba = cur.a + side * r(0.42, 0.85);
        const bl = length * r(0.32, 0.5) * (1.15 - t * 0.6);
        if (level === 0 && bl > 46) {
          stem(cur.x, cur.y, ba, bl, width * 0.62, 1);
        } else {
          const tip = segment(cur.x, cur.y, ba, bl * 0.7, width * 0.55);
          cloudlet(tip.x, tip.y, tip.a, r(7, 11), bl > 26 ? 3 : 2, width * 0.45);
        }
      }
    }
    cloudlet(cur.x, cur.y, cur.a, r(8, 12), 3, width * 0.5);
  }

  return { stem, r, stems, flowers, buds, leaves, pts };
}

function leafPath({ x, y, a, l }) {
  const w = l * 0.13;
  const tx = x + Math.cos(a) * l;
  const ty = y + Math.sin(a) * l;
  const nx = Math.cos(a + Math.PI / 2) * w;
  const ny = Math.sin(a + Math.PI / 2) * w;
  const mx = x + Math.cos(a) * l * 0.4;
  const my = y + Math.sin(a) * l * 0.4;
  return `M${f(x)} ${f(y)}Q${f(mx + nx)} ${f(my + ny)} ${f(tx)} ${f(ty)}Q${f(mx - nx)} ${f(my - ny)} ${f(x)} ${f(y)}Z`;
}

/* ------------------------------------------------------------ satin bow */

/** A silk bow with flowing tails, centred on (0, 0) — the knot. */
function bowSvg() {
  return (
    `<defs>` +
    `<linearGradient id="satin" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="#E7D7BC"/><stop offset="0.32" stop-color="#FBF5EB"/>` +
    `<stop offset="0.58" stop-color="#E2CFAF"/><stop offset="0.8" stop-color="#F6EDDF"/>` +
    `<stop offset="1" stop-color="#D4BD97"/></linearGradient>` +
    `<linearGradient id="satinShade" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="#CDB48A" stop-opacity="0.55"/><stop offset="1" stop-color="#CDB48A" stop-opacity="0"/></linearGradient>` +
    `<filter id="bowsh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="1.6" stdDeviation="2.2" flood-color="#6B5435" flood-opacity="0.28"/></filter>` +
    `</defs>` +
    `<g filter="url(#bowsh)">` +
    // tails
    `<path d="M-4 4C-18 34-40 58-44 104L-33 95-26 112C-24 72-6 40 3 6Z" fill="url(#satin)"/>` +
    `<path d="M3 4C16 30 30 62 26 118L37 106 46 121C50 70 30 34 8 2Z" fill="url(#satin)"/>` +
    // loops
    `<path d="M-2-2C-24-32-66-44-70-18-73 4-36 10-2 4Z" fill="url(#satin)"/>` +
    `<path d="M-6-3C-26-22-52-28-56-14-57-4-34 2-6 2Z" fill="url(#satinShade)"/>` +
    `<path d="M2-2C24-34 68-42 70-14 72 8 34 10 2 4Z" fill="url(#satin)"/>` +
    `<path d="M6-3C26-24 54-28 56-12 57-2 34 2 6 2Z" fill="url(#satinShade)"/>` +
    // knot
    `<path d="M-9-7C-4-11 4-11 9-7 11 0 9 7 4 9-1 10-6 9-9 6-11 1-11-3-9-7Z" fill="url(#satin)"/>` +
    `<path d="M-9-7C-4-11 4-11 9-7" fill="none" stroke="#FFFFFF" stroke-opacity="0.6" stroke-width="1"/>` +
    `</g>`
  );
}

/* --------------------------------------------------------------- render */

function renderSvg({ spray, palette, extraStems = [], bowAt = null, pad = 6 }) {
  const p = PALETTES[palette];
  const { stems, flowers, buds, leaves, pts } = spray;

  // Fit the viewBox to the artwork.
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const allPts = [...pts];
  for (const s of extraStems) allPts.push(...s.pts);
  if (bowAt) allPts.push([bowAt[0] - 75, bowAt[1] - 48], [bowAt[0] + 75, bowAt[1] + 125]);
  for (const [x, y] of allPts) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  minX -= pad;
  minY -= pad;
  const W = Math.ceil(maxX - minX + pad);
  const H = Math.ceil(maxY - minY + pad);

  // Draw small/back flowers first so the larger, brighter ones sit on top.
  const ordered = [...flowers].sort((a, b) => Number(b.back) - Number(a.back) || a.s - b.s);

  const stemPaths = [...extraStems, ...stems]
    .map((s) => `<path d="${s.d}" stroke-width="${f(s.w)}"/>`)
    .join('');
  const leafPaths = leaves.map((l) => `<path d="${leafPath(l)}"/>`).join('');
  const budEls = buds.map((b) => `<circle cx="${f(b.x)}" cy="${f(b.y)}" r="${f(b.r)}"/>`).join('');
  const flowerEls = ordered
    .map(
      (fl) =>
        `<use href="#f${fl.v}${fl.back ? 'b' : ''}" transform="translate(${Math.round(fl.x)} ${Math.round(fl.y)})scale(${f(fl.s)})"/>`,
    )
    .join('');

  const bow = bowAt ? `<g transform="translate(${f(bowAt[0])} ${f(bowAt[1])})">${bowSvg()}</g>` : '';

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${f(minX)} ${f(minY)} ${W} ${H}" width="${W}" height="${H}">` +
    // No SVG filter here: the soft shadow under the blooms is a CSS
    // drop-shadow on the <img> (GPU-composited, far cheaper on phones).
    `<defs>` +
    flowerSymbols(p) +
    `</defs>` +
    `<g fill="none" stroke="${p.stem}" stroke-opacity="${p.stemOpacity}" stroke-linecap="round">${stemPaths}</g>` +
    `<g fill="${p.leaf}" opacity="0.75">${leafPaths}</g>` +
    bow +
    `<g fill="${p.bud}" stroke="${p.budStroke}" stroke-width="0.4">${budEls}</g>` +
    `<g>${flowerEls}</g>` +
    `</svg>`;

  const anchor = (x, y) => [Math.round(((x - minX) / W) * 1000) / 1000, Math.round(((y - minY) / H) * 1000) / 1000];
  return { svg, anchor };
}

/* ---------------------------------------------------------- compositions */

/** A spray that grows from an origin towards the upper right. */
function corner(seed, palette) {
  const s = createSpray(seed);
  const mains = [
    { a: -80, l: 205 },
    { a: -55, l: 235 },
    { a: -28, l: 200 },
    { a: -8, l: 150 },
  ];
  for (const m of mains) s.stem(0, 0, deg(m.a + s.r(-4, 4)), m.l * s.r(0.92, 1.06), 1.5);
  return renderSvg({ spray: s, palette }).svg;
}

/** A tied bouquet: stems fan upwards from a satin bow. */
function bouquet(seed, palette) {
  const s = createSpray(seed);
  const extraStems = [];
  for (let i = 0; i < 9; i++) {
    const off = (i - 4) * 2;
    const endX = off * 4 + s.r(-3, 3);
    const endY = 120 - s.r(0, 22);
    extraStems.push({
      d: `M${f(off)} 0Q${f(off * 2.1)} ${f(endY / 2)} ${f(endX)} ${f(endY)}`,
      w: s.r(1.2, 1.7),
      pts: [[endX, endY]],
    });
  }
  const mains = [-150, -128, -108, -90, -72, -52, -30];
  for (const a of mains) {
    const len = 230 - Math.abs(a + 90) * 0.7 + s.r(-14, 14);
    s.stem(s.r(-3, 3), 0, deg(a + s.r(-3, 3)), len, 1.5);
  }
  return renderSvg({ spray: s, palette, extraStems, bowAt: [0, 4] }).svg;
}

/** A small sprig for intimate details (calendar date, notes). */
function sprig(seed, palette, flowerScale = 1.05) {
  const s = createSpray(seed, { flowerScale });
  const mains = [
    { a: -66, l: 105 },
    { a: -32, l: 92 },
  ];
  for (const m of mains) s.stem(0, 0, deg(m.a + s.r(-3, 3)), m.l, 1.15);
  return renderSvg({ spray: s, palette }).svg;
}

/* ---------------------------------------------------------------- output */

const files = {
  'gypsophila-corner.svg': corner(11, 'paper'),
  'gypsophila-corner-alt.svg': corner(47, 'paper'),
  'gypsophila-bouquet.svg': bouquet(23, 'paper'),
  'gypsophila-sprig.svg': sprig(31, 'paper'),
};

mkdirSync(OUT_DIR, { recursive: true });
for (const [name, svg] of Object.entries(files)) {
  writeFileSync(join(OUT_DIR, name), svg + '\n');
  console.log(`${name.padEnd(30)} ${(svg.length / 1024).toFixed(1)} KB`);
}
