import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/endpoints';
import { useSessionStore } from '@/store/session';
import type { RecommendRequest } from '@/types/api';

export function useRecommend() {
  const geminiKey = useSessionStore((state) => state.geminiKey);
  const setRecommendation = useSessionStore((state) => state.setRecommendation);

  return useMutation({
    mutationFn: (body: RecommendRequest) => api.recommend(body, { geminiKey }),
    onSuccess: (data) => {
      setRecommendation(data.markdown);
    },
  });
}
