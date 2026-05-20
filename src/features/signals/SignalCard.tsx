import type { Signal } from '@/types/signal'
import { Zap } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface SignalCardProps {
  signal: Signal
  compact?: boolean
  onClick?: () => void
}

function ScoreBadge({score}: { score: number }) {
  return (
      <span className="inline-flex items-center gap-[3px] text-[13px] font-bold text-accent">
      <Zap size={12} fill="var(--color-accent)" stroke="var(--color-accent)" />
        {score.toFixed(1)}
    </span>
  )
}

function KeywordTag({keyword}: { keyword: string }) {
  return (
    <span
      className="inline-block px-2 py-[2px] rounded-[20px] bg-accent-glow border border-[rgba(245,166,35,0.35)] text-accent text-[11px] font-semibold tracking-[0.01em]"
    >
      {keyword}
    </span>
  )
}

function CompactSignalCard({ signal, onClick }: { signal: Signal; onClick?: ()=> void }) {
  return (
      <div
        className={`bg-surface border border-border rounded-xl px-4 py-3 flex items-center justify-between gap-3 min-w-0 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <KeywordTag keyword={signal.keyword}/>
          <span
            className="text-[13px] font-semibold text-text-primary overflow-hidden text-ellipsis whitespace-nowrap"
            title={signal.title}
          >
            {signal.title}
          </span>
        </div>
        <div className="flex items-center gap-[10px] shrink-0">
          <ScoreBadge score={signal.score}/>
          <span className="text-[12px] text-text-muted">
            기사 {signal.relatedNewsCount}건
          </span>
        </div>
      </div>
  )
}

function FullSignalCard({ signal, onClick }: { signal: Signal; onClick?: ()=> void }) {
  return (
    <div
        className={`bg-surface border border-border rounded-xl px-6 py-5 flex flex-col gap-[14px] ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <KeywordTag keyword={signal.keyword}/>
          <span className="inline-block px-2 py-0.5 rounded-md bg-[rgba(243,243,243,0.08)] border border-border text-text-muted text-[11px] font-medium">
            {signal.eventTypeLabel}
          </span>
          <span className="inline-block px-2 py-0.5 rounded-md bg-[rgba(243,243,243,0.08)] border border-border text-text-muted text-[11px] font-medium">
            {signal.sentimentLabel}
          </span>
          <ScoreBadge score={signal.score}/>
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

      {signal.evidences.length > 0 && (
        <div className="border-t border-border pt-3 flex flex-col gap-[6px]">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em] mb-[2px]">
            근거 뉴스
          </span>
          {signal.evidences.map((ev) => (
            <a
              key={ev.newsId}
              href={ev.url ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-baseline gap-2 no-underline"
            >
              <span className="shrink-0 text-[12px] font-bold text-accent">
                {ev.rankOrder}.
              </span>
              <span className="text-[13px] text-text-primary leading-[1.4] transition-colors duration-150 hover:text-accent">
                {ev.title}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SignalCard({ signal, compact = false, onClick }: SignalCardProps) {
  if (compact) return <CompactSignalCard signal={signal} onClick={onClick}/>
  return <FullSignalCard signal={signal} onClick={onClick}/>
}