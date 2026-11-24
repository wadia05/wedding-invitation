# رانية & سعيد — Digital Wedding Invitation

A single-page digital invitation for the **عقد قران** of **Rania & Said** on
**Saturday 12 December 2026 at 17:00 (Morocco)**. Guests open one link (e.g.
from WhatsApp), tap **«افتحوا دعوتنا»**, and the arched card opens onto the
invitation.

- Arabic (default, right-to-left), French and English, switchable instantly
- Live countdown that is correct from any country
- December 2026 calendar, event details, important note, closing blessing
- Optional background music, started only by the guest's tap
- No forms, no RSVP, no database, no tracking — a static site

Built with React, TypeScript, Vite, Tailwind CSS and Framer Motion. The page
is prerendered to HTML at build time, so the card appears before any
JavaScript has loaded.

---

## Quick start

Requires **Node.js 20.19+** (22 LTS recommended).

```bash
npm install
npm run dev        # local preview at http://localhost:5173
npm test           # unit tests (countdown, time zone, calendar, map links)
npm run build      # production build into dist/
npm run preview    # serve the production build at http://localhost:4173
```

---

## Updating the wedding information

Everything lives in **`src/config/wedding.ts`**.

| Setting | What it does |
| --- | --- |
| `couple` | Names in Arabic and in Latin letters (used for French/English) |
| `event.year / month / day` | Date of the ceremony |
| `event.arrivalHour / arrivalMinute` | Arrival time (venue's local time), e.g. `17` and `0` |
| `event.utcOffset` | The venue's offset from UTC **on the wedding day** — see the note below |
| `event.durationHours` | How long the countdown shows “the celebration has begun” |
| `venueName`, `venueAddress` | Venue details; `null` shows “to be announced” |
| `googleMapsUrl` | Google Maps link; the directions button appears only when set |
| `heroPhoto` | The couple's photograph; `null` keeps the typographic design |
| `openingVideo` | Video shown inside the arch of the opening card; `null` shows the typographic card |
| `backgroundMusic` | Music file, volume, and whether it starts when the card is opened |
| `shareImage` | Picture shown in WhatsApp/Facebook link previews |
| `siteUrl` | Public address; leave empty on Vercel (detected automatically) |
| `allowSearchIndexing` | `false` keeps the invitation out of Google results |
| `defaultLanguage` | `'ar'`, `'fr'` or `'en'` |

Text values can be one string for every language, or one per language:

```ts
venueName: { ar: 'قاعة …', fr: 'Salle …', en: '… Hall' },
venueAddress: 'Route …, Casablanca',
```

### Time zone note (important)

Morocco returned to **GMT (UTC+0) all year round on 20 September 2026**. Phones
that have not received that time-zone update still assume UTC+1, so the
countdown does not rely on the phone's time-zone data: it uses
`event.utcOffset` (`'+00:00'`). If the time policy ever changes again before
the wedding, update this one value. (In development, the browser console warns
if `utcOffset` and the browser's own time-zone data disagree.)

### Adding the venue and directions

1. Open the venue in Google Maps → **Share** → **Copy link**
   (looks like `https://maps.app.goo.gl/…`).
2. Paste it as `googleMapsUrl`, and fill `venueName` / `venueAddress`.

Only `https://` Google Maps links are accepted; anything else is ignored, so a
broken or unsafe link is never shown.

---

## Replacing the photograph

1. Choose a high-quality portrait (vertical) photo.
2. Resize and compress it — about **1600 px tall, WebP, under ~300 KB**. Either
   use <https://squoosh.app> (WebP, quality ~78), or on the command line:
   ```bash
   cwebp -q 78 -resize 0 1600 photo.jpg -o public/images/couple.webp
   ```
3. Put it in `public/images/` and set in `src/config/wedding.ts`:
   ```ts
   heroPhoto: {
     src: '/images/couple.webp',
     mobileSrc: '/images/couple-mobile.webp', // optional, tighter crop for phones
     alt: { ar: 'رانية وسعيد', fr: 'Rania et Said', en: 'Rania and Said' },
     position: 'center 30%', // which part of the photo stays visible when cropped
   },
   ```

The names are then set in ivory over the photograph, with a soft navy
gradient for legibility.

## The opening video

The opening card plays `public/video/opening.mp4` inside the arch (muted,
looping), with the button «افتحوا دعوتنا» beneath it. The video carries the
names and date itself, so the card shows no text over it. When the guest taps
the button, the current frame splits open with the two doors.
Guests who prefer reduced motion see the still poster instead.

To replace it, use a vertical **9:16** clip and compress it (about 1–2 MB):

```bash
ffmpeg -i new-video.mp4 -an -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p \
  -movflags +faststart public/video/opening.mp4
ffmpeg -i new-video.mp4 -frames:v 1 -q:v 4 public/video/opening-poster.jpg
```

Set `openingVideo: null` to go back to the typographic card.

## Replacing the music

The included track (`public/audio/placeholder-music.mp3`) is an **original
placeholder** generated by `scripts/generate-placeholder-music.py` — no
third-party recording is used.

To use the family's chosen song (you must have the right to use it):

1. Export it as **MP3, 128 kbps** (mono is fine), ideally under 3 MB.
2. Save it as e.g. `public/audio/music.mp3`.
3. Set `backgroundMusic.src: '/audio/music.mp3'`.

Music only starts after the guest taps «افتحوا دعوتنا» (as mobile browsers
require), pauses when they switch apps, and the floating button remembers
their choice for the visit. Set `startOnOpen: false` to start muted.

## Editing the texts and translations

All visible text is in `src/i18n/ar.ts`, `fr.ts` and `en.ts`. Each file
follows the same structure (enforced by TypeScript, so nothing can be
forgotten). The Arabic month names can be switched to the Moroccan forms
(يناير … دجنبر) — the alternative is noted in `ar.ts`.

To send guests a link in a specific language, add `?lang=fr` or `?lang=en`:
`https://your-domain/?lang=fr`.

## The sharing image

`public/og-image.jpg` (1200 × 630) is what WhatsApp shows under the link. It is
rendered from `scripts/og/og-template.html`; instructions to regenerate it are
at the top of that file. Any 1200 × 630 JPG can replace it.

WhatsApp caches previews: after changing it, test with a fresh link such as
`https://your-domain/?v=2`.

---

## Deployment (GitHub + Vercel)

No environment variables, database or backend are needed.

1. **GitHub** — create an empty repository (private is fine), then:
   ```bash
   git init
   git add .
   git commit -m "Wedding invitation"
   git branch -M main
   git remote add origin https://github.com/<account>/<repository>.git
   git push -u origin main
   ```
2. **Vercel** — at <https://vercel.com/new>, import the repository. The
   settings in `vercel.json` are picked up automatically (Vite, `npm run build`,
   output `dist`). Click **Deploy**.
3. **Custom domain (optional)** — in the Vercel project: **Settings → Domains**,
   add the domain and follow the DNS instructions. HTTPS is automatic. Redeploy
   once afterwards so the sharing tags use the new domain.

Every push to `main` redeploys the site. Previews and the site stay available
for as long as the Vercel project, the GitHub repository and any custom domain
are kept active and renewed under the family's own accounts.

---

## Privacy

- No forms, accounts, analytics, cookies or third-party requests: fonts,
  images and music are all served from the site itself.
- The only things stored are the chosen language and the music on/off choice,
  in the browser's session storage, and they never leave the guest's device.
- Search engines are asked not to index the page (`allowSearchIndexing: false`).
- Security headers (including a Content-Security-Policy) are set in
  `vercel.json`.

---

## Project structure

```
src/
  config/wedding.ts        ← all wedding details
  i18n/ar.ts fr.ts en.ts   ← all texts
  sections/                ← the eight sections (Opening … Closing)
  components/
    decorative/            ← arch frame, gold separator, khatam star, florals, ribbon, particles
    layout/                ← header and section menu
    ui/                    ← language switcher, music button, reveal animation …
  context/ hooks/          ← language, music, countdown, opening state
  lib/                     ← time zones, calendar, countdown, helpers (+ unit tests)
  styles/                  ← design tokens, fonts, animations
  assets/decor/            ← baby's-breath illustrations (generated)
public/                    ← favicon, sharing image, audio, photos
build/weddingMeta.ts       ← generates the page title, description and sharing tags
scripts/                   ← generators (florals, music), prerender, sharing-image template
```

Design tokens (`--color-ivory`, `--color-cream`, `--color-navy`,
`--color-gold`, `--color-light-gold`, `--color-text`, …) are defined in
`src/styles/globals.css`.

## Credits and licences

- Fonts: **Amiri**, **Aref Ruqaa**, **Cormorant Garamond**, **Jost** — SIL Open
  Font License, self-hosted via Fontsource.
- Icons: **Lucide** (ISC licence).
- Baby's-breath illustrations, ornaments and placeholder music: original work
  generated by the scripts in `scripts/`.
