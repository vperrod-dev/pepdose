/**
 * Convert a local date + time-of-day in a given IANA timezone into a UTC epoch ms.
 *
 * The app stores scheduled doses as a date string + 24h time string with no
 * timezone. A GLP-1 user who travels wants the reminder to fire at the intended
 * wall-clock time in their home timezone, not the device's current timezone.
 * This resolves the IANA zone's UTC offset for that instant and builds the
 * correct absolute timestamp.
 *
 * Falls back to naive local interpretation if the timezone is unknown.
 */
export function zonedTimeToUtc(dateStr: string, timeStr: string, timeZone: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mm] = timeStr.split(':').map(Number);
  if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return NaN;

  // Build the wall-clock time as if it were local, then shift by the zone offset.
  const naive = new Date(y, m - 1, d, hh, mm, 0, 0);
  const offsetMs = tzOffsetMs(naive.getTime(), timeZone);
  return naive.getTime() - offsetMs;
}

/** UTC offset (ms) that `timeZone` has at the given UTC instant. */
export function tzOffsetMs(utcMs: number, timeZone: string): number {
  try {
    // 'shortOffset' yields e.g. "GMT-7" / "GMT+5:30" — parse the numeric part.
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
    }).formatToParts(new Date(utcMs));
    const name = parts.find(p => p.type === 'timeZoneName')?.value ?? 'GMT';
    return parseShortOffset(name);
  } catch {
    return 0;
  }
}

function parseShortOffset(name: string): number {
  const m = name.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!m) return 0;
  const sign = m[1] === '-' ? -1 : 1;
  const hours = parseInt(m[2], 10) || 0;
  const mins = parseInt(m[3] ?? '0', 10) || 0;
  return sign * (hours * 60 + mins) * 60_000;
}
