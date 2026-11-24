import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion';
import { StrictMode } from 'react';
import { App } from './App';
import { LanguageProvider } from './context/LanguageContext';
import { MusicProvider } from './context/MusicContext';
import type { LanguageCode } from './i18n';

/** The whole invitation with its providers — shared by the browser and the build-time prerender. */
export function Root({ initialLanguage }: { initialLanguage: LanguageCode }) {
  return (
    <StrictMode>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <LanguageProvider initial={initialLanguage}>
            <MusicProvider>
              <App />
            </MusicProvider>
          </LanguageProvider>
        </MotionConfig>
      </LazyMotion>
    </StrictMode>
  );
}
