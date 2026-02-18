import { cn } from "@/lib/utils"
import type { HealthStatus } from "@/lib/health-data"

interface StatusBadgeProps {
  status: HealthStatus | "low" | "moderate" | "high" | "critical"
  label?: string
}

const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  healthy: {
    bg: "bg-[hsl(var(--success))]/10",
    text: "text-[hsl(var(--success))]",
    dot: "bg-[hsl(var(--success))]",
    label: "Healthy",
  },
  low: {
    bg: "bg-[hsl(var(--success))]/10",
    text: "text-[hsl(var(--success))]",
    dot: "bg-[hsl(var(--success))]",
    label: "Low Risk",
  },
  warning: {
    bg: "bg-[hsl(var(--warning))]/10",
    text: "text-[hsl(var(--warning))]",
    dot: "bg-[hsl(var(--warning))]",
    label: "Warning",
  },
  moderate: {
    bg: "bg-[hsl(var(--warning))]/10",
    text: "text-[hsl(var(--warning))]",
    dot: "bg-[hsl(var(--warning))]",
    label: "Moderate Risk",
  },
  high: {
    bg: "bg-[hsl(var(--destructive))]/10",
    text: "text-[hsl(var(--destructive))]",
    dot: "bg-[hsl(var(--destructive))]",
    label: "High Risk",
  },
  critical: {
    bg: "bg-[hsl(var(--destructive))]/10",
    text: "text-[hsl(var(--destructive))]",
    dot: "bg-[hsl(var(--destructive))]",
    label: "Critical",
  },
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const c = config[status] ?? config.healthy
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", c.bg, c.text)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {label ?? c.label}
    </span>
  )
}
