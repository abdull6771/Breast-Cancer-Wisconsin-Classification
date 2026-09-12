import { Link } from 'react-router-dom';
import { ArrowRight, FlaskConical, ScanSearch, Shield } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DATASET_NOTES, FEATURES, SCALE_LEGEND } from '@/lib/constants';
import { formatDateTime } from '@/lib/formatters';
import { useSessionStore } from '@/store/session';

const STEPS = [
  {
    title: 'Score the smear',
    body: 'Enter eight FNA biomarkers on a 1–10 cytologic scale. Bare Nuclei is excluded by design.',
    icon: FlaskConical,
  },
  {
    title: 'Review the indication',
    body: 'The model returns BENIGN or MALIGNANT, then shows population context and feature contributions.',
    icon: ScanSearch,
  },
  {
    title: 'Document with caution',
    body: 'Download an educational report or flag an incorrect prediction. Nothing here replaces a clinician.',
    icon: Shield,
  },
];

export function OverviewPage() {
  const lastAnalysis = useSessionStore((state) => state.lastAnalysis);

  return (
    <div>
      <PageHeader
        eyebrow="Workstation"
        title="Breast Cancer Wisconsin Classifier"
        description="An educational clinical workstation for classifying a breast tumor as BENIGN or MALIGNANT from eight Fine Needle Aspirate biomarkers. Indicated by the model — for research and teaching only."
        actions={
          <Button asChild size="lg">
            <Link to="/analyze">
              Start analysis
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Biomarkers in model" value="8" hint="Scored 1–10" />
        <StatCard
          label="Dataset samples"
          value={String(DATASET_NOTES.instances)}
          hint="Wisconsin Original"
        />
        <StatCard label="Clinical status" value="Educational" hint="Not a medical device" />
      </div>

      <section className="mt-10">
        <h2 className="font-serif text-xl text-ink">How the tool works</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <Card key={step.title}>
              <CardHeader>
                <p className="font-tabular text-xs text-teal">0{String(index + 1)}</p>
                <div className="flex items-center gap-2">
                  <step.icon className="h-4 w-4 text-navy" aria-hidden />
                  <CardTitle className="text-base">{step.title}</CardTitle>
                </div>
                <CardDescription>{step.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl text-ink">Feature scale legend</h2>
        <p className="mt-1 text-sm text-muted">
          Scores are cytologic impressions, not laboratory SI units.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {SCALE_LEGEND.map((item) => (
            <div
              key={item.range}
              className="rounded-card border border-line bg-surface px-4 py-3 shadow-card"
            >
              <p className="font-tabular text-sm font-semibold text-ink">{item.range}</p>
              <p className="mt-1 text-sm text-muted">{item.label}</p>
            </div>
          ))}
        </div>
        <ul className="mt-4 columns-1 gap-x-8 text-sm text-muted md:columns-2">
          {FEATURES.map((feature) => (
            <li key={feature.id} className="mb-1.5">
              {feature.label}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl text-ink">Recent analysis</h2>
        {lastAnalysis ? (
          <Card className="mt-4">
            <CardContent className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Badge
                  variant={lastAnalysis.diagnosis === 'BENIGN' ? 'benign' : 'malignant'}
                >
                  {lastAnalysis.diagnosis}
                </Badge>
                <p className="mt-2 font-serif text-lg text-ink">{lastAnalysis.message}</p>
                <p className="mt-1 text-sm text-muted">
                  {formatDateTime(lastAnalysis.analyzedAt)} · indicated by the model
                </p>
              </div>
              <Button asChild variant="outline">
                <Link to="/results">Open results</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mt-4">
            <CardContent className="pt-5 text-sm text-muted">
              No analysis in this session. Start from Analyze to score a specimen.
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card>
      <CardContent className="pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
        <p className="mt-2 font-serif text-3xl text-ink">{value}</p>
        <p className="mt-1 text-sm text-muted">{hint}</p>
      </CardContent>
    </Card>
  );
}
