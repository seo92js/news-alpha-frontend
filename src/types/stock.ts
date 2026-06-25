export interface StockMeta {
  ticker: string
  name: string
  market: string
}

export interface StockKeyword {
  id: number
  stockId: number
  keyword: string
  enabled: boolean
  createdAt: string
}

export interface Stock {
  id: number
  ticker: string
  name: string
  market: string
  createdAt: string
  keywords: StockKeyword[]
}

export interface StockSaveRequest {
  ticker: string
  name: string
  market: string
}

export interface StockSignalSummary {
  signalId: number
  title: string
  summary: string
  eventTypeLabel: string
  sentimentLabel: string
  confidence: number
  investorSummary: string
  score: number
  relatedNewsCount: number
  detectedAt: string
}

export interface StockLatestReport {
  stockId: number
  stockName: string
  ticker: string
  market: string
  reportDate: string
  signalCount: number
  report: string
  generatedAt: string
  signals: StockSignalSummary[]
}
