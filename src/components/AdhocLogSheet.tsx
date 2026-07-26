import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { X, Trash2, MapPin, Clock } from 'lucide-react';
import { deleteDoseLog } from '../db/operations';
import type { DoseLog } from '../db/schema';
import { getPeptideById } from '../data/peptides';
import { UserBadge } from './UserBadge';

interface AdhocLogSheetProps {
  log: DoseLog;
  onClose: () => void;
  onDeleted: () => void;
}

/** Detail sheet for an ad-hoc dose log. Deleting restores the vial draw-down
 *  and writes a deletion-ledger entry so the delete syncs to other devices. */
export function AdhocLogSheet({ log, onClose, onDeleted }: AdhocLogSheetProps) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pep = getPeptideById(log.peptideId);

  async function handleDelete() {
    setBusy(true);
    setError(null);
    try {
      await deleteDoseLog(log.id);
      onDeleted();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete — please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[60]" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[70] animate-slide-up">
        <div className="bg-bg-raised rounded-t-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm">{pep?.name ?? log.peptideId}</p>
              <UserBadge owner={log.owner} />
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-secondary/15 text-secondary">ad-hoc</span>
            </div>
            <button onClick={onClose} className="tap-target p-2 rounded-xl hover:bg-card" aria-label="Close">
              <X className="w-5 h-5 text-text-muted" />
            </button>
          </div>

          <div className="card-glass p-3 text-sm space-y-1.5">
            <p className="font-mono">{log.dose} {log.unit} · {format(parseISO(log.date), 'EEE MMM d, yyyy')}</p>
            <p className="text-xs text-text-muted font-mono flex items-center gap-1">
              <Clock className="w-3 h-3" />{log.time}
              {log.injectionSite && <span className="inline-flex items-center gap-0.5 ml-2"><MapPin className="w-3 h-3" />{log.injectionSite}</span>}
            </p>
            {log.notes && <p className="text-xs text-text-secondary">{log.notes}</p>}
          </div>

          {error && (
            <div role="alert" className="card-glass p-3 border border-danger/40 text-sm text-danger">
              {error}
            </div>
          )}

          {!confirming ? (
            <button
              onClick={() => setConfirming(true)}
              className="w-full px-4 py-3 rounded-xl border border-danger/40 text-sm font-medium text-danger flex items-center justify-center gap-2 tap-target"
            >
              <Trash2 className="w-4 h-4" /> Delete this dose
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 px-4 py-3 rounded-xl border border-border text-sm font-medium text-text-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={busy}
                className="flex-1 px-4 py-3 rounded-xl bg-danger text-white text-sm font-semibold disabled:opacity-40"
              >
                {busy ? 'Deleting…' : 'Yes, delete'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
