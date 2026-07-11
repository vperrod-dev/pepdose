import { useState, useEffect, useMemo } from 'react';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek,
  isSameMonth, isSameDay, isToday, addMonths, subMonths,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getScheduledDosesInRange, getAllDoseLogs, getProtocols } from '../db/operations';
import { getPeptideById } from '../data/peptides';
import { DoseActionSheet } from '../components/DoseActionSheet';
import { UserBadge } from '../components/UserBadge';
import { useViewFilter } from '../context/ViewFilterContext';
import { filterByOwner } from '../context/ownerFilter';
import type { ScheduledDose, DoseLog, UserProtocol } from '../db/schema';

const CATEGORY_COLORS: Record<string, string> = {
  healing: '#22c55e',
  glp1: '#6366f1',
  gh_secretagogue: '#f59e0b',
  fat_loss: '#ef4444',
  cosmetic: '#ec4899',
  sexual_health: '#a855f7',
  nootropic: '#06b6d4',
};

const CATEGORY_LABELS: { key: keyof typeof CATEGORY_COLORS; label: string }[] = [
  { key: 'healing', label: 'Healing' },
  { key: 'glp1', label: 'GLP-1' },
  { key: 'gh_secretagogue', label: 'GH Secretagogue' },
  { key: 'fat_loss', label: 'Fat Loss' },
  { key: 'cosmetic', label: 'Cosmetic' },
  { key: 'sexual_health', label: 'Sexual Health' },
  { key: 'nootropic', label: 'Nootropic' },
];

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthDoses, setMonthDoses] = useState<ScheduledDose[]>([]);
  const [logsByDoseId, setLogsByDoseId] = useState<Map<string, DoseLog>>(new Map());
  const [protocolsById, setProtocolsById] = useState<Map<string, UserProtocol>>(new Map());
  const [activeDose, setActiveDose] = useState<(ScheduledDose & { peptideName: string; color: string }) | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calStart, end: calEnd });

  useEffect(() => {
    async function load() {
      const rangeStart = format(calStart, 'yyyy-MM-dd');
      const rangeEnd = format(calEnd, 'yyyy-MM-dd');
      const [doses, logs, protos] = await Promise.all([
        getScheduledDosesInRange(rangeStart, rangeEnd),
        getAllDoseLogs(),
        getProtocols(),
      ]);
      setMonthDoses(doses);
      setLogsByDoseId(new Map(
        logs.filter(l => l.scheduledDoseId).map(l => [l.scheduledDoseId!, l]),
      ));
      setProtocolsById(new Map(protos.map(p => [p.id, p])));
    }
    load();
  }, [currentMonth, reloadKey]);

  const { filter } = useViewFilter();

  const dosesByDate = useMemo(() => {
    const map = new Map<string, ScheduledDose[]>();
    for (const dose of filterByOwner(monthDoses, filter)) {
      const existing = map.get(dose.date) || [];
      existing.push(dose);
      map.set(dose.date, existing);
    }
    return map;
  }, [monthDoses, filter]);

  const selectedDoses = useMemo(() => {
    const key = format(selectedDate, 'yyyy-MM-dd');
    return (dosesByDate.get(key) || [])
      .map(d => {
        const pep = getPeptideById(d.peptideId);
        return {
          ...d,
          peptideName: pep?.name ?? d.peptideId,
          protocolName: protocolsById.get(d.protocolId)?.name ?? '',
          color: CATEGORY_COLORS[pep?.category ?? 'healing'] ?? '#00d4aa',
        };
      })
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate, dosesByDate, protocolsById]);

  return (
    <div className="safe-top px-5 pt-4">
      <div className="flex items-center justify-between mb-5 stagger-item">
        <button
          onClick={() => setCurrentMonth(m => subMonths(m, 1))}
          className="tap-target p-2 rounded-xl hover:bg-card"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <h1 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h1>
        <button
          onClick={() => setCurrentMonth(m => addMonths(m, 1))}
          className="tap-target p-2 rounded-xl hover:bg-card"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0 mb-2 stagger-item" style={{ animationDelay: '0.05s' }}>
        {WEEKDAYS.map((day, i) => (
          <div key={i} className="text-center text-xs font-medium text-text-muted py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3 stagger-item" style={{ animationDelay: '0.08s' }}>
        {CATEGORY_LABELS.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[key] }} />
            <span className="text-[10px] text-text-muted">{label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0 stagger-item" style={{ animationDelay: '0.1s' }}>
        {calendarDays.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayDoses = dosesByDate.get(dateKey) || [];
          const inMonth = isSameMonth(day, currentMonth);
          const selected = isSameDay(day, selectedDate);
          const today = isToday(day);

          const dayPeptides = (() => {
            const seen = new Set<string>();
            const segs: { name: string; color: string }[] = [];
            for (const d of dayDoses) {
              const pep = getPeptideById(d.peptideId);
              const name = pep?.name ?? d.peptideId;
              if (seen.has(name)) continue;
              seen.add(name);
              segs.push({ name, color: CATEGORY_COLORS[pep?.category ?? 'healing'] ?? '#00d4aa' });
            }
            return segs;
          })();
          const MAX_SEG = 8;
          const dayExtra = dayPeptides.length - MAX_SEG;
          const dayStrip = dayPeptides.slice(0, MAX_SEG);

          return (
            <button
              key={dateKey}
              onClick={() => setSelectedDate(day)}
              className={`
                relative flex flex-col items-center justify-center py-2 min-h-[52px] rounded-xl transition-colors
                ${!inMonth ? 'opacity-30' : ''}
                ${selected ? 'bg-primary/15 ring-1 ring-primary/40' : 'hover:bg-card'}
              `}
            >
              <span
                className={`
                  text-sm font-medium
                  ${today && !selected ? 'text-primary' : ''}
                  ${selected ? 'text-primary font-semibold' : ''}
                  ${!today && !selected ? 'text-text' : ''}
                `}
              >
                {format(day, 'd')}
              </span>
              {dayStrip.length > 0 && (
                <div className="flex items-end gap-px mt-1 h-3">
                  {dayStrip.map((s, i) => (
                    <div
                      key={i}
                      className="h-full w-1.5 rounded-sm shrink-0"
                      style={{ backgroundColor: s.color }}
                      title={s.name}
                    />
                  ))}
                  {dayExtra > 0 && (
                    <span className="text-[8px] leading-none text-text-muted ml-0.5">+{dayExtra}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 stagger-item" style={{ animationDelay: '0.15s' }}>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-3">
          {format(selectedDate, 'EEEE, MMMM d')}
        </h2>

        {selectedDoses.length === 0 ? (
          <div className="card-glass p-6 text-center">
            <p className="text-text-muted text-sm">No doses scheduled</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDoses.map((dose) => {
              const isDone = dose.status === 'logged';
              const isMissed = dose.status === 'missed';
              const doseLog = logsByDoseId.get(dose.id);
              return (
                <button
                  key={dose.id}
                  onClick={() => setActiveDose(dose)}
                  className="card-glass w-full flex items-center gap-3 p-4 tap-target text-left"
                >
                  <div className="flex flex-col items-center w-12">
                    <span className="text-xs font-mono text-text-muted">{dose.time}</span>
                    <div
                      className="w-2 h-2 rounded-full mt-1"
                      style={{ backgroundColor: isDone ? '#22c55e' : isMissed ? '#ef4444' : dose.color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`font-medium text-sm ${isDone ? 'text-text-muted' : ''}`}>
                        {dose.peptideName}
                      </p>
                      <UserBadge owner={dose.owner} />
                    </div>
                    {dose.protocolName && (
                      <p className="text-[10px] text-text-muted truncate">{dose.protocolName}</p>
                    )}
                    <p className="text-xs text-text-muted font-mono">
                      {doseLog?.dose ?? dose.dose} {dose.unit} · {dose.route === 'subq' ? 'SubQ' : dose.route}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                    isDone ? 'bg-success/15 text-success' :
                    isMissed ? 'bg-danger/15 text-danger' :
                    'bg-primary-dim text-primary'
                  }`}>
                    {isDone ? 'Done' : isMissed ? 'Missed' : 'Pending'}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {activeDose && (
        <DoseActionSheet
          dose={activeDose}
          log={logsByDoseId.get(activeDose.id)}
          onClose={() => setActiveDose(null)}
          onUpdated={() => setReloadKey(k => k + 1)}
        />
      )}
    </div>
  );
}
