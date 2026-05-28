import api from '@/api/axios'
import type {
    Stock,
    StockKeyword,
    StockMeta,
    StockSaveRequest,
    StockKeywordSaveRequest,
    StockLatestReport
} from '@/types/stock'

export const fetchStocks = (): Promise<Stock[]> =>
  api.get<Stock[]>('/stocks').then(r => r.data)

export const fetchStockMeta = (): Promise<StockMeta[]> =>
  api.get<StockMeta[]>('/stocks/meta').then(r => r.data)

export const addStock = (data: StockSaveRequest): Promise<Stock> =>
  api.post<Stock>('/stocks', data).then(r => r.data)

export const addKeyword = (stockId: number, data: StockKeywordSaveRequest): Promise<StockKeyword> =>
  api.post<StockKeyword>(`/stocks/${stockId}/keywords`, data).then(r => r.data)

export const fetchKeywords = (stockId: number) : Promise<StockKeyword[]> =>
    api.get<StockKeyword[]>(`/stocks/${stockId}/keywords`).then(r => r.data)

export const fetchLatestReport = (stockId: number) : Promise<StockLatestReport> =>
    api.get<StockLatestReport>(`/stocks/${stockId}/report/latest`).then(r => r.data)

export const deleteStock = (stockId: number) : Promise<void> =>
    api.delete<void>(`/stocks/${stockId}`).then(r => r.data)

export const deleteStockKeyword = (stockId: number, keywordId: number) : Promise<void> =>
    api.delete<void>(`/stocks/${stockId}/keywords/${keywordId}`).then(r => r.data)

export const fetchLatestReports = (): Promise<StockLatestReport[]> =>
    api.get<StockLatestReport[]>('/stocks/reports/latest').then(r => r.data)
