import { useNavigate } from 'react-router-dom'
import { useStocks } from '../../features/stocks/useStocks'

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
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-[200]"
        />
      )}

      <div
          className={`fixed top-0 right-0 h-screen w-[320px] bg-surface border-l border-border z-[201] flex flex-col transition-transform duration-[250ms] ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <span className="text-[16px] font-bold text-text-primary">관심종목</span>
          <button
              onClick={onClose}
              className="bg-none border-none text-text-muted text-[20px] cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
              <p className="text-[14px] text-text-muted text-center mt-6">불러오는 중...</p>
          ) : stocks.length === 0 ? (
              <p className="text-[14px] text-text-muted text-center mt-6">등록된 종목이 없습니다</p>
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
                        <span className="text-[12px] text-text-muted ml-2">{stock.ticker}</span>
                      </div>
                      <span className="text-[11px] text-text-muted border border-border rounded px-[5px] py-[1px]">
                        {stock.market}
                      </span>
                    </div>
                ))}
              </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border">
          <button
              onClick={onAddClick}
              className="w-full py-3 bg-accent border-none rounded-[10px] text-bg text-[14px] font-bold cursor-pointer"
          >
            추가
          </button>
        </div>
      </div>
    </>
  )
}