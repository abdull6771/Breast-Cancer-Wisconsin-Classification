import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, FileSearch } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { DiagnosisBanner } from '@/components/clinical/DiagnosisBanner';
import { ConfidenceMeter } from '@/components/clinical/ConfidenceMeter';
import { PopulationRadar } from '@/components/charts/PopulationRadar';
import { FeatureContributionChart } from '@/components/charts/FeatureContributionChart';
import { RecommendationPanel } from '@/components/ai/RecommendationPanel';
import { DownloadReportButton } from '@/components/report/DownloadReportButton';
import { CorrectionForm } from '@/components/feedback/CorrectionForm';
import { EmptyState } from '@/components/common/EmptyState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { usePopulationStats } from '@/features/analytics/usePopulationStats';
import { useConfig } from '@/features/config/useConfig';
import { useRecommend } from '@/features/recommendations/useRecommend';
import { featuresToRecord } from '@/lib/formatters';
import { toApiFailure } from '@/lib/api/client';
import { useSessionStore } from '@/store/session';

export function ResultsPage() {
  const analysis = useSessionStore((state) => state.lastAnalysis);
  const recommendation = useSessionStore((state) => state.lastRecommendation);
  const population = usePopulationStats();
  const config = useConfig();
  const recommend = useRecommend();
  const requestedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!analysis) return;
    if (config.isPending) return;
    if (config.data?.geminiConfigured === false) return;
    if (recommendation) return;
    if (requestedFor.current === analysis.analyzedAt) return;
    requestedFor.current = analysis.analyzedAt;
    recommend.mutate({
      diagnosis: analysis.message,
      features: featuresToRecord(analysis.features),
    });
  }, [analysis, config.isPending, config.data?.geminiConfigured, recommendation, recommend]);

  if (!analysis) {
    return (
      <EmptyState
        icon={<FileSearch className="h-5 w-5" />}
        title="No analysis in this session"
        description="Submit eight FNA biomarker scores to see the model indication, population comparison, explanation, and report tools."
        action={
          <Button asChild>
            <Link to="/analyze">Go to Analyze</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="print:max-w-none">
      <PageHeader
        eyebrow="Session results"
        title="Model indication"
        description="Review the classification indicated by the model, then inspect supporting evidence. This is not a diagnosis."
        actions={
          <Button asChild variant="outline">
            <Link to="/analyze">Revise scores</Link>
          </Button>
        }
      />

      <div className="space-y-8">
        <section>
          <SectionHeader index="01" title="Diagnosis and interpretation" />
          <DiagnosisBanner diagnosis={analysis.diagnosis} message={analysis.message} />
          <div className="mt-4">
            <ConfidenceMeter features={analysis.features} />
          </div>
        </section>

        <section>
          <SectionHeader
            index="02"
            title="Population analytics"
            description="Patient profile overlaid on mean benign and malignant patterns from the Wisconsin dataset."
          />
          <Card>
            <CardContent className="pt-5">
              <PopulationRadar
                patient={analysis.features}
                stats={population.data}
                isLoading={population.isPending}
                errorMessage={
                  population.isError ? toApiFailure(population.error).message : null
                }
                onRetry={() => {
                  void population.refetch();
                }}
              />
            </CardContent>
          </Card>
        </section>

        <section>
          <SectionHeader
            index="03"
            title="Model explanation (XAI)"
            description="Feature contributions sorted by influence. Positive values lean malignant; negative values lean benign."
          />
          <Card>
            <CardContent className="pt-5">
              <FeatureContributionChart
                contributions={analysis.contributions}
                featureNames={analysis.featureNames}
              />
            </CardContent>
          </Card>
        </section>

        <section>
          <SectionHeader
            index="04"
            title="AI recommendation"
            description="Structured educational note. Not medical advice."
          />
          <Card>
            <CardContent className="pt-5">
              <RecommendationPanel
                markdown={recommendation}
                isLoading={recommend.isPending}
                errorMessage={
                  recommend.isError ? toApiFailure(recommend.error).message : null
                }
                geminiConfigured={config.data?.geminiConfigured}
                configPending={config.isPending}
                onRetry={() => {
                  recommend.mutate({
                    diagnosis: analysis.message,
                    features: featuresToRecord(analysis.features),
                  });
                }}
              />
            </CardContent>
          </Card>
        </section>

        <section>
          <SectionHeader
            index="05"
            title="Download medical report"
            description="Exports date, indication, all eight metrics, the AI note if present, and the disclaimer as medical_report.pdf."
          />
          <Card>
            <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                Available after a prediction exists. Generation runs on the API and
                degrades gracefully if the PDF service fails.
              </p>
              <DownloadReportButton />
            </CardContent>
          </Card>
        </section>

        <section>
          <SectionHeader index="06" title="Report incorrect prediction" />
          <Collapsible className="rounded-card border border-line bg-surface shadow-card">
            <CollapsibleTrigger className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              Maintenance: Report Incorrect Prediction
              <ChevronDown className="h-4 w-4 text-muted" aria-hidden />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-5 pb-5">
              <CorrectionForm compact />
            </CollapsibleContent>
          </Collapsible>
        </section>
      </div>
    </div>
  );
}
