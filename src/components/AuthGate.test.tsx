// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, act, cleanup } from '@testing-library/react';
import { AuthGate } from './AuthGate';

// Mutable doubles for the supabase client and syncNow, so each test can steer
// login state and sync outcomes without a network.
const state = vi.hoisted(() => ({
  cloudEnabled: true,
  session: null as { user: { id: string } } | null,
  syncResult: { pushed: 0, pulled: 0, errors: [] as string[] },
  syncCalls: 0,
}));

vi.mock('../db/supabase', () => ({
  get cloudEnabled() { return state.cloudEnabled; },
  supabase: {
    auth: {
      getSession: async () => ({ data: { session: state.session } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  },
}));

vi.mock('../db/sync', () => ({
  syncNow: async () => {
    state.syncCalls += 1;
    return { ...state.syncResult, errors: [...state.syncResult.errors] };
  },
}));

const flush = () => act(async () => {}); // drain pending getSession/syncNow promises

beforeEach(() => {
  state.cloudEnabled = true;
  state.session = null;
  state.syncResult = { pushed: 0, pulled: 0, errors: [] };
  state.syncCalls = 0;
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('AuthGate', () => {
  it('renders children directly when cloud sync is not configured', () => {
    state.cloudEnabled = false;
    render(<AuthGate><p>app</p></AuthGate>);
    expect(screen.getByText('app')).toBeTruthy();
  });

  it('shows the login form when cloud is enabled and no one is signed in', async () => {
    render(<AuthGate><p>app</p></AuthGate>);
    await flush();
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.queryByText('app')).toBeNull();
  });

  it('syncs once on login and then renders the app', async () => {
    state.session = { user: { id: 'u1' } };
    render(<AuthGate><p>app</p></AuthGate>);
    await flush();
    expect(screen.getByText('app')).toBeTruthy();
    expect(state.syncCalls).toBe(1);
  });

  it('keeps syncing on the 30s interval', async () => {
    vi.useFakeTimers();
    state.session = { user: { id: 'u1' } };
    render(<AuthGate><p>app</p></AuthGate>);
    await flush();
    await act(async () => { vi.advanceTimersByTime(61_000); });
    expect(state.syncCalls).toBe(3); // login + two ticks
  });

  it('surfaces auto-sync errors as a status indicator, not a modal', async () => {
    state.session = { user: { id: 'u1' } };
    state.syncResult = { pushed: 0, pulled: 0, errors: ['protocols: boom'] };
    render(<AuthGate><p>app</p></AuthGate>);
    await flush();
    expect(screen.getByRole('status').textContent).toContain('protocols: boom');
    expect(screen.getByText('app')).toBeTruthy(); // app stays usable behind it
  });

  it('clears the indicator once a later sync succeeds', async () => {
    vi.useFakeTimers();
    state.session = { user: { id: 'u1' } };
    state.syncResult = { pushed: 0, pulled: 0, errors: ['protocols: boom'] };
    render(<AuthGate><p>app</p></AuthGate>);
    await flush();
    state.syncResult = { pushed: 0, pulled: 0, errors: [] };
    await act(async () => { vi.advanceTimersByTime(31_000); });
    expect(screen.queryByRole('status')).toBeNull();
  });
});
