import type { DoseLog } from '../db/schema';

export interface SymptomPoint {
  date: string;            // yyyy-MM-dd
  severity: number;        // worst rating that day for the symptom
}

export interface SymptomTrend {
  name: string;
  count: number;           // number of logs mentioning it
  avgSeverity: number;     // mean severity across those logs
  maxSeverity: number;
  points: SymptomPoint[];   // one point per day (worst that day), date-sorted
}

/**
 * Aggregate logged symptoms into per-symptom trends. For each symptom we keep the
 * worst severity per day (so a day with two entries doesn't double a line), plus
 * summary stats. Sorted by how often the symptom appears, then severity.
 */
export function symptomTrends(logs: DoseLog[]): SymptomTrend[] {
  const byName = new Map<string, { total: number; count: number; max: number; perDay: Map<string, number> }>();

  for (const log of logs) {
    for (const s of log.symptoms ?? []) {
      if (!s.name || !(s.severity > 0)) continue;
      const entry = byName.get(s.name) ?? { total: 0, count: 0, max: 0, perDay: new Map() };
      entry.total += s.severity;
      entry.count += 1;
      entry.max = Math.max(entry.max, s.severity);
      entry.perDay.set(log.date, Math.max(entry.perDay.get(log.date) ?? 0, s.severity));
      byName.set(s.name, entry);
    }
  }

  const trends: SymptomTrend[] = [];
  for (const [name, e] of byName) {
    trends.push({
      name,
      count: e.count,
      avgSeverity: e.total / e.count,
      maxSeverity: e.max,
      points: [...e.perDay.entries()]
        .map(([date, severity]) => ({ date, severity }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    });
  }

  return trends.sort((a, b) => b.count - a.count || b.avgSeverity - a.avgSeverity);
}
