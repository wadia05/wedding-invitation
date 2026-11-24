#!/usr/bin/env node
/**
 * Injects the server-rendered invitation into dist/index.html.
 * Runs after `vite build` and `vite build --ssr src/entry-server.tsx`
 * (see the "build" script in package.json).
 */
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const ssrDir = join(root, 'dist-ssr');
const indexPath = join(root, 'dist', 'index.html');

const { render } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);
const html = readFileSync(indexPath, 'utf8');
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error('prerender: #root placeholder not found in dist/index.html');

const markup = render();
writeFileSync(indexPath, html.replace(marker, `<div id="root">${markup}</div>`));
rmSync(ssrDir, { recursive: true, force: true });

console.log(`prerender: injected ${(markup.length / 1024).toFixed(1)} KB of HTML into dist/index.html`);
