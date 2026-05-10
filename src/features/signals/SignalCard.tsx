import type {Signal} from '../../types/signal'

interface SignalCardProps {
  signal: Signal
  compact?: boolean
}

function formatDetectedAt(iso: string): string {
  const d = new Date(iso)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${month}월 ${day}일 ${hh}:${mm}`
}

function ScoreBadge({score}: { score: number }) {
  return (
      <span className="inline-flex items-center gap-[3px] text-[13px] font-bold text-accent">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="var(--color-accent)"
        aria-hidden="true"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
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

function CompactSignalCard({signal}: { signal: Signal }) {
  return (
      <div
        className="bg-surface border border-border rounded-xl px-4 py-3 flex items-center justify-between gap-3 min-w-0">
        <span
          className="text-[13px] font-semibold text-text-primary overflow-hidden text-ellipsis whitespace-nowrap flex-1"
          title={signal.title}
        >
          {signal.title}
        </span>
        <div className="flex items-center gap-[10px] shrink-0">
          <ScoreBadge score={signal.score}/>
          <span className="text-[12px] text-text-muted">
            기사 {signal.relatedNewsCount}건
          </span>
        </div>
      </div>
  )
}

function FullSignalCard({signal}: { signal: Signal }) {
  return (
    <div className="bg-surface border border-border rounded-xl px-6 py-5 flex flex-col gap-[14px]">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <KeywordTag keyword={signal.keyword}/>
        <span className="text-[11px] text-text-muted">
          {formatDetectedAt(signal.detectedAt)} 탐지
        </span>
      </div>

      <p className="text-[15px] font-bold text-text-primary leading-[1.45]">
        {signal.title}
      </p>

      <p className="text-[13px] text-text-muted leading-[1.65]">
        {signal.summary}
      </p>

      <div className="flex items-center gap-[14px]">
        <ScoreBadge score={signal.score}/>
        <span className="text-[12px] text-text-muted">
          기사 {signal.relatedNewsCount}건
        </span>
      </div>

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
              <span className="shrink-0 w-4 h-4 rounded-full bg-accent-glow border border-[rgba(245,166,35,0.3)] text-[10px] font-bold text-accent inline-flex items-center justify-center leading-none">
                {ev.rankOrder}
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

export default function SignalCard({signal, compact = false}: SignalCardProps) {
  if (compact) return <CompactSignalCard signal={signal}/>
  return <FullSignalCard signal={signal}/>
}