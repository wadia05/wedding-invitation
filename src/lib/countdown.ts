export type CountdownState =
  | {
      status: 'upcoming';
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    }
  | { status: 'live' }
  | { status: 'past' };

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Pure countdown calculation, easy to test. */
export function getCountdown(nowMs: number, startMs: number, endMs: number): CountdownState {
  if (nowMs >= endMs) return { status: 'past' };
  if (nowMs >= startMs) return { status: 'live' };

  // Round up to the next whole second so the display never shows 0 early.
  const remaining = Math.ceil((startMs - nowMs) / SECOND) * SECOND;
  return {
    status: 'upcoming',
    days: Math.floor(remaining / DAY),
    hours: Math.floor((remaining % DAY) / HOUR),
    minutes: Math.floor((remaining % HOUR) / MINUTE),
    seconds: Math.floor((remaining % MINUTE) / SECOND),
  };
}
