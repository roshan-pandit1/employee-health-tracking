"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Heart,
  Droplets,
  Moon,
  Brain,
  Zap,
  AlertOctagon,
  Thermometer,
  Bell,
  CheckCircle2,
  Filter,
  ShieldAlert,
  Lightbulb,
  ArrowRight,
  Clock,
} from "lucide-react"
import { getAllAlerts, type Alert } from "@/lib/health-data"
import { cn } from "@/lib/utils"

const iconMap: Record<string, React.ElementType> = {
  heart_rate: Heart,
  blood_oxygen: Droplets,
  sleep: Moon,
  stress: Brain,
  fatigue: Zap,
  burnout: AlertOctagon,
  temperature: Thermometer,
}

const typeLabels: Record<string, string> = {
  heart_rate: "Heart Rate",
  blood_oxygen: "Blood Oxygen",
  sleep: "Sleep",
  stress: "Stress",
  fatigue: "Fatigue",
  burnout: "Burnout",
  temperature: "Temperature",
}

function AlertCard({ alert, onAcknowledge }: { alert: Alert; onAcknowledge: (id: string) => void }) {
  const Icon = iconMap[alert.type] ?? Bell
  const severityStyles = {
    critical: {
      border: "border-[hsl(var(--destructive))]/30",
      iconBg: "bg-[hsl(var(--destructive))]/10",
      iconColor: "text-[hsl(var(--destructive))]",
      badge: "bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))]",
    },
    warning: {
      border: "border-[hsl(var(--warning))]/30",
      iconBg: "bg-[hsl(var(--warning))]/10",
      iconColor: "text-[hsl(var(--warning))]",
      badge: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]",
    },
    info: {
      border: "border-[hsl(var(--primary))]/30",
      iconBg: "bg-[hsl(var(--primary))]/10",
      iconColor: "text-[hsl(var(--primary))]",
      badge: "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]",
    },
  }
  const s = severityStyles[alert.severity]

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 transition-all",
        alert.acknowledged ? "border-border opacity-60" : s.border
      )}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg", s.iconBg)}>
          <Icon className={cn("h-5 w-5", s.iconColor)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header row */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/employees/${alert.employeeId}`}
              className="text-sm font-semibold text-card-foreground hover:text-[hsl(var(--primary))] transition-colors"
            >
              {alert.employeeName}
            </Link>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase", s.badge)}>
              {alert.severity}
            </span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {typeLabels[alert.type] ?? alert.type}
            </span>
          </div>

          {/* Message */}
          <p className="text-sm text-card-foreground leading-relaxed">{alert.message}</p>

          {/* Suggestion */}
          <div className="flex items-start gap-2 rounded-lg bg-[hsl(var(--primary))]/5 p-3">
            <Lightbulb className="h-4 w-4 text-[hsl(var(--primary))] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-foreground leading-relaxed">{alert.suggestion}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {alert.timestamp}
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/employees/${alert.employeeId}`}
                className="flex items-center gap-1 text-xs font-medium text-[hsl(var(--primary))] hover:underline"
              >
                View Profile <ArrowRight className="h-3 w-3" />
              </Link>
              {!alert.acknowledged && (
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Acknowledge
                </button>
              )}
              {alert.acknowledged && (
                <span className="flex items-center gap-1 text-xs text-[hsl(var(--success))]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Acknowledged
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function AlertsPanel() {
  const allAlerts = getAllAlerts()
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set())
  const [severityFilter, setSeverityFilter] = useState<"all" | "critical" | "warning" | "info">("all")

  const handleAcknowledge = (id: string) => {
    setAcknowledged((prev) => new Set([...prev, id]))
  }

  const alertsWithState = allAlerts.map((a) => ({
    ...a,
    acknowledged: acknowledged.has(a.id),
  }))

  const filtered = alertsWithState.filter((a) => {
    if (severityFilter !== "all" && a.severity !== severityFilter) return false
    return true
  })

  const criticalCount = allAlerts.filter((a) => a.severity === "critical").length
  const warningCount = allAlerts.filter((a) => a.severity === "warning").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Health Alerts</h1>
        <p className="text-sm text-muted-foreground">
          Real-time health alerts from employee smartwatch data with actionable suggestions.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--destructive))]/10">
            <ShieldAlert className="h-5 w-5 text-[hsl(var(--destructive))]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-card-foreground">{criticalCount}</p>
            <p className="text-xs text-muted-foreground">Critical Alerts</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--warning))]/10">
            <Bell className="h-5 w-5 text-[hsl(var(--warning))]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-card-foreground">{warningCount}</p>
            <p className="text-xs text-muted-foreground">Warning Alerts</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--success))]/10">
            <CheckCircle2 className="h-5 w-5 text-[hsl(var(--success))]" />
          </div>
          <div>
            <p className="text-2xl font-bold text-card-foreground">{acknowledged.size}</p>
            <p className="text-xs text-muted-foreground">Acknowledged</p>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {(["all", "critical", "warning"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setSeverityFilter(f)}
            className={cn(
              "rounded-lg px-3 py-2 text-xs font-medium transition-colors",
              severityFilter === f
                ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-4">
        {filtered.map((alert) => (
          <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <CheckCircle2 className="h-12 w-12 text-[hsl(var(--success))]/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No alerts in this category</p>
          <p className="text-xs text-muted-foreground/60">All clear for now</p>
        </div>
      )}
    </div>
  )
}
