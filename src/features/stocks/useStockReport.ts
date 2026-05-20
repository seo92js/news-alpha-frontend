import { useQuery } from '@tanstack/react-query'
import { fetchLatestReport } from '@/api/stocks'

export function useStockReport(stockId: number) {
  return useQuery({
    queryKey: ['stocks', stockId, 'report', 'latest'],
    queryFn: () => fetchLatestReport(stockId),
    enabled: !!stockId,
    retry: 1,
    staleTime: 60 * 60 * 1000,
  })
}