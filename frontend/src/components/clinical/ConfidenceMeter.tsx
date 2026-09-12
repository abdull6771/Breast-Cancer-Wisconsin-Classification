import { patternLean } from '@/lib/formatters';
import { cn } from '@/lib/cn';

interface ConfidenceMeterProps {
  features: number[];
}

const BAR: Record<'benign' | 'warning' | 'malignant', string> = {
  benign: 'bg-benign',
  warning: 'bg-warning',
  malignant: 'bg-malignant',
};

export function ConfidenceMeter({ features }: ConfidenceMeterProps) {
  const lean = patternLean(features);

  return (
    <div className="rounded-card border border-line bg-surface p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        Pattern intensity
      </p>
      <p className="mt-2 font-serif text-xl text-ink">{lean.label}</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
        <div
          className={cn('h-full rounded-full transition-all duration-clinical', BAR[lean.tone])}
          style={{ width: `${String(lean.intensity)}%` }}
        />
      </div>
      <p className="mt-3 text-xs leading-5 text-muted">
        Educational visualization of how strongly the entered scores lean toward one
        profile. This is not a model-calibrated probability and must not be read as
        diagnostic confidence.
      </p>
    </div>
  );
}
