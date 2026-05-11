import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline' | 'neutral';
  className?: string;
  children?: React.ReactNode;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
    success: "bg-emerald-400/20 text-emerald-400 border border-emerald-400/30",
    warning: "bg-amber-400/20 text-amber-400 border border-amber-400/30",
    destructive: "bg-rose-500/20 text-rose-500 border border-rose-500/30",
    outline: "text-slate-300 border-white/20",
    neutral: "bg-white/10 text-slate-300 border border-white/10"
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
