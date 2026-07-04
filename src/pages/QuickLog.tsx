import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Syringe, Check, MapPin, Clock, Plus, X } from 'lucide-react';
import { getScheduledDosesForDate, getDoseLogsForDate, logDose } from '../db/operations';
import { getPeptideById, PEPTIDES } from '../data/peptides';
import type { ScheduledDose } from '../db/schema';
import { UserBadge } from '../components/UserBadge';
import { UserPicker } from '../components/UserPicker';
import { DecimalInput } from '../components/DecimalInput';
import { getLastOwner, setLastOwner, type UserName } from '../data/users';
import { useOwnerFilter } from '../context/ViewFilterContext';

interface QuickDose extends ScheduledDose {
  peptideName: string;
  categoryColor: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  healing: '#22c55e',
  glp1: '#6366f1',
  gh_secretagogue: '#f59e0b',
  fat_loss: '#ef4444',
  cosmetic: '#ec4899',
  sexual_health: '#a855f7',
  nootropic: '#06b6d4',
};

export function QuickLog() {
  const [doses, setDoses] = useState<QuickDose[]>([]);
  const [logged, setLogged] = useState<Set<string>>(new Set());
  const [justLogged, setJustLogged] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showAdhoc, setShowAdhoc] = useState(false);
  const [adhocMsg, setAdhocMsg] = useState('');

  const today = format(new Date(), 'yyyy-MM-dd');
  const applyOwnerFilter = useOwnerFilter();

  useEffect(() => {
    async function load() {
      const [scheduled, logs] = await Promise.all([
        getScheduledDosesForDate(today),
        getDoseLogsForDate(today),
      ]);

      const enriched: QuickDose[] = scheduled.map(d => {
        const pep = getPeptideById(d.peptideId);
        return {
          ...d,
          peptideName: pep?.name ?? d.peptideId,
          categoryColor: CATEGORY_COLORS[pep?.category ?? 'healing'] ?? '#00d4aa',
        };
      }).sort((a, b) => a.time.localeCompare(b.time));

      setDoses(enriched);
      setLogged(new Set(logs.map(l => l.scheduledDoseId).filter(Boolean) as string[]));
      setLoading(false);
    }
    load();
  }, [today]);

  async function handleLog(dose: QuickDose) {
    if (logged.has(dose.id) || justLogged.has(dose.id)) return;

    const now = format(new Date(), 'HH:mm');
    await logDose({
      owner: dose.owner,
      scheduledDoseId: dose.id,
      protocolId: dose.protocolId,
      peptideId: dose.peptideId,
      date: today,
      time: now,
      dose: dose.dose,
      unit: dose.unit,
      route: dose.route,
      injectionSite: dose.suggestedSite,
    });

    setJustLogged(prev => new Set(prev).add(dose.id));
    setLogged(prev => new Set(prev).add(dose.id));
  }

  const visible = applyOwnerFilter(doses);
  const pending = visible.filter(d => !logged.has(d.id));
  const done = visible.filter(d => logged.has(d.id));

  if (loading) {
    return (
      <div className="safe-top px-5 pt-4 pb-28">
        <div className="skeleton h-8 w-48 mb-6" />
        <div className="skeleton h-24 w-full mb-3" />
        <div className="skeleton h-24 w-full mb-3" />
        <div className="skeleton h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="safe-top px-5 pt-4 pb-28">
      <header className="mb-6 stagger-item">
        <h1 className="text-2xl font-bold tracking-tight">Log Dose</h1>
        <p className="text-text-secondary text-sm mt-1">
          {pending.length ? `${pending.length} remaining today` : 'All done for today'}
        </p>
      </header>

      {pending.length > 0 && (
        <section className="mb-6">
          <div className="space-y-3">
            {pending.map((dose, i) => (
              <button
                key={dose.id}
                onClick={() => handleLog(dose)}
                className="card-glass w-full text-left p-4 tap-target stagger-item relative overflow-hidden"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {justLogged.has(dose.id) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-success/20 z-10">
                    <div className="check-burst">
                      <Check className="w-10 h-10 text-success" strokeWidth={3} />
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: dose.categoryColor + '22' }}
                  >
                    <Syringe className="w-5 h-5" style={{ color: dose.categoryColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{dose.peptideName}</p>
                      <UserBadge owner={dose.owner} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-muted mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {dose.time}
                      </span>
                      <span className="font-mono">{dose.dose} {dose.unit}</span>
                      {dose.suggestedSite && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {dose.suggestedSite}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-text-muted uppercase tracking-wider font-medium">
                    Tap
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {done.length > 0 && (
        <section className="mb-6">
          <p className="text-xs text-text-muted uppercase tracking-wider font-medium mb-3">
            Completed ({done.length})
          </p>
          <div className="space-y-2">
            {done.map(dose => (
              <div key={dose.id} className="card-glass p-3 opacity-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-success" />
                  </div>
                  <p className="text-sm text-text-secondary line-through flex-1">{dose.peptideName}</p>
                  <span className="text-xs text-text-muted font-mono">{dose.dose} {dose.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {adhocMsg && (
        <div className="card-glass p-3 mb-3 flex items-center gap-2 border border-success/40">
          <Check className="w-4 h-4 text-success" />
          <p className="text-sm">{adhocMsg}</p>
        </div>
      )}

      <button
        className="card-glass w-full p-4 tap-target flex items-center justify-center gap-2 text-primary font-medium stagger-item"
        style={{ animationDelay: `${Math.min(pending.length, 5) * 0.05 + 0.1}s` }}
        onClick={() => setShowAdhoc(true)}
      >
        <Plus className="w-5 h-5" />
        Ad-hoc dose
      </button>

      {showAdhoc && (
        <AdhocDoseSheet
          onClose={() => setShowAdhoc(false)}
          onLogged={(name) => {
            setShowAdhoc(false);
            setAdhocMsg(`Logged ${name}`);
            setTimeout(() => setAdhocMsg(''), 3000);
          }}
        />
      )}
    </div>
  );
}

function AdhocDoseSheet({ onClose, onLogged }: { onClose: () => void; onLogged: (name: string) => void }) {
  const injectable = PEPTIDES.filter(p => p.route !== 'oral' && p.route !== 'intranasal');
  const [owner, setOwner] = useState<UserName>(getLastOwner());
  const [peptideId, setPeptideId] = useState('');
  const [dose, setDose] = useState(0);
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [saving, setSaving] = useState(false);

  const pep = getPeptideById(peptideId);
  const unit = (pep?.dosing.unit ?? 'mg') as 'mcg' | 'mg';
  const valid = !!peptideId && dose > 0;

  async function handleSave() {
    if (!valid) return;
    setSaving(true);
    await logDose({
      owner,
      protocolId: '',
      peptideId,
      date: format(new Date(), 'yyyy-MM-dd'),
      time,
      dose,
      unit,
      route: pep?.route ?? 'subcutaneous',
    });
    setLastOwner(owner);
    onLogged(pep?.name ?? 'dose');
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[60]" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[70] animate-slide-up">
        <div className="bg-bg-raised rounded-t-2xl max-h-[85vh] overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-sm">Log an ad-hoc dose</p>
            <button onClick={onClose} className="tap-target p-2 rounded-xl hover:bg-card" aria-label="Close">
              <X className="w-5 h-5 text-text-muted" />
            </button>
          </div>

          <UserPicker value={owner} onChange={setOwner} />

          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">Peptide</label>
            <select
              value={peptideId}
              onChange={e => setPeptideId(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select peptide…</option>
              {injectable.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">Dose ({unit})</label>
              <DecimalInput
                value={dose}
                onChange={setDose}
                min={0}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-mono outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">Time</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm font-mono outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2 pb-2">
            <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border border-border text-sm font-medium text-text-secondary">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !valid}
              className="flex-1 px-4 py-3 rounded-xl bg-primary text-bg text-sm font-semibold disabled:opacity-40"
            >
              {saving ? 'Saving…' : 'Log Dose'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
