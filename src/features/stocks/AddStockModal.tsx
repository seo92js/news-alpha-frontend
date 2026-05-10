import React, { useState, useRef } from 'react'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { useAddStock } from './useAddStock'
import { useAddKeyword } from './useAddKeyword'
import { useStocks } from './useStocks'
import { useStockMeta } from './useStockMeta'
import type { Stock, StockMeta } from '../../types/stock'

interface AddStockModalProps {
  isOpen: boolean
  onClose: () => void
}

type Tab = 'stock' | 'keyword'

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

export default function AddStockModal({ isOpen, onClose }: AddStockModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('stock')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<StockMeta | null>(null)
  const [suggestions, setSuggestions] = useState<StockMeta[]>([])
  const [highlightIdx, setHighlightIdx] = useState(-1)
  const [stockError, setStockError] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<StockMeta[]>([])

  const [selectedStockId, setSelectedStockId] = useState<number | null>(null)
  const [keyword, setKeyword] = useState('')
  const [keywordError, setKeywordError] = useState('')

  const { data: stocks = [] } = useStocks()
  const { data: metaList = [] } = useStockMeta(isOpen)
  metaRef.current = metaList
  const { mutate: addStock, isPending: isAddingStock } = useAddStock()
  const { mutate: addKeyword, isPending: isAddingKeyword } = useAddKeyword(selectedStockId ?? 0)

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestions.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIdx(i => Math.min(i + 1, suggestions.length - 1))
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIdx(i => Math.max(i - 1, -1))
    }
    else if (e.key === 'Enter' && highlightIdx >= 0) {
      e.preventDefault()
      handleSelect(suggestions[highlightIdx])
    }
    else if (e.key === 'Escape') {
      setSuggestions([])
    }
  }

  const handleClose = () => {
    setQuery('')
    setSelected(null)
    setSuggestions([])
    setStockError('')
    setSelectedStockId(null)
    setKeyword('')
    setKeywordError('')
    onClose()
  }

  const handleAddStock = () => {
    if (!selected) return setStockError('종목을 선택해주세요')
    addStock(
      { ticker: selected.ticker, name: selected.name, market: selected.market },
      {
        onSuccess: () => handleClose(),
        onError: () => setStockError('이미 등록된 종목이거나 추가에 실패했습니다'),
      }
    )
  }

  const handleAddKeyword = () => {
    if (!selectedStockId) return setKeywordError('종목을 선택해주세요')
    if (!keyword.trim()) return setKeywordError('키워드를 입력해주세요')
    addKeyword(
      { keyword: keyword.trim() },
      {
        onSuccess: () => handleClose(),
        onError: () => setKeywordError('키워드 추가에 실패했습니다'),
      }
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="추가">
      <div className="flex mb-2">
        <button
          onClick={() => setActiveTab('stock')}
          className={`flex-1 py-2 border-none bg-none text-[14px] cursor-pointer border-b-2 ${activeTab === 'stock' ? 'border-accent text-accent font-bold' : 'border-border text-text-muted font-normal'}`}
        >
          종목 추가
        </button>
        <button
          onClick={() => setActiveTab('keyword')}
          className={`flex-1 py-2 border-none bg-none text-[14px] cursor-pointer border-b-2 ${activeTab === 'keyword' ? 'border-accent text-accent font-bold' : 'border-border text-text-muted font-normal'}`}
        >
          키워드 추가
        </button>
      </div>

      {activeTab === 'stock' && (
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Input
                value={query}
                onChange={e => handleQueryChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="종목명 또는 종목코드를 입력하세요"
                autoComplete="off"
              />
              {suggestions.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute top-[calc(100%+4px)] left-0 right-0 bg-surface border border-border rounded-[10px] overflow-hidden z-[200] shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                >
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
                      <span className="text-[11px] text-text-muted bg-[rgba(243,243,243,0.08)] border border-border rounded px-[5px] py-[1px]">
                        {item.market}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selected && (
                <div className="flex items-center gap-2 px-[14px] py-[10px] bg-[rgba(245,166,35,0.08)] border border-[rgba(245,166,35,0.3)] rounded-lg">
                  <span className="text-[13px] text-accent font-semibold">✓</span>
                  <span className="text-[14px] text-text-primary font-semibold">{selected.name}</span>
                  <span className="text-[12px] text-text-muted">{selected.ticker}</span>
                  <span className="text-[11px] text-text-muted bg-[rgba(243,243,243,0.08)] border border-border rounded px-[5px] py-[1px] ml-auto">
                    {selected.market}
                  </span>
                </div>
            )}

            {stockError && <p className="text-error text-[13px]">{stockError}</p>}
            <Button onClick={handleAddStock} loading={isAddingStock} fullWidth>추가</Button>
          </div>
      )}

      {activeTab === 'keyword' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] text-text-muted">종목 선택</label>
              <select
                value={selectedStockId ?? ''}
                onChange={e => setSelectedStockId(Number(e.target.value))}
                className="bg-surface border border-border rounded-lg text-text-primary text-[14px] px-3 py-[10px]"
              >
                <option value="">종목을 선택하세요</option>
                {stocks.map((stock: Stock) => (
                  <option key={stock.id} value={stock.id}>{stock.name} ({stock.ticker})</option>
                ))}
              </select>
            </div>
            <Input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="키워드를 입력하세요" />
            {keywordError && <p className="text-error text-[13px]">{keywordError}</p>}
            <Button onClick={handleAddKeyword} loading={isAddingKeyword} fullWidth>추가</Button>
          </div>
      )}
    </Modal>
  )
}