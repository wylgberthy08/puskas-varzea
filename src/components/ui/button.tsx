import * as React from "react"
import { cn } from "@/design-system/utils/cn"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'social'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-[#1565FF] text-white hover:bg-[#0047E1] shadow-[0_0_20px_rgba(21,101,255,0.5)] active:scale-[0.98]',
      secondary: 'bg-[#1A2235] text-white hover:bg-[#111827] border border-[#243351] active:scale-[0.98]',
      outline: 'bg-transparent border border-[#243351] text-white hover:bg-[#1A2235] active:scale-[0.98]',
      ghost: 'bg-transparent text-[#94A3B8] hover:text-white',
      social: 'bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all duration-200 active:scale-[0.98]',
    }

    const sizes = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-5 text-sm',
      lg: 'h-12 px-6 text-base font-bold',
    }

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1565FF] disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button }
