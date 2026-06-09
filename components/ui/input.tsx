import * as React from "react"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex w-full rounded-md border border-[var(--color-outline-variant)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline-variant)] hover:border-[var(--color-outline)] focus-visible:outline-none focus-visible:border-[1.5px] focus-visible:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] transition-colors ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }