import { FEATURE_MAX } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { scoreTone } from '@/lib/formatters';

interface ScoreScaleProps {
  value: number;
  id: string;
}

const TONE_CLASS: Record<'benign' | 'warning' | 'malignant', string> = {
  benign: 'bg-teal',
  warning: 'bg-warning',
  malignant: 'bg-malignant',
};

export function ScoreScale({ value, id }: ScoreScaleProps) {
  const tone = scoreTone(value);

  return (
    <div className="space-y-1.5">
      <div
        className="flex gap-1"
        role="meter"
        aria-valuemin={1}
        aria-valuemax={FEATURE_MAX}
        aria-valuenow={value}
        aria-labelledby={id}
      >
        {Array.from({ length: FEATURE_MAX }, (_, index) => {
          const tick = index + 1;
          const filled = tick <= value;
          return (
            <span
              key={tick}
              className={cn(
                'h-2 flex-1 rounded-sm',
                filled ? TONE_CLASS[tone] : 'bg-line',
              )}
            />
          );
        })}
      </div>
      <div className="flex justify-between font-tabular text-[10px] text-muted">
        <span>1</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );
}
