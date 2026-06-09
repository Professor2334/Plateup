import * as React from "react"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`flex w-full rounded-md border-[0.9px] border-[color-mix(in_srgb,var(--color-outline-variant)_90%,transparent)] bg-[var(--color-background)] hover:bg-[var(--color-surface-bright)] px-3 py-2 text-sm text-[var(--color-on-surface)] placeholder:text-[var(--color-outline-variant)] hover:border-[color-mix(in_srgb,var(--color-outline)_50%,transparent)] focus-visible:outline-none focus-visible:border-[1.6px] focus-visible:border-[color-mix(in_srgb,var(--color-primary)_90%,transparent)] focus-visible:shadow-[0_6px_20px_hsla(142,72%,29%,0.20)] disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] transition-colors ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }