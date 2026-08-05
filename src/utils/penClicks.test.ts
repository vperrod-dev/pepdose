import { describe, it, expect } from 'vitest';
import { clicksForDose, formatClicks, DEFAULT_ML_PER_CLICK } from './penClicks';

const MIX = { vialAmount: 10, bacWaterMl: 2 }; // 5 mg/ml

describe('clicksForDose', () => {
  it('converts an mg dose to pen clicks at 0.01 ml per click', () => {
    expect(clicksForDose(0.5, 'mg', MIX, DEFAULT_ML_PER_CLICK)?.clicks).toBeCloseTo(10);
  });

  it('converts an mcg dose through mg', () => {
    expect(clicksForDose(500, 'mcg', MIX, DEFAULT_ML_PER_CLICK)?.clicks).toBeCloseTo(10);
  });

  it('treats an IU dose as the vial IU count, not a mass', () => {
    expect(clicksForDose(2, 'IU', { vialAmount: 5000, bacWaterMl: 1 }, 0.01)?.volumeMl)
      .toBeCloseTo(0.0004);
  });

  it('scales with a finer pen click volume', () => {
    expect(clicksForDose(0.5, 'mg', MIX, 0.005)?.clicks).toBeCloseTo(20);
  });

  it('returns null when the mix is missing', () => {
    expect(clicksForDose(0.5, 'mg', undefined)).toBeNull();
  });

  it('returns null when water is zero', () => {
    expect(clicksForDose(0.5, 'mg', { vialAmount: 10, bacWaterMl: 0 })).toBeNull();
  });
});

describe('formatClicks', () => {
  it('drops the trailing zero decimal', () => {
    expect(formatClicks(clicksForDose(0.5, 'mg', MIX))).toBe('10 clicks · 0.10 ml');
  });

  it('singularises one click', () => {
    expect(formatClicks(clicksForDose(0.05, 'mg', MIX))).toBe('1 click · 0.01 ml');
  });
});
