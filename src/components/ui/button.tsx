import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'default' | 'outline' | 'ghost' | 'glass' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Tailwind classes for buttons
    const baseClass = "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE] disabled:pointer-events-none disabled:opacity-50 tracking-wide"
    const variantClasses = {
      default: "bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#7C3AED] text-white font-bold shadow-[0_0_30px_rgba(34,211,238,0.25)] hover:scale-[1.02] active:scale-[0.98]",
      outline: "border border-white/10 bg-white/5 text-[#F8FAFC] hover:bg-white/10 font-medium",
      ghost: "hover:bg-white/5 hover:text-[#22D3EE] text-[#94A3B8]",
      glass: "bg-white text-[#2563EB] hover:bg-cyan-50 shadow-md font-bold",
      destructive: "bg-[#EF4444] text-white font-black tracking-widest shadow-[0_0_35px_rgba(239,68,68,0.35)] hover:bg-red-500 hover:scale-[1.02] active:scale-[0.98]"
    }
    const sizeClasses = {
      default: "h-12 px-6 py-3",
      sm: "h-10 rounded-xl px-4",
      lg: "h-14 rounded-2xl px-8 text-base font-bold",
      icon: "h-12 w-12"
    }

    return (
      <Comp
        className={cn(baseClass, variantClasses[variant], sizeClasses[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
