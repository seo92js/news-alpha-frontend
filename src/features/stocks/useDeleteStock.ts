import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteStock } from '@/api/stocks'

export function useDeleteStock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (stockId: number) => deleteStock(stockId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['stocks'] }),
        queryClient.invalidateQueries({ queryKey: ['signals'] }),
      ])
    },
  })
}
