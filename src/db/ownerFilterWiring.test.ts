// Every profile-scoped read must pass through the owner filter.
//
// Supabase RLS cannot help here: Victor and Nadia share one login, so
// `auth.uid()` is identical for both and the policies in
// supabase/migrations/0001_init.sql only separate this account from other
// accounts. Isolation between the two profiles is entirely client-side — and
// this repo has already shipped two leaks from a call site that forgot to
// apply it (DoseActionSheet, and the import default-owner bug).
//
// So the guard lives here: if a screen reads a collection whose rows carry an
// `owner`, it has to filter by owner (or say why not). Reads the sources as
// text on purpose — importing the pages would drag in IndexedDB and the router.
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// db/operations helpers that return rows carrying an `owner` field.
const OWNER_BEARING_READS = [
  'getAllDoseLogs',
  'getProtocols',
  'getScheduledDosesForDate',
  'getScheduledDosesInRange',
  'getDoseLogsForDate',
  'getDoseLogsInRange',
  'getDoseLogsForPeptide',
  'getVials',
  'getHealthMarkers',
];

// Screens allowed to read without filtering, with the reason. Keep this short:
// every entry is a place where a future edit can leak one profile's data into
// the other's view.
const EXEMPT: Record<string, string> = {};

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return path.endsWith('.tsx') && !path.endsWith('.test.tsx') ? [path] : [];
  });

const readsOwnerData = (source: string) =>
  OWNER_BEARING_READS.filter((fn) => new RegExp(`\\b${fn}\\b`).test(source));

const filtersByOwner = (source: string) =>
  source.includes('filterByOwner') || source.includes('useOwnerFilter');

describe('owner filtering', () => {
  it('is applied by every screen that reads profile-scoped rows', () => {
    const unfiltered = sourceFiles('src')
      .filter((path) => !(path in EXEMPT))
      .map((path) => ({ path, reads: readsOwnerData(readFileSync(path, 'utf8')) }))
      .filter(({ path, reads }) => reads.length > 0 && !filtersByOwner(readFileSync(path, 'utf8')))
      .map(({ path, reads }) => `${path} reads ${reads.join(', ')} without an owner filter`);

    expect(unfiltered).toEqual([]);
  });

  it('covers at least the screens known to read profile-scoped rows', () => {
    // Guards the guard: a rename in db/operations must not quietly turn this
    // into a test that checks nothing.
    const covered = sourceFiles('src').filter(
      (path) => readsOwnerData(readFileSync(path, 'utf8')).length > 0,
    );
    expect(covered.length).toBeGreaterThanOrEqual(10);
  });
});
