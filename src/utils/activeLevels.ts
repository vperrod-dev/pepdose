// Pure math for the "Active Levels" chart: estimate how much of each compound is
// still in the body over time, summed from actual logged doses plus (for the
// projection past "now") upcoming scheduled doses. Levels are relative
// dose-equivalents — absolute serum concentration isn't knowable — so the UI
// normalizes each peptide to its own recent peak.

export interface DoseEvent {
  ts: number;     // epoch ms of the injection
  dose: number;   // amount in the peptide's own unit
  future: boolean; // true for projected (scheduled, not yet logged) doses
}

export interface PeptideSeries {
  peptideId: string;
  halfLifeHours: number;
  events: DoseEvent[];
}

/** Remaining dose-equivalent from a single injection after `hoursElapsed`. */
export function decayAt(dose: number, halfLifeHours: number, hoursElapsed: number): number {
  if (hoursElapsed < 0 || halfLifeHours <= 0) return 0;
  return dose * Math.pow(0.5, hoursElapsed / halfLifeHours);
}

/** Summed level for one peptide at time `t` (ms), from all events at or before t. */
export function levelAt(series: PeptideSeries, t: number): number {
  let total = 0;
  for (const e of series.events) {
    if (e.ts > t) continue;
    total += decayAt(e.dose, series.halfLifeHours, (t - e.ts) / 3_600_000);
  }
  return total;
}

export interface CurrentStatus {
  level: number;        // absolute dose-equivalent right now
  peak: number;         // max over the sampled window
  pctOfPeak: number;    // 0..100
  rising: boolean;      // level higher than 6h ago
  lastDoseTs: number | null;
  nextDoseTs: number | null;
}

/**
 * Current status for a peptide at time `now`, given the sampled window peak.
 * `lastDoseTs`/`nextDoseTs` come from the event list (past logs / future scheduled).
 */
export function currentStatus(series: PeptideSeries, now: number, peak: number): CurrentStatus {
  const level = levelAt(series, now);
  const prev = levelAt(series, now - 6 * 3_600_000);
  const past = series.events.filter(e => !e.future && e.ts <= now).map(e => e.ts);
  const future = series.events.filter(e => e.ts > now).map(e => e.ts);
  return {
    level,
    peak,
    pctOfPeak: peak > 0 ? Math.min(100, (level / peak) * 100) : 0,
    rising: level > prev + 1e-9,
    lastDoseTs: past.length ? Math.max(...past) : null,
    nextDoseTs: future.length ? Math.min(...future) : null,
  };
}

/**
 * Sample every peptide's level across [start, end] into chart rows keyed by
 * peptideId, plus the per-peptide peak used for normalization.
 */
export function sampleLevels(
  seriesList: PeptideSeries[],
  start: number,
  end: number,
  points: number,
): { rows: Record<string, number>[]; peaks: Record<string, number> } {
  const rows: Record<string, number>[] = [];
  const peaks: Record<string, number> = {};
  const step = points > 0 ? (end - start) / points : 0;

  for (let i = 0; i <= points; i++) {
    const t = start + i * step;
    const row: Record<string, number> = { time: t };
    for (const s of seriesList) {
      const lvl = levelAt(s, t);
      row[s.peptideId] = lvl;
      peaks[s.peptideId] = Math.max(peaks[s.peptideId] ?? 0, lvl);
    }
    rows.push(row);
  }
  return { rows, peaks };
}
