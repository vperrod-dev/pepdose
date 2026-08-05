import { describe, it, expect } from 'vitest';
import { findDuplicateProtocols } from './duplicateProtocols';
import type { DoseLog, UserProtocol } from '../db/schema';

const proto = (id: string, startDate: string, status: UserProtocol['status'] = 'active'): UserProtocol => ({
  id, owner: 'Victor', name: 'MOTS-c', peptideIds: ['mots-c'],
  doses: [{ peptideId: 'mots-c', dose: 5, unit: 'mg', frequency: 'eod', timeOfDay: 'morning' }],
  startDate, durationWeeks: 6, status,
  createdAt: startDate, updatedAt: startDate,
});

const log = (protocolId: string, date: string): DoseLog => ({
  id: `${protocolId}-${date}`, owner: 'Victor', protocolId, peptideId: 'mots-c',
  date, time: '08:00', dose: 5, unit: 'mg', route: 'subq', createdAt: date,
});

describe('findDuplicateProtocols', () => {
  it('reports nothing when a peptide runs in a single protocol', () => {
    expect(findDuplicateProtocols([proto('a', '2026-08-01')], [])).toEqual([]);
  });

  it('groups every protocol scheduling the same peptide', () => {
    const groups = findDuplicateProtocols([proto('a', '2026-08-01'), proto('b', '2026-07-01')], []);
    expect(groups[0].protocols.map(p => p.id).sort()).toEqual(['a', 'b']);
  });

  it('keeps the protocol with the most recent logged dose', () => {
    const protocols = [proto('old', '2026-07-01'), proto('logged', '2026-06-01'), proto('never', '2026-07-15')];
    const groups = findDuplicateProtocols(protocols, [log('logged', '2026-08-05')]);
    expect(groups[0].keepId).toBe('logged');
  });

  it('falls back to the newest start date when nothing was ever logged', () => {
    const groups = findDuplicateProtocols([proto('old', '2026-06-01'), proto('new', '2026-08-01')], []);
    expect(groups[0].keepId).toBe('new');
  });

  it('ignores finished protocols, which no longer schedule anything', () => {
    const protocols = [proto('a', '2026-08-01'), proto('done', '2026-07-01', 'completed')];
    expect(findDuplicateProtocols(protocols, [])).toEqual([]);
  });

  it('exposes the last logged date per protocol for the UI', () => {
    const protocols = [proto('a', '2026-08-01'), proto('b', '2026-07-01')];
    const groups = findDuplicateProtocols(protocols, [log('b', '2026-08-04'), log('b', '2026-07-30')]);
    expect(groups[0].lastLoggedByProtocol.b).toBe('2026-08-04');
  });
});
