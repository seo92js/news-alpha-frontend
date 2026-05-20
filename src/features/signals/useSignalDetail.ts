import { useQuery } from '@tanstack/react-query'
import { fetchSignalDetail } from '@/api/signals'

export function useSignalDetail(signalId: number) {
  return useQuery({
    queryKey: ['signals', signalId],
    queryFn: () => fetchSignalDetail(signalId),
    staleTime: 60 * 1000,
  })
}
