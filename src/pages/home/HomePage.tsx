import { useSignals } from '@/features/signals/useSignals'
import Navbar from '@/components/layout/Navbar'
import SignalCard from '@/features/signals/SignalCard'

const TOP_SIGNAL_COUNT = 3

export default function HomePage() {
  const { data: signals = [], isLoading: signalsLoading } = useSignals()

  const topSignals = [...signals]
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP_SIGNAL_COUNT)

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      <main className="max-w-[800px] mx-auto p-6 animate-[fadeInUp_300ms_ease-out]">
        <section className="mb-8">
          <div className="flex items-center gap-[10px] mb-[14px]">
            <h2 className="text-[16px] font-bold text-text-primary">
              오늘의 시그널
            </h2>
            <span className="text-[12px] font-bold text-accent bg-[rgba(245,166,35,0.12)] rounded-[20px] px-[10px] py-[2px]">
              {topSignals.length}
            </span>
          </div>

          {signalsLoading ? (
              <p className="text-[14px] text-text-muted">불러오는 중...</p>
          ) : topSignals.length === 0 ? (
              <p className="text-[14px] text-text-muted">탐지된 시그널이 없습니다</p>
          ) : (
              <div className="flex flex-col gap-2">
                {topSignals.map((signal) => (
                    <SignalCard key={signal.id} signal={signal} compact />
                ))}
              </div>
          )}
        </section>
      </main>
    </div>
  )
}