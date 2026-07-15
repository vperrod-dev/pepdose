import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveVial,
  getVials,
  decrementVialDose,
  incrementVialDose,
  logDose,
  deleteDoseLog,
  getAllDoseLogs,
  saveProtocol,
  getProtocol,
  saveScheduledDoses,
  getScheduledDosesForProtocol,
  deleteProtocol,
  clearAllData,
} from './operations';
import { predictEmptyDate } from '../utils/vialForecast';
import type { Vial } from './schema';

const baseVial: Omit<Vial, 'id' | 'createdAt'> = {
  owner: 'Victor',
  peptideId: 'bpc-157',
  amountMg: 5,
  bacWaterMl: 2,
  dosesRemaining: 3,
  totalDoses: 20,
  status: 'active',
};

const baseLog = {
  owner: 'Victor' as const,
  protocolId: 'p1',
  peptideId: 'bpc-157',
  date: '2026-07-15',
  time: '08:00',
  dose: 250,
  unit: 'mcg' as const,
  route: 'subq',
};

beforeEach(async () => {
  await clearAllData();
});

describe('decrementVialDose', () => {
  it('draws one dose from the active vial', async () => {
    await saveVial(baseVial);
    await decrementVialDose('bpc-157', 'Victor');
    const [vial] = await getVials('bpc-157');
    expect(vial.dosesRemaining).toBe(2);
  });

  it('marks the vial empty when the last dose is drawn', async () => {
    await saveVial({ ...baseVial, dosesRemaining: 1 });
    await decrementVialDose('bpc-157', 'Victor');
    const [vial] = await getVials('bpc-157');
    expect(vial.status).toBe('empty');
  });

  it('does nothing when no active vial matches', async () => {
    await saveVial({ ...baseVial, status: 'empty', dosesRemaining: 0 });
    await decrementVialDose('bpc-157', 'Victor');
    const [vial] = await getVials('bpc-157');
    expect(vial.dosesRemaining).toBe(0);
  });

  it('keeps the run-out forecast in step with the draw-down', async () => {
    await saveVial(baseVial);
    await decrementVialDose('bpc-157', 'Victor');
    const [vial] = await getVials('bpc-157');
    // Daily cadence: 2 doses left -> empty in 2 days.
    const forecast = predictEmptyDate(vial.dosesRemaining, ['2026-07-13', '2026-07-14', '2026-07-15'], new Date('2026-07-15T12:00:00Z'));
    expect(forecast).toBe('2026-07-17');
  });
});

describe('incrementVialDose', () => {
  it('returns a dose to the active vial', async () => {
    await saveVial(baseVial);
    await incrementVialDose('bpc-157', 'Victor');
    const [vial] = await getVials('bpc-157');
    expect(vial.dosesRemaining).toBe(4);
  });

  it('reactivates an emptied vial', async () => {
    await saveVial({ ...baseVial, status: 'empty', dosesRemaining: 0 });
    await incrementVialDose('bpc-157', 'Victor');
    const [vial] = await getVials('bpc-157');
    expect(vial).toMatchObject({ status: 'active', dosesRemaining: 1 });
  });
});

describe('logDose / deleteDoseLog inventory round trip', () => {
  it('logging then deleting a dose leaves dosesRemaining unchanged', async () => {
    await saveVial(baseVial);
    const log = await logDose(baseLog);
    await deleteDoseLog(log.id);
    const [vial] = await getVials('bpc-157');
    expect(vial.dosesRemaining).toBe(baseVial.dosesRemaining);
  });

  it('logging a dose draws down the vial', async () => {
    await saveVial(baseVial);
    await logDose(baseLog);
    const [vial] = await getVials('bpc-157');
    expect(vial.dosesRemaining).toBe(2);
  });

  it('deleting the log actually removes it', async () => {
    await saveVial(baseVial);
    const log = await logDose(baseLog);
    await deleteDoseLog(log.id);
    expect(await getAllDoseLogs()).toEqual([]);
  });
});

describe('deleteProtocol', () => {
  it('removes the protocol and all of its scheduled doses together', async () => {
    const protocol = await saveProtocol({
      owner: 'Victor',
      name: 'Test',
      peptideIds: ['bpc-157'],
      doses: [],
      startDate: '2026-07-15',
      durationWeeks: 4,
      status: 'active',
    });
    await saveScheduledDoses([
      { id: 'd1', protocolId: protocol.id, peptideId: 'bpc-157', date: '2026-07-15', time: '08:00', dose: 250, unit: 'mcg', route: 'subq', status: 'upcoming', weekNumber: 1 },
      { id: 'd2', protocolId: protocol.id, peptideId: 'bpc-157', date: '2026-07-16', time: '08:00', dose: 250, unit: 'mcg', route: 'subq', status: 'upcoming', weekNumber: 1 },
    ], 'Victor');

    await deleteProtocol(protocol.id);

    expect(await getProtocol(protocol.id)).toBeUndefined();
    expect(await getScheduledDosesForProtocol(protocol.id)).toEqual([]);
  });
});
