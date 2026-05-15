import * as React from "react"
import { useId, useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-white/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }

interface FormInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  type?: "text" | "email" | "password"
}

function FormInput({ label, error, leftIcon, type = "text", className, id: externalId, ...props }: FormInputProps) {
  const autoId = useId()
  const id = externalId ?? autoId
  const [showPassword, setShowPassword] = useState(false)
  const inputType = type === "password" ? (showPassword ? "text" : "password") : type

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </span>
        )}
        <Input
          id={id}
          type={inputType}
          aria-invalid={!!error}
          className={cn(leftIcon && "pl-8", type === "password" && "pr-9", className)}
          {...props}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  )
}

export default FormInput
