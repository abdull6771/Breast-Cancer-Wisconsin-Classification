import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { ReportPreview } from '@/components/report/ReportPreview';
import { Button } from '@/components/ui/button';
import { useSessionStore } from '@/store/session';

export function ReportsPage() {
  const hasAnalysis = useSessionStore((state) => state.lastAnalysis !== null);

  return (
    <div>
      <PageHeader
        eyebrow="Documentation"
        title="Reports"
        description="Preview the last session report and download medical_report.pdf. The file is a multi-page clinical document: case metadata, model indication, eight metrics with scale bands, population comparison, explanation, AI note when present, citation, and disclaimer."
        actions={
          !hasAnalysis ? (
            <Button asChild variant="outline">
              <Link to="/analyze">Create an analysis</Link>
            </Button>
          ) : null
        }
      />
      <ReportPreview />
    </div>
  );
}
