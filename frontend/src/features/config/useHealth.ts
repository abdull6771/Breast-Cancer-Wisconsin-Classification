import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/endpoints';

export function useHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => api.getHealth(),
    staleTime: 60_000,
    retry: 1,
  });
}
