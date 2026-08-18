// @vitest-environment jsdom
import { it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, act, cleanup, fireEvent } from '@testing-library/react';
import { format, addMonths } from 'date-fns';
import { ViewFilterProvider } from '../context/ViewFilterContext';
import { Calendar } from './Calendar';
import type { UserProtocol, ScheduledDose } from '../db/schema';

const ops = vi.hoisted(() => ({
  getScheduledDosesInRange: vi.fn(async () => [] as ScheduledDose[]),
  getDoseLogsInRange: vi.fn(async () => []),
  getProtocols: vi.fn(async () => [] as UserProtocol[]),
  getScheduledDosesForProtocol: vi.fn(async () => [] as ScheduledDose[]),
}));

vi.mock('../db/operations', () => ops);

const today = format(new Date(), 'yyyy-MM-dd');

const activeProtocol: UserProtocol = {
  id: 'p1', name: 'Healing', peptideIds: ['bpc-157'], doses: [], startDate: today,
  durationWeeks: 4, status: 'active', owner: 'Victor', createdAt: `${today}T00:00:00.000Z`,
} as UserProtocol;

const dose = (over: Partial<ScheduledDose>): ScheduledDose => ({
  id: 'd1', protocolId: 'p1', peptideId: 'bpc-157', date: today, time: '09:00',
  dose: 250, unit: 'mcg', status: 'upcoming', weekNumber: 1, owner: 'Victor',
  createdAt: `${today}T00:00:00.000Z`,
  ...over,
} as ScheduledDose);

async function renderCalendar() {
  localStorage.setItem('pepdose-view-filter', 'Victor');
  await act(async () => {
    render(<ViewFilterProvider><Calendar /></ViewFilterProvider>);
  });
}

beforeEach(() => { Object.values(ops).forEach(fn => fn.mockClear()); });
afterEach(cleanup);

it('opens on the current month', async () => {
  await renderCalendar();
  expect(screen.getByText(format(new Date(), 'MMMM yyyy'))).toBeTruthy();
});

it('advances to next month when the forward arrow is clicked', async () => {
  await renderCalendar();
  await act(async () => { fireEvent.click(screen.getByLabelText('Next month')); });
  expect(screen.getByText(format(addMonths(new Date(), 1), 'MMMM yyyy'))).toBeTruthy();
});

it("lists today's scheduled dose under the selected day", async () => {
  ops.getScheduledDosesInRange.mockResolvedValue([dose({})]);
  ops.getProtocols.mockResolvedValue([activeProtocol]);
  await renderCalendar();
  expect(screen.getByText('BPC-157')).toBeTruthy();
  expect(screen.getByText(/250 mcg/)).toBeTruthy();
});
