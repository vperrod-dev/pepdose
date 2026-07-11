import { useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import { ArrowUpCircle, Crosshair } from 'lucide-react';
import { getPeptideById } from '../data/peptides';
import { UserBadge } from './UserBadge';
import { useViewFilter } from '../context/ViewFilterContext';
import { filterByOwner } from '../context/ownerFilter';
import type { UserProtocol, ScheduledDose, DoseLog } from '../db/schema';
import {
  buildTimeline, type TimelineModel, type ProtocolTimeline, type WeekSegment,
} from '../utils/protocolTimeline';
import { DoseActionSheet } from './DoseActionSheet';

const CATEGORY_COLORS: Record<string, string> = {
  healing: '#22c55e',
  glp1: '#6366f1',
  gh_secretagogue: '#f59e0b',
  fat_loss: '#ef4444',
  cosmetic: '#ec4899',
  sexual_health: '#a855f7',
  nootropic: '#06b6d4',
};

const LABEL_W = 96;       // px reserved for protocol name on the left
const WEEK_W = 34;        // px per week column
const LANE_H = 58;
const HEADER_H = 26;

function protocolColor(p: UserProtocol): string {
  const mainPep = p.peptideIds[0] ? getPeptideById(p.peptideIds[0]) : undefined;
  return CATEGORY_COLORS[mainPep?.category ?? 'healing'] ?? '#00d4aa';
}

function hexWithAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255).toString(16).padStart(2, '0');
  return `${hex}${a}`;
}

