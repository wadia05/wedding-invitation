import { describe, expect, it } from 'vitest';
import { buildMonthGrid, orderedWeekdays } from '../calendar';
import { getCountdown } from '../countdown';
import { daysInMonth, parseUtcOffset, weekdayOf, zonedTimeToUtc } from '../time';
import { eventDate, eventEndMs, eventStartMs, numericDate, validMapsUrl } from '../wedding';

describe('time zone conversion', () => {
  it('handles daylight-saving zones', () => {
    // New York is UTC-4 in July, UTC-5 in December.
    expect(
      new Date(zonedTimeToUtc({ year: 2026, month: 7, day: 1, hour: 12, minute: 0 }, 'America/New_York')).toISOString(),
    ).toBe('2026-07-01T16:00:00.000Z');
    expect(
      new Date(zonedTimeToUtc({ year: 2026, month: 12, day: 1, hour: 12, minute: 0 }, 'America/New_York')).toISOString(),
    ).toBe('2026-12-01T17:00:00.000Z');
  });

  it('falls back to the fixed offset for unknown zones', () => {
    const ms = zonedTimeToUtc({ year: 2026, month: 12, day: 12, hour: 17, minute: 0 }, 'Not/AZone', '+01:00');
    expect(new Date(ms).toISOString()).toBe('2026-12-12T16:00:00.000Z');
  });

  it('works in a fixed-offset zone regardless of tz database version', () => {
    const ms = zonedTimeToUtc({ year: 2026, month: 12, day: 12, hour: 17, minute: 0 }, 'Etc/GMT-1');
    expect(new Date(ms).toISOString()).toBe('2026-12-12T16:00:00.000Z');
  });

  it('parses offsets', () => {
    expect(parseUtcOffset('+01:00')).toBe(3_600_000);
    expect(parseUtcOffset('-03:30')).toBe(-12_600_000);
    expect(parseUtcOffset('Z')).toBe(0);
  });

  it('derives the event instant from the explicit venue offset (Morocco: UTC+0 since Sept 2026)', () => {
    expect(new Date(eventStartMs).toISOString()).toBe('2026-12-12T17:00:00.000Z');
    expect(eventEndMs).toBeGreaterThan(eventStartMs);
  });
});

describe('calendar', () => {
  it('knows 12 December 2026 is a Saturday', () => {
    expect(weekdayOf(2026, 12, 12)).toBe(6);
    expect(eventDate.weekday).toBe(6);
  });

  it('builds December 2026 with Monday as the first column', () => {
    const weeks = buildMonthGrid(2026, 12, 1);
    expect(daysInMonth(2026, 12)).toBe(31);
    // 1 December 2026 is a Tuesday → one empty Monday cell first.
    expect(weeks[0].days).toEqual([null, 1, 2, 3, 4, 5, 6]);
    // Saturday 12th sits in the Saturday column (index 5 when Monday-first).
    const week = weeks.find((w) => w.days.includes(12))!;
    expect(week.days.indexOf(12)).toBe(5);
    expect(weeks.at(-1)!.days).toEqual([28, 29, 30, 31, null, null, null]);
  });

  it('builds December 2026 with Sunday as the first column', () => {
    const weeks = buildMonthGrid(2026, 12, 0);
    expect(weeks[0].days).toEqual([null, null, 1, 2, 3, 4, 5]);
    const week = weeks.find((w) => w.days.includes(12))!;
    expect(week.days.indexOf(12)).toBe(6);
    expect(orderedWeekdays(0)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(orderedWeekdays(1)).toEqual([1, 2, 3, 4, 5, 6, 0]);
  });
});

describe('countdown', () => {
  const start = Date.UTC(2026, 11, 12, 17, 0, 0);
  const end = start + 6 * 3_600_000;

  it('splits remaining time into units', () => {
    const now = start - (2 * 86_400_000 + 3 * 3_600_000 + 4 * 60_000 + 5_000);
    expect(getCountdown(now, start, end)).toEqual({ status: 'upcoming', days: 2, hours: 3, minutes: 4, seconds: 5 });
  });

  it('rounds partial seconds up so it never hits zero early', () => {
    expect(getCountdown(start - 400, start, end)).toEqual({
      status: 'upcoming',
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 1,
    });
  });

  it('reports the live and past states', () => {
    expect(getCountdown(start, start, end)).toEqual({ status: 'live' });
    expect(getCountdown(end - 1, start, end)).toEqual({ status: 'live' });
    expect(getCountdown(end, start, end)).toEqual({ status: 'past' });
  });
});

describe('wedding helpers', () => {
  it('formats the numeric date', () => {
    expect(numericDate).toBe('12 / 12 / 2026');
  });

  it('accepts only https Google Maps links', () => {
    expect(validMapsUrl('https://maps.app.goo.gl/AbCdEf123')).toBe('https://maps.app.goo.gl/AbCdEf123');
    expect(validMapsUrl('https://www.google.com/maps/place/Casablanca')).not.toBeNull();
    expect(validMapsUrl('https://www.google.co.ma/maps/@33.5,-7.6,15z')).not.toBeNull();
    expect(validMapsUrl('https://goo.gl/maps/xyz')).not.toBeNull();
    expect(validMapsUrl('http://maps.app.goo.gl/x')).toBeNull();
    expect(validMapsUrl('https://www.google.com/search?q=x')).toBeNull();
    expect(validMapsUrl('https://evil.example/maps')).toBeNull();
    expect(validMapsUrl('javascript:alert(1)')).toBeNull();
    expect(validMapsUrl('')).toBeNull();
    expect(validMapsUrl(null)).toBeNull();
  });
});
