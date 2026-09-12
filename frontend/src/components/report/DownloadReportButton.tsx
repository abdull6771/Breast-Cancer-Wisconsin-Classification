import { FileDown, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/common/ErrorState';
import { useReport } from '@/features/reports/useReport';
import { toApiFailure } from '@/lib/api/client';
import { useSessionStore } from '@/store/session';

export function DownloadReportButton() {
  const analysis = useSessionStore((state) => state.lastAnalysis);
  const recommendation = useSessionStore((state) => state.lastRecommendation);
  const report = useReport();

  const disabled = !analysis || report.isPending;

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="default"
        size="lg"
        disabled={disabled}
        onClick={() => {
          if (!analysis) return;
          report.mutate({
            features: analysis.features,
            predictionText: analysis.message,
            recommendation: recommendation ?? undefined,
          });
        }}
      >
        {report.isPending ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <FileDown className="h-4 w-4" aria-hidden />
        )}
        {report.isPending ? 'Preparing report…' : 'Download Medical Report (PDF)'}
      </Button>
      {report.isError ? (
        <ErrorState
          title="PDF report could not be generated"
          message={toApiFailure(report.error).message}
          onRetry={() => {
            if (!analysis) return;
            report.mutate({
              features: analysis.features,
              predictionText: analysis.message,
              recommendation: recommendation ?? undefined,
            });
          }}
        />
      ) : null}
    </div>
  );
}
