import { Droplets } from 'lucide-react';
import { DecimalInput } from './DecimalInput';
import { clicksForDose, formatClicks, penMlPerClick } from '../utils/penClicks';
import type { ReconMix } from '../db/schema';

interface ReconMixFieldsProps {
  value?: ReconMix;
  /** Current dose for this peptide — used for the live clicks preview. */
  dose: number;
  unit: 'mcg' | 'mg' | 'IU';
  onChange: (mix: ReconMix) => void;
}

/** Vial amount + BAC water for one peptide in a protocol, with the resulting
 *  pen clicks per dose. Shared by the create and edit protocol screens. */
export function ReconMixFields({ value, dose, unit, onChange }: ReconMixFieldsProps) {
  const mix = value ?? { vialAmount: 0, bacWaterMl: 0 };
  const vialUnit = unit === 'IU' ? 'IU' : 'mg';
  const clicks = formatClicks(clicksForDose(dose, unit, value, penMlPerClick()));

  return (
    <div className="mt-3 pt-3 border-t border-border">
      <p className="text-xs text-text-muted mb-2 flex items-center gap-1.5">
        <Droplets className="w-3.5 h-3.5" />
        Mix (for pen clicks)
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-xs text-text-muted block mb-1">Peptide ({vialUnit})</span>
          <DecimalInput
            aria-label={`Vial amount in ${vialUnit}`}
            value={mix.vialAmount}
            onChange={v => onChange({ ...mix, vialAmount: v })}
            min={0}
            className="w-full bg-bg-raised border border-border rounded-lg px-3 py-2 text-sm font-mono text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div>
          <span className="text-xs text-text-muted block mb-1">BAC water (ml)</span>
          <DecimalInput
            aria-label="Bacteriostatic water in ml"
            value={mix.bacWaterMl}
            onChange={v => onChange({ ...mix, bacWaterMl: v })}
            min={0}
            className="w-full bg-bg-raised border border-border rounded-lg px-3 py-2 text-sm font-mono text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>
      <p className="text-[11px] mt-2 font-mono text-primary">
        {clicks ? `${clicks} per dose` : 'Enter vial amount and water to see clicks per dose'}
      </p>
    </div>
  );
}
