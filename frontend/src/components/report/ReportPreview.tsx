import { FEATURES } from '@/lib/constants';
import { formatDateTime, formatScore } from '@/lib/formatters';
import { MarkdownClinicalNote } from '@/components/ai/MarkdownClinicalNote';
import { EmptyState } from '@/components/common/EmptyState';
import { DownloadReportButton } from '@/components/report/DownloadReportButton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSessionStore } from '@/store/session';

export function ReportPreview() {
  const analysis = useSessionStore((state) => state.lastAnalysis);
  const recommendation = useSessionStore((state) => state.lastRecommendation);
  const generatedAt = useSessionStore((state) => state.lastReportGeneratedAt);

  if (!analysis) {
    return (
      <EmptyState
        title="No report to preview"
        description="Run an analysis first. The last indication, metrics, and AI note will appear here for download as medical_report.pdf."
      />
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal">
            Draft report
          </p>
          <CardTitle className="mt-1">Breast Cancer Classification Report</CardTitle>
          <p className="mt-1 text-sm text-muted">{formatDateTime(analysis.analyzedAt)}</p>
        </div>
        <Badge variant={analysis.diagnosis === 'BENIGN' ? 'benign' : 'malignant'}>
          {analysis.diagnosis}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-ink">Diagnosis result</h4>
          <p className="mt-1 text-sm text-muted">
            The analysis indicates: {analysis.message}
          </p>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold text-ink">Patient metrics</h4>
          <dl className="grid gap-2 sm:grid-cols-2">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.id}
                className="flex items-center justify-between rounded-lg bg-canvas px-3 py-2"
              >
                <dt className="text-sm text-muted">{feature.label}</dt>
                <dd className="font-tabular text-sm font-medium text-ink">
                  {formatScore(analysis.features[index] ?? 1)}/10
                </dd>
              </div>
            ))}
          </dl>
        </div>
        {recommendation ? (
          <div>
            <h4 className="mb-2 text-sm font-semibold text-ink">AI recommendations</h4>
            <MarkdownClinicalNote markdown={recommendation} />
          </div>
        ) : (
          <p className="text-sm text-muted">
            No AI recommendation is attached to this report yet.
          </p>
        )}
        {generatedAt ? (
          <p className="text-xs text-muted">Last downloaded {formatDateTime(generatedAt)}.</p>
        ) : null}
        <DownloadReportButton />
      </CardContent>
    </Card>
  );
}
