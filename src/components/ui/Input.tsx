import React, { useId, useState } from 'react'
import clsx from "clsx"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  type?: 'text' | 'email' | 'password'
}

export default function Input({
  label,
  error,
  leftIcon,
  type = 'text',
  ...rest
}: InputProps) {
  const id = useId()
  const [showPassword, setShowPassword] = useState(false)

  let resolvedType: string
  if (type === 'password') {

    if (showPassword) {
      resolvedType = 'text'
    }
    else {
      resolvedType = 'password'
    }
  }
  else resolvedType = type

  return (
      <div className="flex flex-col gap-[6px]">
        {label && (
            <label
              htmlFor={id}
              className="text-[14px] text-text-muted font-medium"
            >
              {label}
            </label>
        )}
        <div className="relative">
          {leftIcon && (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-text-muted pointer-events-none">
                {leftIcon}
              </span>
          )}
          <input
            id={id}
            type={resolvedType}
            className={clsx(
                'w-full h-12 bg-input-bg rounded-lg text-text-primary text-[15px] outline-none border transition-all duration-150',
                'focus:border-accent focus:ring-2 focus:ring-accent-glow',
                leftIcon ? 'pl-10' : 'pl-3',
                type === 'password' ? 'pr-11' : 'pr-3',
                error ? 'border-error' : 'border-border',
            )}
            {...rest}
          />
          {type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center bg-none border-none cursor-pointer text-text-muted p-0"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                ) : (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                )}
              </button>
          )}
        </div>
        {error && (
            <span className="text-[12px] text-error mt-1">
              {error}
            </span>
        )}
      </div>
  )
}