"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Heart,
  Droplets,
  Moon,
  Brain,
  Footprints,
  Search,
  Filter,
  Watch,
  WifiOff,
} from "lucide-react"
import { getEmployees, type Employee } from "@/lib/health-data"
import { StatusBadge } from "./status-badge"
import { HealthGauge } from "./health-gauge"

function EmployeeCard({ employee }: { employee: Employee }) {
  return (
    <Link
      href={`/employees/${employee.id}`}
      className="group rounded-xl border border-border bg-card p-5 transition-all hover:shadow-lg hover:border-[hsl(var(--primary))]/30"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="relative">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
            {employee.avatar}
          </div>
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card ${
              employee.watchConnected ? "bg-[hsl(var(--success))]" : "bg-muted-foreground"
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-card-foreground group-hover:text-[hsl(var(--primary))] transition-colors truncate">
            {employee.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">{employee.role} &middot; {employee.department}</p>
        </div>
        <StatusBadge status={employee.status} />
      </div>

      {/* Vital stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-2.5 py-2">
          <Heart className="h-3.5 w-3.5 text-[hsl(var(--destructive))]" />
          <div>
            <p className="text-[10px] text-muted-foreground">Heart Rate</p>
            <p className="text-xs font-semibold text-card-foreground font-mono">{employee.vitals.heartRate} BPM</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-2.5 py-2">
          <Droplets className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
          <div>
            <p className="text-[10px] text-muted-foreground">SpO2</p>
            <p className="text-xs font-semibold text-card-foreground font-mono">{employee.vitals.bloodOxygen}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-2.5 py-2">
          <Moon className="h-3.5 w-3.5 text-[hsl(var(--chart-5))]" />
          <div>
            <p className="text-[10px] text-muted-foreground">Sleep</p>
            <p className="text-xs font-semibold text-card-foreground font-mono">{employee.vitals.sleepHours}h</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-2.5 py-2">
          <Footprints className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
          <div>
            <p className="text-[10px] text-muted-foreground">Steps</p>
            <p className="text-xs font-semibold text-card-foreground font-mono">{employee.vitals.steps.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Fatigue & Burnout */}
      <div className="space-y-2.5">
        <HealthGauge
          label="Fatigue"
          value={employee.fatigue.score}
          size="sm"
          variant={employee.fatigue.score > 60 ? "danger" : employee.fatigue.score > 35 ? "warning" : "success"}
        />
        <HealthGauge
          label="Burnout Risk"
          value={Math.round(employee.burnout.score)}
          size="sm"
          variant={employee.burnout.risk === "critical" ? "danger" : employee.burnout.risk === "high" ? "danger" : employee.burnout.risk === "moderate" ? "warning" : "success"}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
        {employee.watchConnected ? (
          <Watch className="h-3 w-3 text-[hsl(var(--success))]" />
        ) : (
          <WifiOff className="h-3 w-3 text-muted-foreground" />
        )}
        <span className="text-[10px] text-muted-foreground">
          {employee.watchConnected ? "Connected" : "Disconnected"} &middot; Synced {employee.lastSync}
        </span>
        {employee.alerts.length > 0 && (
          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[hsl(var(--destructive))]/10 px-1.5 text-[10px] font-semibold text-[hsl(var(--destructive))]">
            {employee.alerts.length}
          </span>
        )}
      </div>
    </Link>
  )
}

export function EmployeeList() {
  const employees = getEmployees()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "healthy" | "warning" | "critical">("all")

  const filtered = employees.filter((e) => {
    if (filter !== "all" && e.status !== filter) return false
    if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.department.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">Employees</h1>
        <p className="text-sm text-muted-foreground">Monitor individual health metrics and wellness data from smartwatches.</p>
      </div>

      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-card px-9 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {(["all", "healthy", "warning", "critical"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Employee grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((emp) => (
          <EmployeeCard key={emp.id} employee={emp} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Brain className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No employees found</p>
          <p className="text-xs text-muted-foreground/60">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
