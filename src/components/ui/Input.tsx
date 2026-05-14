import React, { useId, useState } from 'react'
import clsx from "clsx"
import { Eye, EyeOff } from 'lucide-react'

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
                    <EyeOff size={18} />
                ) : (
                    <Eye size={18} />
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