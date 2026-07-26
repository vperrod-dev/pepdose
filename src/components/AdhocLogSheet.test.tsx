// @vitest-environment jsdom
import { it, expect, afterEach, vi } from 'vitest';
import { render, screen, act, cleanup, fireEvent } from '@testing-library/react';
import { AdhocLogSheet } from './AdhocLogSheet';
import type { DoseLog } from '../db/schema';

const ops = vi.hoisted(() => ({
  deleteDoseLog: vi.fn(async () => {}),
}));
vi.mock('../db/operations', () => ({ deleteDoseLog: ops.deleteDoseLog }));

const log: DoseLog = {
  id: 'log-1', owner: 'Victor', protocolId: '', peptideId: 'bpc-157',
  date: '2026-07-25', time: '21:30', dose: 250, unit: 'mcg',
  route: 'subq', createdAt: '2026-07-25T21:30:00.000Z',
};

afterEach(cleanup);

it('delete is behind a confirmation and calls deleteDoseLog with the log id', async () => {
  const onDeleted = vi.fn();
  render(<AdhocLogSheet log={log} onClose={() => {}} onDeleted={onDeleted} />);
  fireEvent.click(screen.getByText('Delete this dose'));
  expect(ops.deleteDoseLog).not.toHaveBeenCalled();
  await act(async () => { fireEvent.click(screen.getByText('Yes, delete')); });
  expect(ops.deleteDoseLog).toHaveBeenCalledWith('log-1');
  expect(onDeleted).toHaveBeenCalled();
});

it('a failed delete shows the error and keeps the sheet usable', async () => {
  ops.deleteDoseLog.mockImplementation(() => { throw new Error('tx blocked'); });
  render(<AdhocLogSheet log={log} onClose={() => {}} onDeleted={() => {}} />);
  fireEvent.click(screen.getByText('Delete this dose'));
  await act(async () => { fireEvent.click(screen.getByText('Yes, delete')); });
  expect(screen.getByRole('alert').textContent).toContain('tx blocked');
});
