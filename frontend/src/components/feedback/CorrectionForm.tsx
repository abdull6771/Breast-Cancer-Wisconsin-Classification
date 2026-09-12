import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { feedbackSchema } from '@/features/prediction/schema';
import { useFeedback } from '@/features/feedback/useFeedback';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FeedbackFormValues } from '@/types/clinical';
import { useSessionStore } from '@/store/session';
import { ErrorState } from '@/components/common/ErrorState';

interface CorrectionFormProps {
  compact?: boolean;
}

export function CorrectionForm({ compact = false }: CorrectionFormProps) {
  const analysis = useSessionStore((state) => state.lastAnalysis);
  const feedback = useFeedback();
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      userCorrection: 'Benign',
      comments: '',
    },
  });

  if (!analysis) {
    return (
      <p className="text-sm text-muted">
        Complete an analysis before reporting an incorrect prediction.
      </p>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        void form.handleSubmit((values) => {
          feedback.mutate({
            inputs: analysis.features,
            modelPrediction: analysis.message,
            userCorrection: values.userCorrection,
            comments: values.comments,
          });
        })(event);
      }}
    >
      {!compact ? (
        <p className="text-sm leading-6 text-muted">
          Help us improve the model. If this diagnosis seems wrong based on clinical
          evidence, flag it here.
        </p>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="actual-diagnosis">Actual Diagnosis</Label>
        <Select
          value={form.watch('userCorrection')}
          onValueChange={(value) => {
            form.setValue('userCorrection', value as FeedbackFormValues['userCorrection']);
          }}
        >
          <SelectTrigger id="actual-diagnosis" aria-label="Actual Diagnosis">
            <SelectValue placeholder="Select diagnosis" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Benign">Benign</SelectItem>
            <SelectItem value="Malignant">Malignant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="clinical-notes">Clinical Notes</Label>
        <Textarea
          id="clinical-notes"
          placeholder="Describe the clinical evidence that contradicts the model indication."
          {...form.register('comments')}
        />
        {form.formState.errors.comments ? (
          <p className="text-xs text-malignant">{form.formState.errors.comments.message}</p>
        ) : null}
      </div>

      {feedback.isError ? (
        <ErrorState
          message={
            feedback.error instanceof Error
              ? feedback.error.message
              : 'Feedback could not be saved.'
          }
        />
      ) : null}

      <Button type="submit" disabled={feedback.isPending}>
        {feedback.isPending ? 'Submitting…' : 'Submit Feedback'}
      </Button>
    </form>
  );
}
