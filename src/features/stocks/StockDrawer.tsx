import { useNavigate } from 'react-router-dom'
import { useStocks } from '../../features/stocks/useStocks'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

interface StockDrawerProps {
  isOpen: boolean
  onClose: () => void
  onAddClick: () => void
}

export default function StockDrawer({ isOpen, onClose, onAddClick }: StockDrawerProps) {
  const navigate = useNavigate()
  const { data: stocks = [], isLoading } = useStocks()

  const handleStockClick = (id: number) => {
    onClose()
    navigate(`/stocks/${id}`)
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent side="right" className="w-[320px] sm:max-w-[320px] flex flex-col p-0" showCloseButton={false}>
        <SheetHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <SheetTitle className="text-lg font-bold">관심종목</SheetTitle>
              {stocks.length > 0 && (
                <span className="text-sm text-muted-foreground">{stocks.length}개</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Button size="sm" onClick={onAddClick}>추가</Button>
              <Button size="sm" variant="outline" className="border-white/20" onClick={onClose}>닫기</Button>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <p className="text-[14px] text-muted-foreground text-center mt-6">불러오는 중...</p>
          ) : stocks.length === 0 ? (
            <p className="text-[14px] text-muted-foreground text-center mt-6">등록된 종목이 없습니다</p>
          ) : (
            <div className="flex flex-col gap-2">
              {stocks.map(stock => (
                <div
                  key={stock.id}
                  onClick={() => handleStockClick(stock.id)}
                  className="flex items-center justify-between px-4 py-3 rounded-[10px] border border-border border-l-2 border-l-accent cursor-pointer transition-colors duration-150 hover:border-accent hover:border-l-accent"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-semibold text-text-primary">{stock.name}</span>
                    <span className="text-[11px] text-muted-foreground">{stock.ticker} · {stock.market}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0">등록된 키워드 {stock.keywords.length}개</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </SheetContent>
    </Sheet>
  )
}
