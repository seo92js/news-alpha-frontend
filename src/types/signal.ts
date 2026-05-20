export interface SignalEvidence {
  newsId: number
  rankOrder: number
  title: string
  url: string | null
  publishedAt: string | null
}

export interface SignalEvidenceDetail {
  newsId: number
  rankOrder: number
  title: string
  url: string | null
  publishedAt: string | null
  preview: string | null
}

export interface SignalBase {
  id: number
  keyword: string
  title: string
  summary: string
  eventTypeLabel: string
  sentimentLabel: string
  confidence: number
  investorSummary: string
  score: number
  relatedNewsCount: number
  firstPublishedAt: string | null
  lastPublishedAt: string | null
  detectedAt: string
}

export interface Signal extends SignalBase {
  evidences: SignalEvidence[]
}

export interface SignalDetail extends SignalBase {
  evidences: SignalEvidenceDetail[]
}