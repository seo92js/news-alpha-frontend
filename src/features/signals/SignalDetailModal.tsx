import { Zap } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Modal from '@/components/ui/modal'
import { useSignalDetail } from '@/features/signals/useSignalDetail'
import type { SignalEvidenceDetail } from '@/types/signal'

interface SignalDetailModalProps {
  isOpen: boolean
  onClose: () => void
  signalId: number | null
}

function Badge({ label }: { label: string }) {
  return (
      <span className="inline-block px-2 py-0.5 rounded-md bg-[rgba(243,243,243,0.08)] border border-border text-text-muted text-[11px] font-medium">
        {label}
      </span>
  )
}

function EvidenceItem({ evidence }: { evidence: SignalEvidenceDetail }) {
  return (

    <a
      href={evidence.url ?? undefined}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col gap-1 no-underline group"
    >
      <div className="flex items-baseline gap-2">
        <span className="shrink-0 w-4 h-4 rounded-full bg-accent-glow border border-[rgba(245,166,35,0.3)] text-[10px] font-bold text-accent inline-flex items-center justify-center leading-none">
          {evidence.rankOrder}
        </span>
        <span className="text-[13px] font-semibold text-text-primary leading-[1.4] group-hover:text-accent transition-colors duration-150">
          {evidence.title}
        </span>
      </div>
      {evidence.preview && (
        <p className="text-[12px] text-text-muted leading-[1.6] pl-6">
          {evidence.preview}
        </p>
      )}
      {evidence.publishedAt && (
        <span className="text-[11px] text-text-muted pl-6">
          {evidence.publishedAt}
        </span>
      )}
    </a>
  )
}

export default function SignalDetailModal({ isOpen, onClose, signalId }: SignalDetailModalProps) {
  const { data, isLoading } = useSignalDetail(signalId!)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="top-[72px] translate-y-0 max-h-[calc(100vh-88px)] flex flex-col gap-0 p-0 overflow-hidden sm:max-w-2xl"
    >
      {isLoading || !data ? (
        <p className="text-[14px] text-text-muted text-center py-6 px-6">불러오는 중...</p>
      ) : (
        <>
          {/* 고정 헤더 영역 */}
          <div className="flex flex-col gap-5 px-6 pt-6 pb-4 flex-shrink-0">
            <div className="flex flex-col gap-1.5">
              <span className="inline-block px-2 py-0.5 rounded-[20px] bg-accent-glow border border-[rgba(245,166,35,0.35)] text-accent text-[11px] font-semibold w-fit">
                {data.keyword}
              </span>
              <h2 className="text-[17px] font-bold text-text-primary leading-[1.4]">
                {data.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge label={data.eventTypeLabel} />
              <Badge label={data.sentimentLabel} />
              <span className="inline-flex items-center gap-1 text-[13px] font-bold text-accent">
                <Zap size={12} fill="var(--color-accent)" stroke="var(--color-accent)" />
                {data.score.toFixed(1)}
              </span>
              <span className="text-[12px] text-text-muted">신뢰도 {data.confidence}%</span>
              <span className="text-[12px] text-text-muted">기사 {data.relatedNewsCount}건</span>
            </div>

            <div className="bg-[rgba(243,243,243,0.04)] border border-border rounded-xl px-4 py-3">
              <p className="text-[13px] text-text-primary leading-[1.7]">
                {data.investorSummary}
              </p>
            </div>
          </div>

          {/* 스크롤 영역 - 근거 뉴스 */}
          {data.evidences.length > 0 && (
            <div className="overflow-y-auto flex-1 px-6 pb-4 border-t border-border">
              <span className="block text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em] pt-4 pb-3">
                근거 뉴스
              </span>
              <div className="flex flex-col gap-4">
                {data.evidences.map((ev) => (
                  <EvidenceItem key={ev.newsId} evidence={ev} />
                ))}
              </div>
            </div>
          )}

          <div className="px-6 py-3 flex-shrink-0 border-t border-border">
            <span className="text-[11px] text-text-muted">
              {formatDate(data.detectedAt)} 탐지
            </span>
          </div>
        </>
      )}
    </Modal>
  )
};