import * as React from "react"
import { cn } from "../../lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { Search, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"

// --- LuminousPanel ---
export function LuminousPanel({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-luminous-panel border border-luminous-lavender/20 backdrop-blur-md rounded-xl shadow-sm text-luminous-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// --- StatusChip ---
export type StatusType = "success" | "warning" | "danger" | "info" | "neutral"

interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusType
  label: string
  className?: string
}

export function StatusChip({ status, label, className, ...props }: StatusChipProps) {
  const statusStyles = {
    success: "bg-luminous-success/10 text-luminous-success border-luminous-success/20",
    warning: "bg-luminous-warning/10 text-luminous-warning border-luminous-warning/20",
    danger: "bg-luminous-danger/10 text-luminous-danger border-luminous-danger/20",
    info: "bg-luminous-cyan/10 text-luminous-cyan border-luminous-cyan/20",
    neutral: "bg-luminous-text-secondary/10 text-luminous-text-secondary border-luminous-text-secondary/20",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm tracking-wide",
        statusStyles[status],
        className
      )}
      {...props}
    >
      {label}
    </span>
  )
}

// --- LuminousSearchBar ---
export interface LuminousSearchBarProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const LuminousSearchBar = React.forwardRef<HTMLInputElement, LuminousSearchBarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative group w-full sm:w-72">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-luminous-text-secondary group-focus-within:text-luminous-lavender transition-colors">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          className={cn(
            "w-full bg-luminous-bg/50 border border-luminous-lavender/20 text-luminous-text-primary text-sm rounded-lg focus:ring-1 focus:ring-luminous-lavender focus:border-luminous-lavender block pl-10 p-2.5 placeholder-luminous-text-secondary outline-none transition-all duration-200 shadow-sm",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
LuminousSearchBar.displayName = "LuminousSearchBar"

// --- LuminousActionButton ---
export interface LuminousActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "primary" | "secondary" | "danger" | "ghost"
  size?: "sm" | "md" | "lg"
}

export const LuminousActionButton = React.forwardRef<HTMLButtonElement, LuminousActionButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const variants = {
      primary: "bg-luminous-lavender text-luminous-bg hover:bg-luminous-lavender-soft shadow-sm border border-transparent font-semibold",
      secondary: "bg-luminous-panel border border-luminous-lavender/30 text-luminous-text-primary hover:border-luminous-lavender hover:bg-luminous-lavender/10 shadow-sm",
      danger: "bg-luminous-danger text-white border border-transparent shadow-sm hover:bg-luminous-danger/90",
      ghost: "bg-transparent text-luminous-text-secondary hover:text-luminous-text-primary hover:bg-luminous-lavender/10",
    }

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    }
    
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-luminous-cyan/50 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
LuminousActionButton.displayName = "LuminousActionButton"

// --- LuminousTable ---
const LuminousTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-xl border border-luminous-lavender/20 bg-luminous-panel shadow-sm">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm text-left", className)}
      {...props}
    />
  </div>
))
LuminousTable.displayName = "LuminousTable"

const LuminousTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-luminous-bg/50 border-b border-luminous-lavender/20", className)} {...props} />
))
LuminousTableHeader.displayName = "LuminousTableHeader"

const LuminousTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0 text-luminous-text-secondary", className)}
    {...props}
  />
))
LuminousTableBody.displayName = "LuminousTableBody"

const LuminousTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-luminous-lavender/10 transition-colors hover:bg-luminous-lavender/5",
      className
    )}
    {...props}
  />
))
LuminousTableRow.displayName = "LuminousTableRow"

export interface LuminousTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortDirection?: "asc" | "desc" | null
  onSort?: () => void
}

const LuminousTableHead = React.forwardRef<
  HTMLTableCellElement,
  LuminousTableHeadProps
>(({ className, children, sortDirection, onSort, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-6 py-4 align-middle font-bold text-luminous-text-secondary tracking-wider text-xs uppercase transition-colors",
      onSort && "cursor-pointer hover:text-luminous-text-primary hover:bg-luminous-lavender/5 select-none",
      className
    )}
    onClick={onSort}
    {...props}
  >
    <div className="flex items-center gap-2">
      {children}
      {onSort && (
        <span className="shrink-0">
          {sortDirection === "asc" ? (
            <ArrowUp className="w-3.5 h-3.5 text-luminous-lavender" />
          ) : sortDirection === "desc" ? (
            <ArrowDown className="w-3.5 h-3.5 text-luminous-lavender" />
          ) : (
            <ArrowUpDown className="w-3.5 h-3.5 opacity-30" />
          )}
        </span>
      )}
    </div>
  </th>
))
LuminousTableHead.displayName = "LuminousTableHead"

const LuminousTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-6 py-4 align-middle", className)}
    {...props}
  />
))
LuminousTableCell.displayName = "LuminousTableCell"

export {
  LuminousTable,
  LuminousTableHeader,
  LuminousTableBody,
  LuminousTableRow,
  LuminousTableHead,
  LuminousTableCell,
}
