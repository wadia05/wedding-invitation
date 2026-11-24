import { daysInMonth, weekdayOf } from './time';

export interface CalendarWeek {
  /** Day numbers; `null` for leading/trailing empty cells. */
  days: (number | null)[];
}

/**
 * Builds the weeks of a month for display, with the first column being
 * `weekStartsOn` (0 = Sunday, 1 = Monday).
 */
export function buildMonthGrid(year: number, month: number, weekStartsOn: 0 | 1): CalendarWeek[] {
  const total = daysInMonth(year, month);
  const lead = (weekdayOf(year, month, 1) - weekStartsOn + 7) % 7;

  const cells: (number | null)[] = Array.from({ length: lead }, () => null);
  for (let d = 1; d <= total; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: CalendarWeek[] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push({ days: cells.slice(i, i + 7) });
  return weeks;
}

/** Weekday indices (0 = Sunday) in display order. */
export function orderedWeekdays(weekStartsOn: 0 | 1): number[] {
  return Array.from({ length: 7 }, (_, i) => (i + weekStartsOn) % 7);
}
