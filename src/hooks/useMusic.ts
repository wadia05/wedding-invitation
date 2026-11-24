import { useContext } from 'react';
import { MusicContext, type MusicContextValue } from '../context/MusicContext';

export function useMusic(): MusicContextValue {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used inside <MusicProvider>');
  return ctx;
}
