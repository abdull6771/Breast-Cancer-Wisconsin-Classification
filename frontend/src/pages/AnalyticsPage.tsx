import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { PopulationRadar } from '@/components/charts/PopulationRadar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePopulationStats } from '@/features/analytics/usePopulationStats';
import { toApiFailure } from '@/lib/api/client';
import { FEATURES } from '@/lib/constants';
import { formatScore } from '@/lib/formatters';
import { useSessionStore } from '@/store/session';

export function AnalyticsPage() {
  const analysis = useSessionStore((state) => state.lastAnalysis);
  const population = usePopulationStats();

  return (
    <div>
      <PageHeader
        eyebrow="Population workspace"
        title="Population analytics"
        description="Typical benign and malignant profiles from the Wisconsin Breast Cancer dataset. The last patient overlay appears when an analysis exists in this session."
        actions={
          analysis ? (
            <Badge variant={analysis.diagnosis === 'BENIGN' ? 'benign' : 'malignant'}>
              Overlay: {analysis.diagnosis}
            </Badge>
          ) : (
            <Button asChild variant="outline">
              <Link to="/analyze">Add a patient overlay</Link>
            </Button>
          )
        }
      />

      <Card>
        <CardContent className="pt-5">
          <PopulationRadar
            patient={analysis?.features}
            stats={population.data}
            isLoading={population.isPending}
            errorMessage={population.isError ? toApiFailure(population.error).message : null}
            onRetry={() => {
              void population.refetch();
            }}
          />
        </CardContent>
      </Card>

      {analysis ? (
        <div className="mt-6 overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full min-w-[640px] text-left text-sm">
            <caption className="sr-only">Current patient scores versus population averages</caption>
            <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Feature</th>
                <th className="px-4 py-3 font-medium">Patient</th>
                <th className="px-4 py-3 font-medium">Avg benign</th>
                <th className="px-4 py-3 font-medium">Avg malignant</th>
              </tr>
            </thead>
            <tbody>
              {FEATURES.map((feature, index) => (
                <tr key={feature.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink">{feature.label}</td>
                  <td className="px-4 py-3 font-tabular">{formatScore(analysis.features[index] ?? 0)}</td>
                  <td className="px-4 py-3 font-tabular text-muted">
                    {formatScore(population.data?.benign[index] ?? 0)}
                  </td>
                  <td className="px-4 py-3 font-tabular text-muted">
                    {formatScore(population.data?.malignant[index] ?? 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
