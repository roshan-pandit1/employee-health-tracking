import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: { value: string; positive: boolean }
  variant?: "default" | "success" | "warning" | "danger"
}

const variantStyles = {
  default: "bg-card border-border",
  success: "bg-card border-[hsl(var(--success))]/20",
  warning: "bg-card border-[hsl(var(--warning))]/20",
  danger: "bg-card border-[hsl(var(--destructive))]/20",
}

const iconBgStyles = {
  default: "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]",
  success: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
  warning: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]",
  danger: "bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))]",
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-shadow hover:shadow-md",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-card-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <p
              className={cn(
                "text-xs font-medium",
                trend.positive ? "text-[hsl(var(--success))]" : "text-[hsl(var(--destructive))]"
              )}
            >
              {trend.value}
            </p>
          )}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", iconBgStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
