import type { HealthMarker } from '../db/schema';
import { MEASUREMENT_KEYS } from './measurements';

const MEASUREMENT_SET = new Set<string>(MEASUREMENT_KEYS);

export interface MetricSpec {
  key: string;
  label: string;
  unit: string;
}

export interface ProgressEntry {
  key: string;
  label: string;
  unit: string;
  first: number;
  last: number;
  delta: number;
  count: number;
}

function valueOf(m: HealthMarker, key: string): number | undefined {
  const v = MEASUREMENT_SET.has(key)
    ? m.measurements?.[key]
    : (m as unknown as Record<string, number | undefined>)[key];
  return typeof v === 'number' ? v : undefined;
}

// Reduce logged markers to a per-metric first -> last change over the range.
// `markers` must be sorted ascending by date. Metrics with no data are omitted.
export function computeProgressSummary(
  markers: HealthMarker[],
  metrics: MetricSpec[],
  cutoff: string,
): ProgressEntry[] {
  const inRange = markers.filter(m => m.date >= cutoff);
  const out: ProgressEntry[] = [];
  for (const spec of metrics) {
    const vals = inRange
      .map(m => valueOf(m, spec.key))
      .filter((v): v is number => v !== undefined);
    if (vals.length === 0) continue;
    const first = vals[0];
    const last = vals[vals.length - 1];
    out.push({
      key: spec.key,
      label: spec.label,
      unit: spec.unit,
      first,
      last,
      delta: Math.round((last - first) * 100) / 100,
      count: vals.length,
    });
  }
  return out;
}
