import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import Button from '@/components/ui/button'
import StockDrawer from '@/features/stocks/StockDrawer'
import AddStockModal from '@/features/stocks/AddStockModal'

export default function Navbar() {
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const clearAuth = useAuthStore((s) => s.clearAuth)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)

    const handleLogout = () => {
        clearAuth()
        navigate('/login')
    }

    return (
        <>
          <header className="sticky top-0 z-40 bg-bg border-b border-border">
            <div className="max-w-[800px] mx-auto px-6 h-14 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 no-underline">
                <span className="text-[18px] font-bold text-text-primary tracking-[-0.5px]">
                  News
                </span>
                <span className="text-[11px] font-semibold text-bg bg-accent rounded px-[6px] py-[2px] tracking-[1px]">
                  ALPHA
                </span>
              </Link>
              {user && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setDrawerOpen(true)}
                      className="bg-none border border-border rounded-lg text-text-primary text-[13px] px-3 py-[6px] cursor-pointer"
                    >
                      관심종목
                    </button>
                    <span className="text-[14px] text-text-muted">
                      {user.email}
                    </span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      로그아웃
                    </Button>
                  </div>
                )}
            </div>
          </header>

          <StockDrawer
              isOpen={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              onAddClick={() => { setDrawerOpen(false); setModalOpen(true) }}
          />

          <AddStockModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
          />
        </>
    )
}