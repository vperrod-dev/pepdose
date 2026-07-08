import { useEffect, useRef, useState, type ReactNode, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { CloudCheck, Loader2 } from 'lucide-react';
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
    syncNow().finally(() => { if (!cancelled) setFirstSyncDone(true); });

    const tick = () => { void syncNow(); };
    const interval = setInterval(tick, 30_000);
    window.addEventListener('focus', tick);
    window.addEventListener('beforeunload', tick);
    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener('focus', tick);
      window.removeEventListener('beforeunload', tick);
    };
  }, [session]);

  if (!ready) return <Splash label="Loading…" />;
  if (!session) return <LoginForm />;
  if (!firstSyncDone) return <Splash label="Syncing your data…" />;
  return <>{children}</>;
}

function Splash({ label }: { label: string }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-3 text-text-muted">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

function LoginForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => emailRef.current?.focus(), []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    const fn = mode === 'signin'
      ? supabase!.auth.signInWithPassword({ email, password })
      : supabase!.auth.signUp({ email, password });
    const { data, error } = await fn;
    setBusy(false);
    if (error) { setError(error.message); return; }
    if (mode === 'signup' && !data.session) {
      setNotice('Account created. Check your email to confirm, then sign in.');
      setMode('signin');
    }
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
        {notice && <div className="card-glass p-3 mb-3 border border-success/40 text-sm text-success">{notice}</div>}

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
            minLength={6}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
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
            {busy ? '…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(null); setNotice(null); }}
          className="w-full mt-4 text-xs text-text-muted"
        >
          {mode === 'signin' ? 'No account yet? Create one' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}
