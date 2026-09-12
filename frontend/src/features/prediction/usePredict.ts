import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/endpoints';
import { useSessionStore } from '@/store/session';
import type { PredictRequest } from '@/types/api';

export function usePredict() {
  const setAnalysis = useSessionStore((state) => state.setAnalysis);

  return useMutation({
    mutationFn: (body: PredictRequest) => api.predict(body),
    onSuccess: (data, variables) => {
      setAnalysis({
        features: variables.features,
        diagnosis: data.diagnosis,
        message: data.message,
        contributions: data.contributions,
        featureNames: data.featureNames,
        analyzedAt: new Date().toISOString(),
      });
    },
  });
}
