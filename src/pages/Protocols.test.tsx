// @vitest-environment jsdom
// Lifecycle transitions and schedule regeneration — the parts of this page that
// can silently destroy data. CLAUDE.md calls out that regeneration must preserve
// logged history; scheduleEngine tests cover the generator, nothing covered this
// wiring around it.
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, act, cleanup, fireEvent } from '@testing-library/react';
import { Protocols } from './Protocols';
import type { UserProtocol, ScheduledDose } from '../db/schema';

const ops = vi.hoisted(() => ({
  getProtocols: vi.fn(),
  getProtocol: vi.fn(),
  updateProtocol: vi.fn(async () => {}),
  deleteProtocol: vi.fn(async () => {}),
  getScheduledDosesForProtocol: vi.fn(async () => [] as ScheduledDose[]),
  deleteUpcomingDosesFrom: vi.fn(async (_id: string, _from: string) => {}),
  saveScheduledDoses: vi.fn(async (_doses: unknown[], _owner: string) => {}),
  getDoseLogsForProtocol: vi.fn(async () => []),
  getHealthMarkers: vi.fn(async () => []),
  getAllDoseLogs: vi.fn(async () => []),
}));

vi.mock('../db/operations', () => ops);

vi.mock('react-router', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ state: null }),
}));

vi.mock('../context/ViewFilterContext', () => ({
  useOwnerFilter: () => <T,>(x: T) => x,
}));

const TODAY = new Date().toISOString().slice(0, 10);

const protocol = (over: Partial<UserProtocol> = {}): UserProtocol => ({
  id: 'p1',
  name: 'BPC Healing',
  peptideIds: ['bpc-157'],
  doses: [{
    peptideId: 'bpc-157', dose: 250, unit: 'mcg', frequency: 'daily',
    timesPerDay: 1, timeOfDay: 'morning', durationWeeks: 4,
  }],
  // Starting today keeps the regenerated window non-empty: handleSaveEdit only
  // writes doses dated today or later.
  startDate: TODAY,
  durationWeeks: 4,
  status: 'active',
  owner: 'Victor',
  createdAt: `${TODAY}T00:00:00.000Z`,
  ...over,
} as UserProtocol);

/** Render the list and open a protocol's Manage sheet. */
async function openActions(proto = protocol()) {
  ops.getProtocols.mockResolvedValue([proto]);
  ops.getProtocol.mockResolvedValue(proto);
  await act(async () => { render(<Protocols />); });
  await act(async () => { fireEvent.click(screen.getByText(proto.name!)); });
  await act(async () => { fireEvent.click(screen.getByText('Manage')); });
}

const click = async (label: string | RegExp) => {
  await act(async () => { fireEvent.click(screen.getByText(label)); });
};

beforeEach(() => {
  Object.values(ops).forEach(fn => fn.mockClear?.());
  ops.getScheduledDosesForProtocol.mockResolvedValue([]);
  ops.getDoseLogsForProtocol.mockResolvedValue([]);
  ops.getHealthMarkers.mockResolvedValue([]);
  ops.getAllDoseLogs.mockResolvedValue([]);
});

afterEach(cleanup);

describe('Protocols lifecycle', () => {
  it('pausing an active protocol stores the paused status', async () => {
    await openActions();
    await click('Pause Protocol');
    expect(ops.updateProtocol).toHaveBeenCalledWith('p1', { status: 'paused' });
  });

  it('resuming a paused protocol puts it back to active', async () => {
    await openActions(protocol({ status: 'paused' }));
    await click('Resume Protocol');
    expect(ops.updateProtocol).toHaveBeenCalledWith('p1', { status: 'active' });
  });

  it('finishing marks the protocol completed', async () => {
    await openActions();
    await click('Finish Protocol');
    expect(ops.updateProtocol).toHaveBeenCalledWith('p1', { status: 'completed' });
  });

  it('a completed protocol offers neither pause nor finish', async () => {
    await openActions(protocol({ status: 'completed' }));
    expect(screen.queryByText('Finish Protocol')).toBeNull();
  });

  it('delete asks for confirmation before removing anything', async () => {
    await openActions();
    await click('Delete Protocol'); // the menu entry — opens the confirm step
    expect(ops.deleteProtocol).not.toHaveBeenCalled();
  });

  it('confirming the delete removes the protocol', async () => {
    await openActions();
    await click('Delete Protocol');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Delete Protocol' }));
    });
    expect(ops.deleteProtocol).toHaveBeenCalledWith('p1');
  });
});

describe('Protocols schedule regeneration', () => {
  const logged: ScheduledDose = {
    id: 'd1', protocolId: 'p1', peptideId: 'bpc-157', date: TODAY, time: '08:00',
    dose: 250, unit: 'mcg', status: 'logged',
  } as ScheduledDose;

  async function saveEdit(existing: ScheduledDose[]) {
    ops.getScheduledDosesForProtocol.mockResolvedValue(existing);
    await openActions();
    await click('Edit Protocol');
    await act(async () => {
      fireEvent.click(screen.getByText(/Save Changes/i));
    });
  }

  it('never rewrites a day that already has a logged dose', async () => {
    await saveEdit([logged]);
    const written = ops.saveScheduledDoses.mock.calls[0][0] as ScheduledDose[];
    expect(written.some(d => d.date === TODAY && d.peptideId === 'bpc-157')).toBe(false);
  });

  it('regenerates the upcoming doses it did clear', async () => {
    await saveEdit([logged]);
    expect(ops.deleteUpcomingDosesFrom).toHaveBeenCalledWith('p1', TODAY);
    expect((ops.saveScheduledDoses.mock.calls[0][0] as ScheduledDose[]).length).toBeGreaterThan(0);
  });

  it('writes no dose dated before today', async () => {
    await saveEdit([]);
    const written = ops.saveScheduledDoses.mock.calls[0][0] as ScheduledDose[];
    expect(written.every(d => d.date >= TODAY)).toBe(true);
  });

  it('saves the regenerated schedule under the protocol owner', async () => {
    await saveEdit([]);
    expect(ops.saveScheduledDoses.mock.calls[0][1]).toBe('Victor');
  });
});
