import { Minus, Plus, Info } from 'lucide-react';
import type { FeatureDefinition } from '@/types/clinical';
import { FEATURE_MAX, FEATURE_MIN } from '@/lib/constants';
import { cn } from '@/lib/cn';
import { scoreTone } from '@/lib/formatters';
import { ScoreScale } from '@/components/clinical/ScoreScale';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BiomarkerFieldProps {
  feature: FeatureDefinition;
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

const VALUE_TONE: Record<'benign' | 'warning' | 'malignant', string> = {
  benign: 'text-teal',
  warning: 'text-warning',
  malignant: 'text-malignant',
};

export function BiomarkerField({ feature, value, onChange, error }: BiomarkerFieldProps) {
  const labelId = `${feature.id}-label`;
  const tone = scoreTone(value);

  const step = (delta: number) => {
    onChange(Math.min(FEATURE_MAX, Math.max(FEATURE_MIN, value + delta)));
  };

  return (
    <article
      className={cn(
        'rounded-card border bg-surface p-4 shadow-card',
        error ? 'border-malignant/40' : 'border-line',
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 id={labelId} className="text-sm font-semibold text-ink">
              {feature.label}
            </h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="rounded-sm text-muted transition-colors hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`What a high ${feature.label} score typically indicates`}
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{feature.highScoreHint}</TooltipContent>
            </Tooltip>
          </div>
          <p className="mt-1 text-xs leading-5 text-muted">{feature.definition}</p>
        </div>
        <span
          className={cn(
            'font-tabular text-2xl font-semibold leading-none',
            VALUE_TONE[tone],
          )}
          aria-hidden
        >
          {value}
        </span>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => {
            step(-1);
          }}
          disabled={value <= FEATURE_MIN}
          aria-label={`Decrease ${feature.label}`}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <input
          id={feature.id}
          type="number"
          inputMode="numeric"
          min={FEATURE_MIN}
          max={FEATURE_MAX}
          step={1}
          value={value}
          aria-labelledby={labelId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${feature.id}-error` : undefined}
          className="h-9 w-full rounded-lg border border-line bg-canvas text-center font-tabular text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onChange={(event) => {
            const next = Number.parseInt(event.target.value, 10);
            if (Number.isNaN(next)) return;
            onChange(Math.min(FEATURE_MAX, Math.max(FEATURE_MIN, next)));
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => {
            step(1);
          }}
          disabled={value >= FEATURE_MAX}
          aria-label={`Increase ${feature.label}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScoreScale value={value} id={labelId} />
      {error ? (
        <p id={`${feature.id}-error`} className="mt-2 text-xs text-malignant">
          {error}
        </p>
      ) : null}
    </article>
  );
}
