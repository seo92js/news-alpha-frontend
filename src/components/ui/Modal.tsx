import type { ReactNode } from 'react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-[100]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border border-border rounded-2xl p-8 w-full max-w-[480px] flex flex-col gap-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="bg-none border-none text-text-muted text-[20px] cursor-pointer p-1"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}