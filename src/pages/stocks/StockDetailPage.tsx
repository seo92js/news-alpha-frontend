import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import SignalCard from '@/features/signals/SignalCard'
import SignalDetailModal from '@/features/signals/SignalDetailModal'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import { useStocks } from '@/features/stocks/useStocks'
import { useKeywords } from '@/features/stocks/useKeywords'
import { useAddKeyword } from '@/features/stocks/useAddKeyword'
import { useDeleteKeyword } from '@/features/stocks/useDeleteKeyword'
import { useStockReport } from '@/features/stocks/useStockReport'
import { formatDate } from '@/lib/utils'

export default function StockDetailPage() {
  const { id } = useParams<{ id: string }>()
  const stockId = Number(id)
  const navigate = useNavigate()

  const { data: stocks = [], isLoading } = useStocks()
  const { data: keywords = [] } = useKeywords(stockId)
  const { mutate: addKeywordMutate } = useAddKeyword(stockId)
  const { mutate: deleteKeyword } = useDeleteKeyword(stockId)
  const { data: report } = useStockReport(stockId)

  const [signalsOpen, setSignalsOpen] = useState(true)
  const [selectedSignalId, setSelectedSignalId] = useState<number | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newKeyword, setNewKeyword] = useState('')
  const [keywordError, setKeywordError] = useState('')

  const stock = stocks.find((s) => s.id === stockId)

  useEffect(() => {
    if (!isLoading && !stock) {
      const timer = setTimeout(() => navigate('/'), 2000)
      return () => clearTimeout(timer)
    }
  }, [isLoading, stock])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <p className="text-center p-12 text-text-muted text-[14px]">불러오는 중...</p>
      </div>
    )
  }

  if (!stock) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <p className="text-center p-12 text-text-muted text-[14px]">존재하지 않는 종목입니다</p>
      </div>
    )
  }

  const relatedSignals = [...(report?.signals ?? [])].sort((a, b) => b.score - a.score)

  const handleToggleAdding = () => {
    setIsAdding((prev) => !prev)
    setNewKeyword('')
    setKeywordError('')
  }

  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim()
    if (!trimmed) {
      setKeywordError('키워드를 입력해주세요')
      return
    }
    if (keywords.some((kw) => kw.keyword.toLowerCase() === trimmed.toLowerCase())) {
      setKeywordError('이미 등록된 키워드입니다')
      return
    }

    setNewKeyword('')
    setKeywordError('')

    addKeywordMutate(
      { keyword: trimmed },
      {
        onSuccess: () => {
          setNewKeyword('')
          setIsAdding(false)
        },
        onError: () => {
          setKeywordError('키워드 추가에 실패했습니다')
        },
      }
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="max-w-[800px] mx-auto p-6">
        <section className="mb-8">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <h1 className="text-[26px] font-bold text-text-primary tracking-[-0.5px] mb-[6px]">
                {stock.name}
              </h1>
              <span className="text-[14px] text-text-muted">
                {stock.ticker} · {stock.market}
              </span>
            </div>
            <div className="flex flex-col gap-2 items-end w-3/5">
              <div className="flex items-center gap-3 pt-1">
                <h2 className="text-[16px] font-semibold text-text-primary">뉴스 수집 키워드</h2>
                {!isAdding && <Button size="sm" onClick={handleToggleAdding}>추가</Button>}
              </div>
              <div className="flex flex-wrap gap-2 justify-end">
                {keywords.length === 0 ? (
                  <p className="text-[14px] text-text-muted">등록된 키워드가 없습니다</p>
                ) : (
                  keywords.map((kw) => (
                    <span
                      key={kw.id}
                      className={`inline-flex items-center gap-1.5 text-[13px] font-medium px-[10px] py-1 rounded-md border ${kw.enabled ? 'border-accent text-accent bg-[rgba(245,166,35,0.08)]' : 'border-border text-text-muted bg-transparent opacity-50'}`}
                    >
                      {kw.keyword}
                      <button
                        onClick={() => deleteKeyword(kw.id)}
                        className="hover:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 size={11} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
          {isAdding && (
            <div className="flex gap-2 items-start mt-3">
              <div className="flex-1">
                <Input
                  placeholder="추가하려는 키워드 입력"
                  value={newKeyword}
                  onChange={(e) => {
                    setNewKeyword(e.currentTarget.value)
                    if (keywordError) setKeywordError('')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddKeyword()
                    if (e.key === 'Escape') handleToggleAdding()
                  }}
                  error={keywordError}
                  autoFocus
                />
              </div>
              <Button size="sm" onClick={handleAddKeyword} className={keywordError ? 'mt-[26px]' : ''}>
                추가
              </Button>
              <Button size="sm" variant="outline" onClick={handleToggleAdding} className={keywordError ? 'mt-[26px]' : ''}>
                취소
              </Button>
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-[16px] font-semibold text-text-primary mb-3">
            오늘의 리포트
          </h2>
          {report ? (
            <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-text-muted">{report.reportDate} 기준</span>
                <span className="text-[12px] text-text-muted">시그널 {report.signalCount}건 반영</span>
              </div>
              <p className="text-[14px] text-text-primary leading-[1.8] whitespace-pre-wrap">
                {report.report}
              </p>
              <span className="text-[11px] text-text-muted">{formatDate(report.generatedAt)} 생성</span>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-2xl p-6">
              <p className="text-[14px] text-text-muted text-center py-4">
                오늘 리포트가 아직 생성되지 않았습니다
              </p>
            </div>
          )}
        </section>

        <section className="mb-8">
          <div className={`flex items-center justify-between ${signalsOpen ? 'mb-3' : ''}`}>
            <h2 className="text-[16px] font-semibold text-text-primary">
              관련 시그널 {relatedSignals.length}건
            </h2>
            <button
              onClick={() => setSignalsOpen((prev) => !prev)}
              className="bg-none border border-border rounded-md text-text-muted text-[13px] px-[10px] py-1 cursor-pointer transition-colors duration-150 hover:text-text-primary hover:border-text-muted"
            >
              {signalsOpen ? '접기' : '펼치기'}
            </button>
          </div>

          {signalsOpen && (
            <div className="flex flex-col gap-3">
              {relatedSignals.length === 0 ? (
                <p className="text-[14px] text-text-muted text-center py-6">
                  관련 시그널이 없습니다
                </p>
              ) : (
                relatedSignals.map((signal) => (
                  <SignalCard
                      key={signal.signalId}
                      signal={signal}
                      onClick={() => setSelectedSignalId(signal.signalId)}
                  />
                ))
              )}
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