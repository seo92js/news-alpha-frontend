import { useQuery } from '@tanstack/react-query'
import { fetchKeywords } from '@/api/stocks'

export function useKeywords(stockId: number) {
  return useQuery({
    queryKey: ['stocks', stockId, 'keywords'],
    queryFn: () => fetchKeywords(stockId),
    enabled: !!stockId,
    staleTime: 60 * 1000,
  })
}