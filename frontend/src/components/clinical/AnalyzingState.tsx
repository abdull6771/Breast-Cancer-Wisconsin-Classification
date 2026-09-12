interface AnalyzingStateProps {
  visible: boolean;
}

const STEPS = [
  'Validating eight FNA biomarkers',
  'Running the Wisconsin classifier',
  'Preparing explanation and comparison panels',
];

export function AnalyzingState({ visible }: AnalyzingStateProps) {
  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-card border border-line bg-surface px-6 py-8 shadow-card"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal">
        Specimen in review
      </p>
      <h2 className="mt-2 font-serif text-2xl text-ink">Analyzing tumor metrics</h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
        The classifier is evaluating the eight Fine Needle Aspirate scores. This
        indication is educational and will not replace a clinical read.
      </p>
      <div className="mt-6 h-1 overflow-hidden rounded-full bg-line">
        <div className="h-full w-1/2 animate-pulse bg-teal" />
      </div>
      <ol className="mt-6 space-y-2">
        {STEPS.map((step, index) => (
          <li key={step} className="flex items-center gap-3 text-sm text-ink">
            <span className="font-tabular text-xs text-teal">0{String(index + 1)}</span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
