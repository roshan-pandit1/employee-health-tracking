"use client"

import { cn } from "@/lib/utils"

interface HealthGaugeProps {
  label: string
  value: number
  max?: number
  unit?: string
  size?: "sm" | "md"
  variant?: "default" | "success" | "warning" | "danger"
}

export function HealthGauge({
  label,
  value,
  max = 100,
  unit = "%",
  size = "md",
  variant = "default",
}: HealthGaugeProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const barColor = {
    default: "bg-[hsl(var(--primary))]",
    success: "bg-[hsl(var(--success))]",
    warning: "bg-[hsl(var(--warning))]",
    danger: "bg-[hsl(var(--destructive))]",
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={cn("font-medium text-card-foreground", size === "sm" ? "text-xs" : "text-sm")}>
          {label}
        </span>
        <span className={cn("font-mono font-semibold text-card-foreground", size === "sm" ? "text-xs" : "text-sm")}>
          {value}
          {unit}
        </span>
      </div>
      <div className={cn("rounded-full bg-secondary", size === "sm" ? "h-1.5" : "h-2")}>
        <div
          className={cn("rounded-full transition-all duration-500", barColor[variant], size === "sm" ? "h-1.5" : "h-2")}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
