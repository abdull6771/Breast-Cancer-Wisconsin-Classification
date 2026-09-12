import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageHeader } from '@/components/layout/PageHeader';
import { BiomarkerField } from '@/components/clinical/BiomarkerField';
import { AnalyzingState } from '@/components/clinical/AnalyzingState';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/ui/button';
import { analyzeSchema } from '@/features/prediction/schema';
import { usePredict } from '@/features/prediction/usePredict';
import { DEFAULT_FORM_VALUES, FEATURES } from '@/lib/constants';
import { arrayToFormValues, featuresToArray } from '@/lib/formatters';
import {
  SAMPLE_BENIGN_FEATURES,
  SAMPLE_MALIGNANT_FEATURES,
} from '@/mocks/fixtures';
import type { AnalyzeFormValues } from '@/types/clinical';

export function AnalyzePage() {
  const navigate = useNavigate();
  const predict = usePredict();
  const form = useForm<AnalyzeFormValues>({
    resolver: zodResolver(analyzeSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const pending = predict.isPending;

  return (
    <div>
      <PageHeader
        eyebrow="Clinical intake"
        title="Analyze tumor"
        description="Enter eight Fine Needle Aspirate scores on a 1–10 scale. Bare Nuclei is intentionally excluded from this model. The result is indicated by the model for educational use."
        actions={
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                form.reset(arrayToFormValues([...SAMPLE_BENIGN_FEATURES]));
              }}
            >
              Load benign sample
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                form.reset(arrayToFormValues([...SAMPLE_MALIGNANT_FEATURES]));
              }}
            >
              Load malignant sample
            </Button>
          </div>
        }
      />

      {predict.isError ? (
        <div className="mb-6">
          <ErrorState
            title="Analysis could not be completed"
            message={
              predict.error instanceof Error
                ? predict.error.message
                : 'The classifier did not return a result.'
            }
            onRetry={() => {
              void form.handleSubmit(onSubmit)();
            }}
          />
        </div>
      ) : null}

      <AnalyzingState visible={pending} />

      <form
        className={pending ? 'pointer-events-none mt-6 opacity-50' : ''}
        onSubmit={(event) => {
          void form.handleSubmit(onSubmit)(event);
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <BiomarkerField
              key={feature.id}
              feature={feature}
              value={form.watch(feature.id)}
              error={form.formState.errors[feature.id]?.message}
              onChange={(value) => {
                form.setValue(feature.id, value, { shouldValidate: true });
              }}
            />
          ))}
        </div>

        <div className="mt-6 hidden md:block">
          <Button type="submit" size="lg" disabled={pending}>
            Analyze Tumor
          </Button>
        </div>

        <div className="sticky bottom-3 z-20 mt-6 md:hidden">
          <Button type="submit" size="lg" className="w-full shadow-card" disabled={pending}>
            Analyze Tumor
          </Button>
        </div>
      </form>
    </div>
  );

  function onSubmit(values: AnalyzeFormValues) {
    predict.mutate(
      { features: featuresToArray(values) },
      {
        onSuccess: () => {
          navigate('/results');
        },
      },
    );
  }
}
