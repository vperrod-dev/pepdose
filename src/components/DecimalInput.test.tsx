// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { DecimalInput } from './DecimalInput';

afterEach(cleanup);

describe('DecimalInput min clamping', () => {
  it('clamps a typed negative value to min', () => {
    const onChange = vi.fn();
    render(<DecimalInput value={1} onChange={onChange} min={0} aria-label="dose" />);
    fireEvent.change(screen.getByLabelText('dose'), { target: { value: '-5' } });
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it('passes an in-range value through unchanged', () => {
    const onChange = vi.fn();
    render(<DecimalInput value={1} onChange={onChange} min={0} aria-label="dose" />);
    fireEvent.change(screen.getByLabelText('dose'), { target: { value: '2.5' } });
    expect(onChange).toHaveBeenCalledWith(2.5);
  });

  it('passes negative values through when no min is set', () => {
    const onChange = vi.fn();
    render(<DecimalInput value={1} onChange={onChange} aria-label="dose" />);
    fireEvent.change(screen.getByLabelText('dose'), { target: { value: '-5' } });
    expect(onChange).toHaveBeenCalledWith(-5);
  });
});
