import type { StockSignalSummary } from '@/types/stock'
import { Zap } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface SignalCardProps {
  signal: StockSignalSummary
  onClick?: () => void
}

function ScoreBadge({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-[3px] text-[13px] font-bold text-accent">
      <Zap size={12} fill="var(--color-accent)" stroke="var(--color-accent)" />
      {score.toFixed(1)}
    </span>
  )
}

export default function SignalCard({ signal, onClick }: SignalCardProps) {
  return (
    <div
      className={`bg-surface border border-border rounded-xl px-6 py-5 flex flex-col gap-[14px] ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-block px-2 py-0.5 rounded-md bg-[rgba(243,243,243,0.08)] border border-border text-text-muted text-[11px] font-medium">
            {signal.eventTypeLabel}
          </span>
          <span className="inline-block px-2 py-0.5 rounded-md bg-[rgba(243,243,243,0.08)] border border-border text-text-muted text-[11px] font-medium">
            {signal.sentimentLabel}
          </span>
          <ScoreBadge score={signal.score} />
          <span className="text-[12px] text-text-muted">신뢰도 {signal.confidence}%</span>
          <span className="text-[12px] text-text-muted">기사 {signal.relatedNewsCount}건</span>
        </div>
        <span className="text-[11px] text-text-muted shrink-0">
          {formatDate(signal.detectedAt)} 탐지
        </span>
      </div>

      <p className="text-[15px] font-bold text-text-primary leading-[1.45]">
        {signal.title}
      </p>

      <p className="text-[13px] text-text-muted leading-[1.65]">
        {signal.investorSummary}
      </p>
    </div>
  )
}
