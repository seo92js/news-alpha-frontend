import { useNavigate } from 'react-router-dom'
import type { Stock } from '../../types/stock'
import type { StockReport } from '../../types/report'
import ReportDateLabel from '../../components/ui/ReportDateLabel'

interface StockCardProps {
  stock: Stock
  report?: StockReport
}

export default function StockCard({ stock, report }: StockCardProps) {
  const navigate = useNavigate()

  const summary = report
    ? report.report.slice(0, 90) + (report.report.length > 90 ? '…' : '')
    : null

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/stocks/${stock.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') navigate(`/stocks/${stock.id}`)
      }}
      className="bg-surface border border-border hover:border-accent rounded-xl p-5 cursor-pointer transition-colors duration-150 outline-none"
    >
      <div className="flex items-center justify-between mb-3 gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <span className="text-[16px] font-bold text-text-primary tracking-[-0.3px] shrink-0">
            {stock.name}
          </span>
          <span className="text-[13px] text-text-muted shrink-0">
            {stock.ticker}
          </span>
          <span className="text-[11px] font-semibold text-text-muted bg-[rgba(243,243,243,0.08)] border border-border rounded px-[6px] py-[1px] tracking-[0.3px] shrink-0">
            {stock.market}
          </span>
        </div>

        {report && (
            <span className="text-[12px] font-bold text-bg bg-accent rounded-[20px] px-[10px] py-[2px] shrink-0">
              시그널 {report.signalCount}
            </span>
        )}
      </div>

      <p className={`text-[13px] leading-[1.6] mb-[14px] line-clamp-2 ${report ? 'text-text-muted' : 'text-[rgba(243,243,243,0.3)] italic'}`}>
        {summary ?? '리포트 생성 대기중'}
      </p>

      <div className="flex items-center justify-between">
        {report ? (
            <ReportDateLabel date={report.reportDate} />
        ) : (
            <span className="text-[12px] text-[rgba(243,243,243,0.25)]">-</span>
        )}
        <span className="text-[13px] font-semibold text-accent hover:text-accent-hover transition-colors duration-150">
          자세히 보기 →
        </span>
      </div>
    </div>
  )
}