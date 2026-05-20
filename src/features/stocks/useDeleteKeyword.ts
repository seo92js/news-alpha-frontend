import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteStockKeyword } from '@/api/stocks'

export function useDeleteKeyword(stockId:number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (keywordId: number) => deleteStockKeyword(stockId, keywordId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey : ['stocks', stockId, 'keywords'] }),
        queryClient.invalidateQueries({ queryKey : ['stocks'] })
      ])
    }
  })
}
