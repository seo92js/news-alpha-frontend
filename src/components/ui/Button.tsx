import React from 'react'
import clsx from 'clsx'

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
              <svg
                className="w-[18px] h-[18px] animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
                children
            )}
        </button>
    )
}