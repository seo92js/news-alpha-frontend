import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/layout/Navbar'
import SignalCard from '../../features/signals/SignalCard'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useStocks } from '../../features/stocks/useStocks'
import { useSignals } from '../../features/signals/useSignals'
import { useAddKeyword } from '../../features/stocks/useAddKeyword'
import type { StockKeyword } from '../../types/stock'

export default function StockDetailPage() {
  const { id } = useParams<{ id: string }>()
  const stockId = Number(id)

  const { data: stocks = [], isLoading } = useStocks()
  const { data: signals = [] } = useSignals()
  const { mutate: addKeywordMutate } = useAddKeyword(stockId)

  const [signalsOpen, setSignalsOpen] = useState(false)
  const [addedKeywords, setAddedKeywords] = useState<StockKeyword[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newKeyword, setNewKeyword] = useState('')
  const [keywordError, setKeywordError] = useState('')

  const stock = stocks.find((s) => s.id === stockId)

  useEffect(() => {
    setAddedKeywords([])
  }, [stockId])

  if (isLoading || !stock) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar />
        <p className="text-center p-12 text-text-muted text-[14px]">불러오는 중...</p>
      </div>
    )
  }

  const keywords = [...stock.keywords, ...addedKeywords]
  const relatedSignals = signals.filter(signal =>
    stock.keywords.some(kw => kw.keyword === signal.keyword)
  )

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

    const optimistic: StockKeyword = {
      id: Date.now(),
      stockId,
      keyword: trimmed,
      enabled: true,
      createdAt: new Date().toISOString(),
    }
    setAddedKeywords((prev) => [...prev, optimistic])
    setNewKeyword('')
    setKeywordError('')

    addKeywordMutate(
      { keyword: trimmed },
      {
        onSuccess: () => { setAddedKeywords([]) },
        onError: () => {
          setAddedKeywords((prev) => prev.filter((kw) => kw.id !== optimistic.id))
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
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-[16px] font-semibold text-text-primary mb-3">
            오늘의 리포트
          </h2>
          <div className="bg-surface border border-border rounded-2xl p-6">
            <p className="text-[14px] text-text-muted text-center py-4">
              오늘 리포트가 아직 생성되지 않았습니다
            </p>
          </div>
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
                      <SignalCard key={signal.id} signal={signal} compact={false} />
                    ))
                )}
              </div>
          )}
        </section>

        <section>
          <h2 className="text-[16px] font-semibold text-text-primary mb-3">
            뉴스 수집 키워드
          </h2>

          <div className="flex flex-wrap gap-2 mb-3">
            {keywords.length === 0 ? (
                <p className="text-[14px] text-text-muted">등록된 키워드가 없습니다</p>
            ) : (
                keywords.map((kw) => (
                  <span
                    key={kw.id}
                    className={`inline-flex items-center text-[13px] font-medium px-[10px] py-1 rounded-md border ${kw.enabled ? 'border-accent text-accent bg-[rgba(245,166,35,0.08)]' : 'border-border text-text-muted bg-transparent opacity-50'}`}
                  >
                    {kw.keyword}
                  </span>
                ))
            )}
          </div>

          {isAdding ? (
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <Input
                    placeholder="새 키워드 입력"
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
                <Button size="sm" variant="secondary" onClick={handleToggleAdding} className={keywordError ? 'mt-[26px]' : ''}>
                  취소
                </Button>
              </div>
          ) : (
              <button
                onClick={handleToggleAdding}
                className="bg-none border border-border rounded-md text-text-muted text-[13px] px-3 py-1 cursor-pointer transition-colors duration-150 hover:text-text-primary hover:border-text-muted"
              >
                + 키워드 추가
              </button>
          )}
        </section>
      </main>
    </div>
  )
}