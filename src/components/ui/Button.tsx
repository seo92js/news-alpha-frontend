import React from 'react'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md'
  loading?: boolean
  fullWidth?: boolean
}

export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    children,
    disabled,
    className,
    ...rest
}: ButtonProps){
    return (
        <button
          disabled={disabled || loading}
          className={clsx(
              'inline-flex items-center justify-center rounded-lg font-bold border-none transition-all duration-150',
              fullWidth && 'w-full',
              disabled || loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
              size === 'md' ? 'h-12 px-5 text-[15px]'
                            : 'h-9 px-[14px] text-sm',
              variant === 'primary' ? 'bg-accent text-[#0F0F10] hover:bg-accent-hover'
                                    : 'bg-transparent text-text-primary border border-border',
              className,
          )}
          {...rest}
        >
          {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
                children
            )}
        </button>
    )
}