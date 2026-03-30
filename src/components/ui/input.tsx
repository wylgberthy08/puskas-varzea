import * as React from "react"
import { cn } from "@/design-system/utils/cn"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  rightElement?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon, rightElement, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-2.5">
        {label && (
          <div className="flex justify-between items-center px-1">
            <label className="text-[13px] font-semibold text-[#94A3B8] tracking-tight">
              {label}
            </label>
            {rightElement}
          </div>
        )}
        <div className="relative flex items-center group">
          {icon && (
            <div className="absolute left-4 z-10">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex w-full h-14 rounded-2xl border bg-black/20 border-white/10 px-4 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#64748B] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1565FF] focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
              icon && "pl-12",
              error && "border-red-500 focus-visible:ring-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-red-500 px-1">
            {error}
          </span>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