/** Tiny inline sparkline of per-week representative dose across the protocol span. */
function DoseRamp({ pt, color }: { pt: ProtocolTimeline; color: string }) {
  const data = pt.weeks.map(w => (w.dose ?? 0));
  const max = Math.max(1, ...data);
  const w = 80;
  const h = 16;
  const step = pt.weeks.length > 1 ? w / (pt.weeks.length - 1) : w;
  const points = data.map((d, i) => {
    const x = i * step;
    const y = h - (d / max) * (h - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={w} height={h} className="mt-0.5 block" aria-hidden>
      {data.some(d => d > 0) && (
        <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function ProtocolTimeline({
  protocols,
  dosesByProtocol,
  logsByDoseId,
}: {
  protocols: UserProtocol[];
  dosesByProtocol: Map<string, ScheduledDose[]>;
  logsByDoseId: Map<string, DoseLog>;
}) {
  const { filter } = useViewFilter();
  const visibleProtocols = useMemo(() => filterByOwner(protocols, filter), [protocols, filter]);
  const visibleDoses = useMemo(
    () => new Map([...dosesByProtocol].map(([k, v]) => [k, filterByOwner(v, filter)])),
    [dosesByProtocol, filter],
  );

  const model: TimelineModel = useMemo(
    () => buildTimeline(visibleProtocols, visibleDoses),
    [visibleProtocols, visibleDoses],
  );

  const [activeDose, setActiveDose] = useState<(ScheduledDose & { peptideName: string; color: string }) | null>(null);
  const [openWeek, setOpenWeek] = useState<{ pt: ProtocolTimeline; week: number } | null>(null);
  const todayLineRef = useRef<HTMLDivElement>(null);

  const scrollToToday = () => {
    // Use the actual today-line element so any label/padding offset is handled
    // correctly (scrollIntoView measures real layout, not computed pixels).
    if (todayLineRef.current) {
      todayLineRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  if (model.protocols.length === 0) {
    return (
      <div className="card-glass p-6 text-center mt-4">
        <p className="text-text-muted text-sm">No active protocols to chart.</p>
      </div>
    );
  }

  const trackWidth = model.totalWeeks * WEEK_W;
  const todayX = model.todayIndex >= 0 ? LABEL_W + (model.todayIndex / model.totalWeeks) * trackWidth : null;

  function fillFor(seg: WeekSegment, peak: number): number {
    if (seg.count === 0) return 0;
    return 0.35 + 0.65 * (seg.count / Math.max(1, peak));
  }

  return (
    <div className="mt-4 stagger-item">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
          Protocol Timeline
        </h2>
        <div className="flex items-center gap-2">
          {model.todayIndex >= 0 && (
            <button
              onClick={scrollToToday}
              className="flex items-center gap-1 text-[10px] font-medium text-primary bg-primary-dim px-2 py-1 rounded tap-target"
            >
              <Crosshair className="w-3 h-3" /> Today
            </button>
          )}
          <span className="text-[10px] font-mono text-text-muted">
            {format(model.start, 'MMM d')} → {format(model.end, 'MMM d')}
          </span>
        </div>
      </div>

      <div className="card-glass p-3 overflow-x-auto">
        <div className="relative" style={{ width: LABEL_W + trackWidth }}>
          {/* Week ruler */}
          <div className="relative" style={{ height: HEADER_H, marginLeft: LABEL_W, width: trackWidth }}>
            {Array.from({ length: model.totalWeeks }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 text-[9px] font-mono text-text-muted"
                style={{ left: `${(i / model.totalWeeks) * 100}%` }}
              >
                {i === 0 || i % 4 === 0 ? `W${i + 1}` : ''}
              </div>
            ))}
          </div>

          {/* Today line (spans all lanes) */}
          {todayX !== null && (
            <div
              ref={todayLineRef}
              className="absolute bg-primary/70"
              style={{ left: todayX, top: 0, bottom: 0, width: 2, zIndex: 5 }}
            />
          )}

          {/* Lanes */}
          {model.protocols.map((pt) => {
            const color = protocolColor(pt.protocol);
            return (
              <div key={pt.protocol.id} className="flex items-stretch" style={{ height: LANE_H }}>
                <button
                  onClick={() => setOpenWeek({ pt, week: 1 })}
                  className="shrink-0 flex flex-col justify-center text-left pr-2 tap-target"
                  style={{ width: LABEL_W }}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-[11px] font-medium truncate">{pt.protocol.name}</span>
                  </div>
                  <UserBadge owner={pt.protocol.owner} />
                  <DoseRamp pt={pt} color={color} />
                </button>

                <div className="relative flex" style={{ width: trackWidth }}>
                  {pt.weeks.map((seg) => {
                    const isOff = seg.count === 0;
                    const adherence = seg.count > 0 ? seg.logged / seg.count : 0;
                    return (
                      <button
                        key={seg.week}
                        onClick={() => setOpenWeek({ pt, week: seg.week })}
                        title={
                          isOff
                            ? `Week ${seg.week}: off`
                            : `Week ${seg.week}: ${seg.count} dose${seg.count > 1 ? 's' : ''}${seg.dose != null ? ` · ${seg.dose}${seg.unit}` : ''}${seg.isStepUp ? ' · step-up' : ''}`
                        }
                        className="relative h-7 my-auto border-r border-border/40 last:border-r-0 transition-colors tap-target"
                        style={{
                          width: WEEK_W,
                          backgroundColor: isOff
                            ? 'transparent'
                            : hexWithAlpha(color, fillFor(seg, pt.peakPerWeek)),
                          backgroundImage: isOff
                            ? 'repeating-linear-gradient(45deg, #162033 0 4px, transparent 4px 8px)'
                            : undefined,
                        }}
                      >
                        {!isOff && seg.isStepUp && (
                          <ArrowUpCircle className="absolute -top-1 -right-1 w-3 h-3 text-text" />
                        )}
                        {!isOff && adherence > 0 && (
                          <span
                            className="absolute bottom-0 left-0 h-1 rounded-b"
                            style={{ width: `${adherence * 100}%`, backgroundColor: '#22c55e' }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-[10px] text-text-muted mt-2 px-1">
        Filled weeks = doses scheduled (darker = more per week). Diagonal = off week.
        Green underline = portion logged. Up-arrow = titration step-up. Vertical line = today.
      </p>

      {openWeek && (
        <WeekDetailSheet
          pt={openWeek.pt}
          week={openWeek.week}
          color={protocolColor(openWeek.pt.protocol)}
          onClose={() => setOpenWeek(null)}
        />
      )}

      {activeDose && (
        <DoseActionSheet
          dose={activeDose}
          log={logsByDoseId.get(activeDose.id)}
          onClose={() => setActiveDose(null)}
          onUpdated={() => { /* reload handled by parent */ }}
        />
      )}
    </div>
  );
}

function WeekDetailSheet({
  pt, week, color, onClose,
}: {
  pt: ProtocolTimeline;
  week: number;
  color: string;
  onClose: () => void;
}) {
  const seg = pt.weeks[week - 1];
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[60]" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-[70] animate-slide-up">
        <div className="bg-bg-raised rounded-t-2xl max-h-[70vh] overflow-y-auto p-4" style={{ maxWidth: 430, margin: '0 auto' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-sm">{pt.protocol.name} — Week {week}</p>
            <button onClick={onClose} className="tap-target p-2 rounded-xl hover:bg-card" aria-label="Close">
              <span className="text-text-muted">✕</span>
            </button>
          </div>
          {!seg || seg.count === 0 ? (
            <p className="text-sm text-text-muted text-center py-6">Off week — no doses scheduled.</p>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                {seg.count} dose{seg.count > 1 ? 's' : ''}
                {seg.dose != null && ` · ${seg.dose}${seg.unit}`}
                {seg.isStepUp && <span className="text-secondary font-medium"> · titration step-up</span>}
              </div>
              <div className="text-xs text-text-muted">
                Logged {seg.logged}/{seg.count}
                {seg.missed > 0 && ` · ${seg.missed} missed`}
                {seg.skipped > 0 && ` · ${seg.skipped} skipped`}
                {seg.upcoming > 0 && ` · ${seg.upcoming} pending`}
              </div>
              {seg.peptides.map((pid) => {
                const pep = getPeptideById(pid);
                return (
                  <div key={pid} className="card-glass px-3 py-2 text-sm">{pep?.name ?? pid}</div>
                );
              })}
              <p className="text-[10px] text-text-muted pt-1">
                Tap a day in the month tab to log or edit an individual dose.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
