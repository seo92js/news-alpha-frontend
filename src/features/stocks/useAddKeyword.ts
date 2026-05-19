import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addKeyword } from '@/api/stocks'
import type { StockKeywordSaveRequest } from '@/types/stock'

export function useAddKeyword(stockId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: StockKeywordSaveRequest) => addKeyword(stockId, data),
    onSuccess: async() => {
      await queryClient.invalidateQueries({ queryKey: ['stocks', stockId, 'keywords'] })
    },
  })
}
