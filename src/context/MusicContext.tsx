import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { wedding } from '../config/wedding';
import { readSession, writeSession } from '../lib/storage';

export interface MusicContextValue {
  playing: boolean;
  /** False when no track is configured or the file failed to load. */
  available: boolean;
  toggle: () => void;
  /** Called from the “open the invitation” tap — a genuine user gesture. */
  startWithInvitation: () => void;
}

export const MusicContext = createContext<MusicContextValue | null>(null);

const PREF_KEY = 'music';
const FADE_STEP_MS = 40;

export function MusicProvider({ children }: { children: ReactNode }) {
  const { src, volume, startOnOpen } = wedding.backgroundMusic;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimer = useRef<number | null>(null);
  const resumeWhenVisible = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(Boolean(src));

  const getAudio = useCallback((): HTMLAudioElement => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audio.preload = 'auto';
      audio.addEventListener('play', () => setPlaying(true));
      audio.addEventListener('pause', () => setPlaying(false));
      audio.addEventListener('error', () => {
        setAvailable(false);
        setPlaying(false);
      });
      audio.src = src;
      audioRef.current = audio;
    }
    return audioRef.current;
  }, [src]);

  // Warm up the track once the page is idle so it starts promptly on tap.
  useEffect(() => {
    if (!src || !startOnOpen) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    const id = w.requestIdleCallback ? w.requestIdleCallback(() => getAudio()) : window.setTimeout(getAudio, 1500);
    return () => {
      if (!w.requestIdleCallback) window.clearTimeout(id);
    };
  }, [src, startOnOpen, getAudio]);

  const fadeTo = useCallback((audio: HTMLAudioElement, target: number, ms: number, done?: () => void) => {
    if (fadeTimer.current) window.clearInterval(fadeTimer.current);
    const from = audio.volume;
    const steps = Math.max(1, Math.round(ms / FADE_STEP_MS));
    let i = 0;
    fadeTimer.current = window.setInterval(() => {
      i += 1;
      // iOS ignores programmatic volume; the fade simply has no audible effect there.
      audio.volume = Math.min(1, Math.max(0, from + (target - from) * (i / steps)));
      if (i >= steps) {
        if (fadeTimer.current) window.clearInterval(fadeTimer.current);
        fadeTimer.current = null;
        done?.();
      }
    }, FADE_STEP_MS);
  }, []);

  const play = useCallback(() => {
    if (!src) return;
    const audio = getAudio();
    if (audio.paused) audio.volume = 0;
    // play() must be called synchronously inside the tap handler for mobile browsers.
    const attempt = audio.play();
    const onStarted = () => {
      setPlaying(true);
      fadeTo(audio, volume, 1400);
    };
    if (attempt) attempt.then(onStarted).catch(() => setPlaying(false));
    else onStarted();
  }, [src, volume, getAudio, fadeTo]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    setPlaying(false);
    if (!audio) return;
    fadeTo(audio, 0, 350, () => audio.pause());
  }, [fadeTo]);

  const toggle = useCallback(() => {
    if (playing) {
      writeSession(PREF_KEY, 'off');
      pause();
    } else {
      writeSession(PREF_KEY, 'on');
      play();
    }
  }, [playing, play, pause]);

  const startWithInvitation = useCallback(() => {
    if (!startOnOpen || !available) return;
    if (readSession(PREF_KEY) === 'off') return;
    play();
  }, [startOnOpen, available, play]);

  // Be polite: stop when the guest switches apps or tabs, resume on return.
  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) {
        if (!audio.paused) {
          resumeWhenVisible.current = true;
          audio.pause();
        }
      } else if (resumeWhenVisible.current) {
        resumeWhenVisible.current = false;
        audio.play().catch(() => setPlaying(false));
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(
    () => () => {
      if (fadeTimer.current) window.clearInterval(fadeTimer.current);
      audioRef.current?.pause();
    },
    [],
  );

  const value = useMemo(
    () => ({ playing, available, toggle, startWithInvitation }),
    [playing, available, toggle, startWithInvitation],
  );
  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}
