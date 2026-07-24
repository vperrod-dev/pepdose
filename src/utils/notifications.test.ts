import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { scheduleReminders } from './notifications';
import { saveScheduledDoses, clearAllData } from '../db/operations';

// Node has no DOM: stub just enough browser surface for the reminder path.
// Only setTimeout/Date are faked so fake-indexeddb's internal scheduling stays real.

const showNotification = vi.fn();

function stubBrowser(timezone: string) {
  const store = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  });
  localStorage.setItem('pepdose-settings', JSON.stringify({
    notificationsEnabled: true,
    reminderMinutesBefore: 15,
    timezone,
  }));
  const NotificationStub = Object.assign(vi.fn(), { permission: 'granted' });
  vi.stubGlobal('Notification', NotificationStub);
  vi.stubGlobal('window', { Notification: NotificationStub });
  vi.stubGlobal('navigator', {
    serviceWorker: { ready: Promise.resolve({ showNotification }) },
  });
}

async function seedDose(id: string, time: string) {
  await saveScheduledDoses([{
    id,
    protocolId: 'p1',
    peptideId: 'bpc-157',
    date: '2026-01-05',
    time,
    dose: 250,
    unit: 'mcg',
    route: 'subq',
    status: 'upcoming',
    weekNumber: 1,
  }], 'Victor');
}

const flush = () => new Promise((r) => setImmediate(r));

beforeEach(async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
  vi.setSystemTime(new Date('2026-01-05T12:50:00Z'));
  showNotification.mockClear();
  await clearAllData();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('scheduleReminders timezone awareness', () => {
  it('fires a catch-up reminder when the window opened in the chosen timezone', async () => {
    // 08:00 America/New_York = 13:00 UTC; remind-at 12:45 UTC already passed at 12:50.
    stubBrowser('America/New_York');
    await seedDose('d1', '08:00');
    await scheduleReminders();
    await flush();
    expect(showNotification.mock.calls[0]?.[1]?.tag).toBe('d1');
  });

  it('does not fire for the same wall-clock time when it is long past in UTC', async () => {
    // 08:00 UTC was almost 5h ago -> outside the 60-minute catch-up window.
    stubBrowser('UTC');
    await seedDose('d1', '08:00');
    await scheduleReminders();
    await flush();
    expect(showNotification).not.toHaveBeenCalled();
  });

  it('arms an in-page timer at the zone-correct reminder time for a future dose', async () => {
    // 09:00 America/New_York = 14:00 UTC; remind-at 13:45 UTC = 55 min from now.
    stubBrowser('America/New_York');
    await seedDose('d2', '09:00');
    await scheduleReminders();
    await flush();
    expect(showNotification).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(55 * 60_000);
    await flush();
    expect(showNotification.mock.calls[0]?.[1]?.tag).toBe('d2');
  });
});

describe('triggered (closed-app) reminders', () => {
  it('arms an OS trigger for a future dose without re-arming on re-run', async () => {
    // 09:00 America/New_York = 14:00 UTC; remind-at 13:45 UTC is 55 min from now.
    stubBrowser('America/New_York');
    const TimestampTrigger = vi.fn(function (this: { timestamp: number }, ts: number) {
      this.timestamp = ts;
    });
    vi.stubGlobal('TimestampTrigger', TimestampTrigger);
    await seedDose('d2', '09:00');

    await scheduleReminders();
    await flush();

    expect(showNotification).toHaveBeenCalledTimes(1);
    const options = showNotification.mock.calls[0]?.[1];
    expect(options?.tag).toBe('d2');
    expect(options?.showTrigger).toBeInstanceOf(TimestampTrigger);

    await scheduleReminders(); // e.g. tab refocus re-evaluates
    await flush();
    expect(showNotification).toHaveBeenCalledTimes(1);
  });
});

describe('per-day fired dedupe', () => {
  it('does not fire the same reminder twice in one day', async () => {
    stubBrowser('America/New_York');
    await seedDose('d1', '08:00');
    await scheduleReminders();
    await flush();
    await scheduleReminders(); // e.g. tab refocus re-evaluates
    await flush();
    expect(showNotification).toHaveBeenCalledTimes(1);
  });

  it('does not re-fire a triggered reminder after its window opens on reopen', async () => {
    // With the Triggers API armed, the OS shows the notification when closed; a
    // later reopen must not re-show it via the immediate-fire catch-up branch.
    stubBrowser('America/New_York');
    vi.stubGlobal('TimestampTrigger', vi.fn());
    await seedDose('d2', '09:00'); // 14:00 UTC; remind-at 13:45 UTC is future
    await scheduleReminders(); // arms the triggered notification
    await flush();
    expect(showNotification).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(60 * 60_000); // now 13:50 UTC: window is open
    await scheduleReminders(); // e.g. app reopened
    await flush();
    expect(showNotification).toHaveBeenCalledTimes(1);
  });
});
