import { useEffect, useRef, useState, type ReactNode, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { CloudCheck, CloudOff, Loader2 } from 'lucide-react';
import { supabase, cloudEnabled } from '../db/supabase';
import { syncNow } from '../db/sync';

/** Gates the app behind a shared Supabase login when cloud sync is configured.
 *  With no Supabase env vars the app runs fully local, exactly as before. */
export function AuthGate({ children }: { children: ReactNode }) {
  if (!cloudEnabled) return <>{children}</>;
  return <CloudGate>{children}</CloudGate>;
}

function CloudGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false); // resolved initial getSession
  const [firstSyncDone, setFirstSyncDone] = useState(false);
  const [syncIssue, setSyncIssue] = useState<string | null>(null);

  useEffect(() => {
    supabase!.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase!.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Merge local <-> cloud on login, then keep in sync on focus / interval / unload.
  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    // Auto-syncs report failures too — quietly (indicator, not modal), same info
    // as the manual "Sync now" button. Clears itself on the next clean sync.
    const runSync = () =>
      syncNow()
        .then((res) => { if (!cancelled && res) setSyncIssue(res.errors.length ? res.errors.join('; ') : null); })
        .catch((e) => { if (!cancelled) setSyncIssue(e instanceof Error ? e.message : 'Sync failed'); });
    runSync().finally(() => { if (!cancelled) setFirstSyncDone(true); });

    const tick = () => { void runSync(); };
    // beforeunload is unreliable (esp. mobile); visibilitychange→hidden is the
    // last dependable moment to flush, so sync on both.
    const onHidden = () => { if (document.visibilityState === 'hidden') tick(); };
    const interval = setInterval(tick, 30_000);
    window.addEventListener('focus', tick);
    window.addEventListener('beforeunload', tick);
    document.addEventListener('visibilitychange', onHidden);
    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener('focus', tick);
      window.removeEventListener('beforeunload', tick);
      document.removeEventListener('visibilitychange', onHidden);
    };
  }, [session]);

  if (!ready) return <Splash label="Loading…" />;
  if (!session) return <LoginForm />;
  if (!firstSyncDone) return <Splash label="Syncing your data…" />;
  return (
    <>
      {syncIssue && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-0 inset-x-0 z-50 safe-top flex items-center justify-center gap-1.5 px-4 py-1.5 bg-danger/15 text-danger text-xs"
        >
          <CloudOff className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Sync issue: {syncIssue}</span>
        </div>
      )}
      {children}
    </>
  );
}

function Splash({ label }: { label: string }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-3 text-text-muted">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

/** pepdose runs on a single shared Supabase account provisioned out-of-band, so
 *  there is no self-signup — this form only signs in. Enforce it at the
 *  Supabase project level too (disable signups / add RLS), since a client-only
 *  gate can be bypassed by calling the API directly. */
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => emailRef.current?.focus(), []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <CloudCheck className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">pepdose</h1>
        </div>
        <p className="text-sm text-text-muted text-center mb-6">
          Sign in to sync your protocols and doses across devices.
        </p>

        {error && <div className="card-glass p-3 mb-3 border border-danger/40 text-sm text-danger">{error}</div>}

        <form onSubmit={submit} className="space-y-3">
          <input
            ref={emailRef}
            type="email"
            required
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm"
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-60"
          >
            {busy ? '…' : 'Sign in'}
          </button>
        </form>

        <p className="text-xs text-text-muted text-center mt-4">
          pepdose uses a single shared account. Ask the owner for the credentials.
        </p>
      </div>
    </div>
  );
}
