import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { CorrectionForm } from '@/components/feedback/CorrectionForm';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/formatters';
import { useSessionStore } from '@/store/session';

export function FeedbackPage() {
  const analysis = useSessionStore((state) => state.lastAnalysis);

  return (
    <div>
      <PageHeader
        eyebrow="Model maintenance"
        title="Clinician feedback"
        description="Help us improve the model. If this diagnosis seems wrong based on clinical evidence, flag it here. Corrections persist on the backend for the next training cycle."
      />

      {analysis ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
          <Card>
            <CardHeader>
              <CardTitle>Report incorrect prediction</CardTitle>
            </CardHeader>
            <CardContent>
              <CorrectionForm />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current model indication</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={analysis.diagnosis === 'BENIGN' ? 'benign' : 'malignant'}>
                {analysis.diagnosis}
              </Badge>
              <p className="mt-3 text-sm text-ink">{analysis.message}</p>
              <p className="mt-2 text-xs text-muted">{formatDateTime(analysis.analyzedAt)}</p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/results">Review full results</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <EmptyState
          title="No prediction to correct"
          description="Submit an analysis first. Feedback is stored with the eight input scores and the model’s indication."
          action={
            <Button asChild>
              <Link to="/analyze">Analyze a specimen</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
