import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useStocks } from '@/features/stocks/useStocks'
import { useStockMeta } from '@/features/stocks/useStockMeta'
import { useAddStock } from '@/features/stocks/useAddStock'
import { useAddKeyword } from '@/features/stocks/useAddKeyword'
import { useDeleteStock } from '@/features/stocks/useDeleteStock'
import { useDeleteKeyword } from '@/features/stocks/useDeleteKeyword'
import { useKeywords } from '@/features/stocks/useKeywords'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import type { StockMeta } from '@/types/stock'

type Tab = 'stocks' | 'keywords'

const AUTOCOMPLETE_LIMIT = 8

function normalize(str: string) {
  return str.replace(/\s/g, '').toLowerCase()
}

function filterMeta(list: StockMeta[], query: string): StockMeta[] {
  if (!query.trim()) return []
  const q = normalize(query)
  return list
    .filter(item => normalize(item.name).includes(q) || normalize(item.ticker).includes(q))
    .slice(0, AUTOCOMPLETE_LIMIT)
}

interface StockDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function StockDrawer({ isOpen, onClose }: StockDrawerProps) {
  const navigate = useNavigate()
  const { data: stocks = [], isLoading } = useStocks()
  const { data: metaList = [] } = useStockMeta(isOpen)
  const { mutate: addStock, isPending: isStockPending } = useAddStock()

  const [activeTab, setActiveTab] = useState<Tab>('stocks')

