/**
 * Vite plugin: writes the page title, description, sharing (Open Graph)
 * tags, robots policy, font preloads and a no-JavaScript fallback into
 * index.html — all generated from src/config/wedding.ts so that nothing has
 * to be edited by hand in the HTML.
 */
import type { HtmlTagDescriptor, Plugin } from 'vite';
import { wedding } from '../src/config/wedding.ts';
import { translations } from '../src/i18n/index.ts';
import { arrivalTime, coupleNames, eventDate } from '../src/lib/wedding.ts';

const OG_LOCALES: Record<string, string> = { ar: 'ar_MA', fr: 'fr_FR', en: 'en_US' };

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Absolute site URL, needed because WhatsApp/Facebook only accept absolute
 * image URLs. Uses `siteUrl` from the config, otherwise the production domain
 * Vercel exposes at build time (this includes a custom domain once added).
 */
export function resolveSiteUrl(): string {
  const explicit = wedding.siteUrl.trim().replace(/\/+$/, '');
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  return vercel ? `https://${vercel.replace(/\/+$/, '')}` : '';
}

export function weddingMeta(): Plugin {
  return {
    name: 'wedding-meta',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const t = translations[wedding.defaultLanguage];
        const names = coupleNames(t);
        const title = t.meta.title(names, eventDate, t);
        const description = t.meta.description(names, eventDate, t);
        const en = translations.en;
        const enNames = coupleNames(en);
        const imageAlt = `${title} — ${en.meta.title(enNames, eventDate, en)}`;

        const site = resolveSiteUrl();
        const abs = (path: string) => (/^https?:\/\//.test(path) ? path : `${site}${path.startsWith('/') ? '' : '/'}${path}`);
        const image = site || /^https?:\/\//.test(wedding.shareImage) ? abs(wedding.shareImage) : wedding.shareImage;

        const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({ tag: 'meta', attrs, injectTo: 'head' });
        const tags: HtmlTagDescriptor[] = [
          { tag: 'title', children: escapeHtml(title), injectTo: 'head' },
          meta({ name: 'description', content: description }),
          meta({
            name: 'robots',
            content: wedding.allowSearchIndexing ? 'index, follow' : 'noindex, nofollow, noimageindex',
          }),
          meta({ property: 'og:type', content: 'website' }),
          meta({ property: 'og:site_name', content: title }),
          meta({ property: 'og:title', content: title }),
          meta({ property: 'og:description', content: description }),
          meta({ property: 'og:locale', content: OG_LOCALES[wedding.defaultLanguage] }),
          ...Object.entries(OG_LOCALES)
            .filter(([code]) => code !== wedding.defaultLanguage)
            .map(([, locale]) => meta({ property: 'og:locale:alternate', content: locale })),
          meta({ property: 'og:image', content: image }),
          meta({ property: 'og:image:type', content: 'image/jpeg' }),
          meta({ property: 'og:image:width', content: '1200' }),
          meta({ property: 'og:image:height', content: '630' }),
          meta({ property: 'og:image:alt', content: imageAlt }),
          meta({ name: 'twitter:card', content: 'summary_large_image' }),
          meta({ name: 'twitter:title', content: title }),
          meta({ name: 'twitter:description', content: description }),
          meta({ name: 'twitter:image', content: image }),
        ];

        if (site) {
          tags.push(
            meta({ property: 'og:url', content: `${site}/` }),
            { tag: 'link', attrs: { rel: 'canonical', href: `${site}/` }, injectTo: 'head' },
            ...Object.keys(OG_LOCALES).map(
              (code): HtmlTagDescriptor => ({
                tag: 'link',
                attrs: {
                  rel: 'alternate',
                  hreflang: code,
                  href: code === wedding.defaultLanguage ? `${site}/` : `${site}/?lang=${code}`,
                },
                injectTo: 'head',
              }),
            ),
          );
        }

        // Preload what paints the opening card: the video's poster (or, without
        // a video, the font of the couple's names) and the two baby's-breath
        // sprays (otherwise only discovered once the JavaScript has run).
        if (wedding.openingVideo) {
          tags.push({
            tag: 'link',
            attrs: { rel: 'preload', as: 'image', href: wedding.openingVideo.poster, fetchpriority: 'high' },
            injectTo: 'head',
          });
        }
        if (ctx.bundle) {
          const fonts = wedding.openingVideo
            ? []
            : wedding.defaultLanguage === 'ar'
              ? [/aref-ruqaa-arabic-700-normal.*\.woff2$/]
              : [/cormorant-garamond-latin-300-italic.*\.woff2$/];
          const images = [/gypsophila-corner-[\w-]+\.svg$/, /gypsophila-corner-alt-[\w-]+\.svg$/];
          for (const file of Object.keys(ctx.bundle)) {
            if (fonts.some((re) => re.test(file))) {
              tags.push({
                tag: 'link',
                attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${file}`, crossorigin: '' },
                injectTo: 'head',
              });
            } else if (images.some((re) => re.test(file))) {
              tags.push({
                tag: 'link',
                attrs: { rel: 'preload', as: 'image', type: 'image/svg+xml', href: `/${file}`, fetchpriority: 'high' },
                injectTo: 'head',
              });
            }
          }
        }

        // A readable invitation for browsers with JavaScript disabled.
        const noscript = [
          `<p>بسم الله الرحمن الرحيم</p>`,
          `<p style="font-size:1.5rem">${escapeHtml(t.opening.occasion)}</p>`,
          `<p style="font-size:2.4rem">${escapeHtml(`${names.bride} & ${names.groom}`)}</p>`,
          `<p>${escapeHtml(t.format.longDate(eventDate, t))} — ${escapeHtml(t.format.time(arrivalTime))}</p>`,
          `<p>${escapeHtml(t.announcement.arrival(t.format.spokenTime(arrivalTime)))}</p>`,
          `<p>${escapeHtml(t.announcement.photography)}</p>`,
        ].join('');

        return {
          html: html.replace('<!--NOSCRIPT_CONTENT-->', noscript),
          tags,
        };
      },
    },
  };
}
