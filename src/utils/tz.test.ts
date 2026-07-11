import { describe, it, expect } from 'vitest';
import { zonedTimeToUtc, tzOffsetMs } from './tz';

describe('tzOffsetMs', () => {
  it('returns 0 for an unknown timezone (graceful fallback)', () => {
    expect(tzOffsetMs(0, 'Not/AZone')).toBe(0);
  });
  it('parses a positive whole-hour offset', () => {
    // Asia/Kolkata is +5:30; pick an instant well inside that rule.
    const ms = tzOffsetMs(Date.UTC(2026, 0, 15, 12, 0, 0), 'Asia/Kolkata');
    expect(ms).toBe((5 * 60 + 30) * 60_000);
  });
  it('parses a negative offset', () => {
    const ms = tzOffsetMs(Date.UTC(2026, 0, 15, 12, 0, 0), 'America/Los_Angeles');
    expect(ms).toBeLessThan(0);
  });
});

describe('zonedTimeToUtc', () => {
  it('handles invalid input gracefully', () => {
    expect(Number.isNaN(zonedTimeToUtc('bad', '08:00', 'UTC'))).toBe(true);
  });
  it('converts a UTC noon wall-clock to the same UTC instant', () => {
    const ms = zonedTimeToUtc('2026-01-15', '12:00', 'UTC');
    expect(new Date(ms).toISOString()).toBe('2026-01-15T12:00:00.000Z');
  });
  it('shifts a fixed wall-clock time by the zone offset', () => {
    // 08:00 in a +2 zone => 06:00 UTC.
    const ms = zonedTimeToUtc('2026-01-15', '08:00', 'Africa/Cairo');
    expect(new Date(ms).toISOString()).toBe('2026-01-15T06:00:00.000Z');
  });
  it('respects DST for the given instant', () => {
    // US Pacific in summer (PDT, -7) vs winter (PST, -8).
    const summer = zonedTimeToUtc('2026-07-01', '09:00', 'America/Los_Angeles');
    const winter = zonedTimeToUtc('2026-01-01', '09:00', 'America/Los_Angeles');
    // Summer 09:00 PDT => 16:00 UTC; winter 09:00 PST => 17:00 UTC.
    expect(new Date(summer).toISOString()).toBe('2026-07-01T16:00:00.000Z');
    expect(new Date(winter).toISOString()).toBe('2026-01-01T17:00:00.000Z');
  });
});