  // 종목 추가 상태
  const [stockFormOpen, setStockFormOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<StockMeta | null>(null)
  const [suggestions, setSuggestions] = useState<StockMeta[]>([])
  const [highlightIdx, setHighlightIdx] = useState(-1)
  const [stockError, setStockError] = useState('')
  const metaRef = useRef<StockMeta[]>([])
  metaRef.current = metaList

  // 키워드 관리 상태
  const [selectedStockId, setSelectedStockId] = useState<number | null>(null)
  const [keywordFormOpen, setKeywordFormOpen] = useState(false)
  const [newKeyword, setNewKeyword] = useState('')
  const [keywordError, setKeywordError] = useState('')
  const { mutate: addKeyword, isPending: isKeywordPending } = useAddKeyword(selectedStockId ?? 0)
  const { mutate: deleteKeyword } = useDeleteKeyword(selectedStockId ?? 0)
  const { mutate: deleteStock } = useDeleteStock()
  const { data: selectedStockKeywords = [] } = useKeywords(selectedStockId ?? 0)

  const selectedStock = stocks.find((s) => s.id === selectedStockId)

  const handleStockClick = (id: number) => {
    onClose()
    navigate(`/stocks/${id}`)
  }

  // 종목 자동완성
  const handleSelect = (item: StockMeta) => {
    setSelected(item)
    setQuery(`${item.name} (${item.ticker})`)
    setSuggestions([])
    setStockError('')
  }

  const handleQueryChange = (value: string) => {
    setQuery(value)
    setSelected(null)
    setSuggestions(filterMeta(metaRef.current, value))
    setHighlightIdx(-1)
  }

  const handleQueryKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestions.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIdx(i => Math.min(i + 1, suggestions.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIdx(i => Math.max(i - 1, -1)) }
    else if (e.key === 'Enter' && highlightIdx >= 0) { e.preventDefault(); handleSelect(suggestions[highlightIdx]) }
    else if (e.key === 'Escape') { setSuggestions([]) }
  }

  const handleAddStock = () => {
    if (!selected) return setStockError('종목을 선택해주세요')
    addStock(
      { ticker: selected.ticker, name: selected.name, market: selected.market },
      {
        onSuccess: () => {
          setQuery(''); setSelected(null); setSuggestions([]); setStockError(''); setStockFormOpen(false)
        },
        onError: () => setStockError('이미 등록된 종목이거나 추가에 실패했습니다'),
      }
    )
  }

  // 키워드 추가
  const handleAddKeyword = () => {
    const trimmed = newKeyword.trim()
    if (!trimmed) return setKeywordError('키워드를 입력해주세요')
    if (selectedStockKeywords.some((kw) => kw.keyword.toLowerCase() === trimmed.toLowerCase())) {
      return setKeywordError('이미 등록된 키워드입니다')
    }
    addKeyword(
      { keyword: trimmed },
      {
        onSuccess: () => { setNewKeyword(''); setKeywordFormOpen(false); setKeywordError('') },
        onError: () => setKeywordError('키워드 추가에 실패했습니다'),
      }
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent side="right" className="w-[320px] sm:max-w-[320px] flex flex-col p-0" showCloseButton={false}>
        <SheetHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-bold">관심종목</SheetTitle>
            <Button size="sm" variant="outline" className="border-white/20" onClick={onClose}>닫기</Button>
          </div>
        </SheetHeader>

        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('stocks')}
            className={`flex-1 py-2.5 text-[13px] font-medium transition-colors cursor-pointer ${activeTab === 'stocks' ? 'text-text-primary border-b-2 border-accent' : 'text-text-muted hover:text-text-primary'}`}
          >
            종목 관리
          </button>
          <button
            onClick={() => setActiveTab('keywords')}
            className={`flex-1 py-2.5 text-[13px] font-medium transition-colors cursor-pointer ${activeTab === 'keywords' ? 'text-text-primary border-b-2 border-accent' : 'text-text-muted hover:text-text-primary'}`}
          >
            키워드 관리
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <p className="text-[14px] text-muted-foreground text-center mt-6">불러오는 중...</p>
          ) : activeTab === 'stocks' ? (
            <div className="flex flex-col gap-3">
              <div className="flex justify-end">
                <Button size="sm" onClick={() => { setStockFormOpen(p => !p); setQuery(''); setSelected(null); setSuggestions([]); setStockError('') }}>
                  {stockFormOpen ? '취소' : '종목 추가'}
                </Button>
              </div>

              {stockFormOpen && (
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Input
                      value={query}
                      onChange={e => handleQueryChange(e.target.value)}
                      onKeyDown={handleQueryKeyDown}
                      placeholder="종목명 또는 종목코드"
                      autoComplete="off"
                      autoFocus
                      error={stockError}
                    />
                    {suggestions.length > 0 && (
                      <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-surface border border-border rounded-[10px] overflow-hidden z-[200] shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
                        {suggestions.map((item, idx) => (
                          <div
                            key={item.ticker}
                            onMouseDown={() => handleSelect(item)}
                            onMouseEnter={() => setHighlightIdx(idx)}
                            onMouseLeave={() => setHighlightIdx(-1)}
                            className={`flex items-center gap-[10px] px-[14px] py-[10px] cursor-pointer ${highlightIdx === idx ? 'bg-[rgba(245,166,35,0.10)]' : 'bg-transparent'} ${idx < suggestions.length - 1 ? 'border-b border-border' : ''}`}
                          >
                            <span className="text-[14px] font-semibold text-text-primary flex-1">{item.name}</span>
                            <span className="text-[12px] text-text-muted">{item.ticker}</span>
                            <span className="text-[11px] text-text-muted bg-[rgba(243,243,243,0.08)] border border-border rounded px-[5px] py-[1px]">{item.market}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {selected && (
                    <div className="flex items-center gap-2 px-[14px] py-[10px] bg-[rgba(245,166,35,0.08)] border border-[rgba(245,166,35,0.3)] rounded-lg">
                      <span className="text-[13px] text-accent font-semibold">✓</span>
                      <span className="text-[14px] text-text-primary font-semibold">{selected.name}</span>
                      <span className="text-[12px] text-text-muted ml-auto">{selected.market}</span>
                    </div>
                  )}
                  <Button onClick={handleAddStock} loading={isStockPending} fullWidth>추가</Button>
                </div>
              )}

              {stocks.length === 0 ? (
                <p className="text-[14px] text-muted-foreground text-center mt-4">등록된 종목이 없습니다</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {stocks.map((stock) => (
                    <div
                      key={stock.id}
                      onClick={() => handleStockClick(stock.id)}
                      className="flex items-center justify-between px-4 py-3 rounded-[10px] border border-border border-l-2 border-l-accent cursor-pointer transition-colors duration-150 hover:border-accent hover:border-l-accent"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[15px] font-semibold text-text-primary">{stock.name}</span>
                        <span className="text-[11px] text-muted-foreground">{stock.ticker} · {stock.market}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-muted-foreground">키워드 {stock.keywords.length}개</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteStock(stock.id, { onSuccess: () => navigate('/') }) }}
                          className="text-text-muted hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {stocks.length === 0 ? (
                <p className="text-[14px] text-muted-foreground text-center mt-6">등록된 종목이 없습니다</p>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    {stocks.map((stock) => (
                      <button
                        key={stock.id}
                        onClick={() => { setSelectedStockId(stock.id); setKeywordFormOpen(false); setNewKeyword(''); setKeywordError('') }}
                        className={`text-left px-4 py-2.5 rounded-[10px] border text-[14px] font-medium transition-colors cursor-pointer ${selectedStockId === stock.id ? 'border-accent text-accent bg-[rgba(245,166,35,0.08)]' : 'border-border text-text-primary hover:border-text-muted'}`}
                      >
                        {stock.name}
                      </button>
                    ))}
                  </div>

                  {selectedStock && (
                    <div className="mt-2 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-text-muted uppercase tracking-[0.06em]">
                          {selectedStock.name} 키워드
                        </span>
                        <Button size="sm" onClick={() => { setKeywordFormOpen(p => !p); setNewKeyword(''); setKeywordError('') }}>
                          {keywordFormOpen ? '취소' : '키워드 추가'}
                        </Button>
                      </div>

                      {keywordFormOpen && (
                        <div className="flex gap-2 items-start">
                          <div className="flex-1">
                            <Input
                              placeholder="키워드 입력"
                              value={newKeyword}
                              onChange={e => { setNewKeyword(e.target.value); if (keywordError) setKeywordError('') }}
                              onKeyDown={e => { if (e.key === 'Enter') handleAddKeyword(); if (e.key === 'Escape') setKeywordFormOpen(false) }}
                              error={keywordError}
                              autoFocus
                            />
                          </div>
                          <Button size="sm" onClick={handleAddKeyword} loading={isKeywordPending} className={keywordError ? 'mt-[26px]' : ''}>
                            추가
                          </Button>
                        </div>
                      )}

                      {selectedStockKeywords.length === 0 ? (
                        <p className="text-[14px] text-muted-foreground">등록된 키워드가 없습니다</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {selectedStockKeywords.map((kw) => (
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
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
