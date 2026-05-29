import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import SignalCard from '@/features/signals/SignalCard'
import SignalDetailModal from '@/features/signals/SignalDetailModal'
import { useLatestReports } from '@/features/stocks/useLatestReports'
import { formatSmartDate } from '@/lib/utils'
import type { StockLatestReport } from '@/types/stock'

function StockReportCard({ report, onSignalClick }: { report: StockLatestReport; onSignalClick: (id: number) => void }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between gap-2 px-6 py-4 cursor-pointer"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold text-text-primary">{report.stockName}</span>
          <span className="text-[12px] text-text-muted">{report.ticker}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] text-text-muted">리포트 작성 : {formatSmartDate(report.generatedAt)}</span>
          <span className="text-[11px] text-text-muted">{isOpen ? '접기' : '펼치기'}</span>
        </div>
      </div>

      {isOpen && (
        <div className="px-6 pb-5 flex flex-col gap-4 border-t border-border pt-4">
          <p className="text-[13px] text-text-muted leading-[1.7] whitespace-pre-wrap">
            {report.report}
          </p>

          {report.signals.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em]">
                관련 시그널 {report.signalCount}건
              </span>
              {report.signals.map((signal) => (
                <SignalCard
                  key={signal.signalId}
                  signal={signal}
                  onClick={() => onSignalClick(signal.signalId)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  const { data: reports = [], isLoading } = useLatestReports()
  const [selectedSignalId, setSelectedSignalId] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="max-w-[800px] mx-auto p-6 animate-[fadeInUp_300ms_ease-out]">
        <section className="mb-8">
          <div className="flex items-center gap-[10px] mb-[14px]">
            <h2 className="text-[16px] font-bold text-text-primary">
              오늘의 리포트
            </h2>
            <span className="text-[12px] font-bold text-accent bg-[rgba(245,166,35,0.12)] rounded-[20px] px-[10px] py-[2px]">
              {isLoading ? '-' : reports.length}
            </span>
          </div>

          {isLoading ? (
            <p className="text-[14px] text-text-muted">불러오는 중...</p>
          ) : reports.length === 0 ? (
            <p className="text-[14px] text-text-muted">오늘 생성된 리포트가 없습니다</p>
          ) : (
            <div className="flex flex-col gap-4">
              {reports.map((report) => (
                <StockReportCard
                  key={report.stockId}
                  report={report}
                  onSignalClick={setSelectedSignalId}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <SignalDetailModal
        isOpen={selectedSignalId !== null}
        onClose={() => setSelectedSignalId(null)}
        signalId={selectedSignalId}
      />
    </div>
  )
}
