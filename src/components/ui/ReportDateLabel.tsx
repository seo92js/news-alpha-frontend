import { Calendar } from 'lucide-react'

interface ReportDateLabelProps {
  date: string
  onDateChange?: (date: string) => void
}

function formatReportDate(dateStr: string): string {
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  const year = parts[0]
  const month = String(Number(parts[1]))
  const day = String(Number(parts[2]))
  return `${year}년 ${month}월 ${day}일 리포트`
}

export default function ReportDateLabel({ date }: ReportDateLabelProps) {
  return (
    <span className="inline-flex items-center gap-[5px] text-[13px] text-text-muted select-none">
      <Calendar size={14} stroke="var(--color-accent)" />
      <span className="text-accent font-medium">
        {formatReportDate(date)}
      </span>
    </span>
  )
}
