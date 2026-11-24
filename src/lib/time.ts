/**
 * Time-zone helpers.
 *
 * The event time is a wall-clock time at the venue (e.g. 17:00 in Morocco).
 * To count down correctly from any country, we convert that wall-clock time
 * into an absolute instant using the venue's IANA time zone via Intl — never
 * the visitor's own browser time zone.
 */

export interface WallClockTime {
  year: number;
  /** 1–12 */
  month: number;
  day: number;
  hour: number;
  minute: number;
}

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timeZone: string): Intl.DateTimeFormat {
  let dtf = formatterCache.get(timeZone);
  if (!dtf) {
    dtf = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    formatterCache.set(timeZone, dtf);
  }
  return dtf;
}

/** Offset (ms) of `timeZone` from UTC at the given instant. */
export function getTimeZoneOffsetMs(timeZone: string, instantMs: number): number {
  const instant = Math.floor(instantMs / 1000) * 1000;
  const parts: Record<string, number> = {};
  for (const p of getFormatter(timeZone).formatToParts(new Date(instant))) {
    if (p.type !== 'literal') parts[p.type] = Number(p.value);
  }
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour % 24, parts.minute, parts.second);
  return asUtc - instant;
}

/** Parses '+01:00' / '-03:30' / 'Z' into milliseconds. */
export function parseUtcOffset(offset: string): number {
  if (offset === 'Z') return 0;
  const m = /^([+-])(\d{2}):?(\d{2})$/.exec(offset.trim());
  if (!m) throw new Error(`Invalid UTC offset: ${offset}`);
  const sign = m[1] === '-' ? -1 : 1;
  return sign * (Number(m[2]) * 60 + Number(m[3])) * 60_000;
}

/**
 * Converts a wall-clock time in `timeZone` to a UTC timestamp (ms).
 * Falls back to a fixed offset if the runtime lacks time-zone data.
 */
export function zonedTimeToUtc(wall: WallClockTime, timeZone: string, fallbackUtcOffset = 'Z'): number {
  const naive = Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute);
  try {
    const firstGuess = naive - getTimeZoneOffsetMs(timeZone, naive);
    // Re-check at the resulting instant in case a DST change lies between.
    const offset = getTimeZoneOffsetMs(timeZone, firstGuess);
    return naive - offset;
  } catch {
    return naive - parseUtcOffset(fallbackUtcOffset);
  }
}

/** Day of week (0 = Sunday) for a calendar date, independent of any time zone. */
export function weekdayOf(year: number, month: number, day: number): number {
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}
