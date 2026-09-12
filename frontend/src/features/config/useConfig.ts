import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/endpoints';

export function useConfig() {
  return useQuery({
    queryKey: ['config'],
    queryFn: () => api.getConfig(),
    staleTime: 60_000,
    retry: 1,
  });
}
