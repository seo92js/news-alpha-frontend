import { useQuery } from '@tanstack/react-query'
import { fetchSignalDetail } from '@/api/signals'

export function useSignalDetail(signalId: number | null) {
  return useQuery({
    queryKey: ['signals', signalId],
    queryFn: () => fetchSignalDetail(signalId!),
    enabled: signalId !== null,
    staleTime: 60 * 1000,
  })
}
