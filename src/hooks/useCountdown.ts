import { useEffect, useMemo, useState } from 'react';
import { getCountdown, type CountdownState } from '../lib/countdown';

/**
 * Live countdown to `startMs`, re-rendering once per second, aligned to the
 * second boundary. Re-syncs immediately when the tab becomes visible again
 * (timers are throttled in background tabs).
 *
 * Returns `null` until mounted, so the prerendered HTML never contains a
 * stale build-time value.
 */
export function useCountdown(startMs: number, endMs: number): CountdownState | null {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    let timer: number | undefined;

    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current >= endMs) return; // nothing left to count
      timer = window.setTimeout(tick, 1000 - (current % 1000) + 10);
    };

    const onVisibility = () => {
      if (document.hidden) return;
      window.clearTimeout(timer);
      tick();
    };

    tick();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [endMs]);

  return useMemo(() => (now === null ? null : getCountdown(now, startMs, endMs)), [now, startMs, endMs]);
}
