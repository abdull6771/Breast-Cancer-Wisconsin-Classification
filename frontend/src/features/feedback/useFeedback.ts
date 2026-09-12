import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api/endpoints';
import type { FeedbackRequest } from '@/types/api';

export function useFeedback() {
  return useMutation({
    mutationFn: (body: FeedbackRequest) => api.feedback(body),
    onSuccess: () => {
      toast.success('Thank you. Data logged for the next training cycle.');
    },
  });
}
