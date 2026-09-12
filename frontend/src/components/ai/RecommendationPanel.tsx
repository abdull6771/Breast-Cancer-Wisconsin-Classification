import { Link } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { MarkdownClinicalNote } from '@/components/ai/MarkdownClinicalNote';
import { ErrorState } from '@/components/common/ErrorState';
import { RecommendationSkeleton } from '@/components/common/Skeleton';
import { Button } from '@/components/ui/button';

interface RecommendationPanelProps {
  markdown: string | null;
  isLoading: boolean;
  errorMessage: string | null;
  geminiConfigured: boolean | undefined;
  configPending: boolean;
  onRetry: () => void;
}

export function RecommendationPanel({
  markdown,
  isLoading,
  errorMessage,
  geminiConfigured,
  configPending,
  onRetry,
}: RecommendationPanelProps) {
  if (configPending || isLoading) {
    return <RecommendationSkeleton />;
  }

  if (geminiConfigured === false) {
    return (
      <div
        role="status"
        className="rounded-lg border border-warning/25 bg-[#FBF3E7] px-4 py-3 text-sm leading-6 text-[#7A4B12] dark:bg-[#2A1F12] dark:text-[#E8C48A]"
      >
        A Gemini API key is not configured on the server. Diagnosis, population
        analytics, model explanation, and PDF export remain available.{' '}
        <Link to="/settings" className="font-medium underline underline-offset-2">
          Open Settings
        </Link>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="space-y-3">
        <ErrorState
          title="AI recommendation unavailable"
          message={errorMessage}
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (!markdown) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-canvas px-4 py-3">
        <p className="text-sm text-muted">
          No recommendation has been generated for this analysis yet.
        </p>
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          Generate
        </Button>
      </div>
    );
  }

  return (
    <div>
      <MarkdownClinicalNote markdown={markdown} />
      <p className="mt-4 text-xs leading-5 text-muted">
        Generated text is not medical advice. Always consult a qualified clinician.
      </p>
    </div>
  );
}
