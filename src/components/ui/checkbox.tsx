import * as React from "react"
import { cn } from "@/design-system/utils/cn"

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer group py-1">
        <div className="relative flex items-center">
          <input
            type="checkbox"
            className={cn(
              "peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/10 bg-white/5 transition-all checked:bg-[#1565FF] checked:border-[#1565FF] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1565FF]",
              className
            )}
            ref={ref}
            {...props}
          />
          <svg
            className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        {label && (
          <span className="text-sm font-medium text-[#94A3B8] group-hover:text-white transition-colors select-none">
            {label}
          </span>
        )}
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
