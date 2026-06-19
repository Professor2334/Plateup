import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "error-outline"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 min-h-[44px] px-4 py-2"
    
    // Apply PlateUp design system tokens
    let variantStyles = ""
    if (variant === "primary") {
      variantStyles = "bg-[var(--color-primary)] text-white hover:opacity-90"
    } else if (variant === "secondary") {
      variantStyles = "bg-[var(--color-secondary)] text-white hover:opacity-90"
    } else if (variant === "outline") {
      variantStyles = "border border-[var(--color-outline)] text-[var(--color-on-surface)] hover:bg-[var(--color-surface-container)]"
    } else if (variant === "error-outline") {
      variantStyles = "border border-[var(--color-error)] text-[var(--color-error)] hover:bg-[var(--color-error)] hover:text-white"
    }

    return (
      <button
        className={`${baseStyles} ${variantStyles} ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
