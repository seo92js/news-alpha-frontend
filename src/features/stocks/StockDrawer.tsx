import { useNavigate } from 'react-router-dom'
import { useStocks } from '../../features/stocks/useStocks'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
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
      <SheetContent side="right" className="w-[320px] sm:max-w-[320px] flex flex-col p-0">
        <SheetHeader className="px-6 py-5 border-b border-border">
          <SheetTitle>관심종목</SheetTitle>
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
                  className="flex items-center justify-between px-4 py-3 rounded-[10px] border border-border cursor-pointer transition-colors duration-150 hover:border-accent"
                >
                  <div>
                    <span className="text-[14px] font-semibold text-text-primary">{stock.name}</span>
                    <span className="text-[12px] text-muted-foreground ml-2">{stock.ticker}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground border border-border rounded px-[5px] py-[1px]">
                    {stock.market}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <SheetFooter className="px-6 py-4 border-t border-border">
          <Button onClick={onAddClick} fullWidth>추가</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
