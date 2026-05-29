import { useQuery } from '@tanstack/react-query'
import { fetchLatestReports } from '@/api/stocks'

export function useLatestReports() {
  return useQuery({
    queryKey: ['stocks', 'reports', 'latest'],
    queryFn: fetchLatestReports,
    staleTime: 60 * 60 * 1000,
  })
}
