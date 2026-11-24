import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { weddingMeta } from './build/weddingMeta.ts';

export default defineConfig({
  plugins: [react(), tailwindcss(), weddingMeta()],
  build: {
    sourcemap: false,
    // Decorative SVGs are referenced by URL so the browser can cache them.
    assetsInlineLimit: 4096,
  },
});
