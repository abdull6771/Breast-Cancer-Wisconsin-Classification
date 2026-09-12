import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/endpoints';

export function usePopulationStats() {
  return useQuery({
    queryKey: ['population-stats'],
    queryFn: () => api.getPopulationStats(),
    staleTime: 5 * 60_000,
    retry: 1,
  });
}
