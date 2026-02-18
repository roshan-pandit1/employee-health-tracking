"use client"

import Link from "next/link"
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Brain,
  Moon,
  Zap,
  Bell,
  Watch,
  ArrowRight,
  Heart,
  Activity,
  Thermometer,
  Footprints,
} from "lucide-react"
import { getOverviewStats, getEmployees, getAllAlerts, type Employee } from "@/lib/health-data"
import { StatCard } from "./stat-card"
import { StatusBadge } from "./status-badge"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

function FatigueDistribution({ employees }: { employees: Employee[] }) {
  const ranges = [
    { name: "Low (0-25)", count: employees.filter((e) => e.fatigue.score <= 25).length, fill: "hsl(var(--success))" },
    { name: "Moderate (26-50)", count: employees.filter((e) => e.fatigue.score > 25 && e.fatigue.score <= 50).length, fill: "hsl(var(--warning))" },
    { name: "High (51-75)", count: employees.filter((e) => e.fatigue.score > 50 && e.fatigue.score <= 75).length, fill: "hsl(var(--chart-4))" },
    { name: "Critical (76+)", count: employees.filter((e) => e.fatigue.score > 75).length, fill: "hsl(var(--destructive))" },
  ]
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">Fatigue Distribution</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ranges} barSize={32}>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
                color: "hsl(var(--card-foreground))",
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {ranges.map((r, i) => (
                <Cell key={i} fill={r.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function HealthStatusPie({ employees }: { employees: Employee[] }) {
  const data = [
    { name: "Healthy", value: employees.filter((e) => e.status === "healthy").length, color: "hsl(var(--success))" },
    { name: "Warning", value: employees.filter((e) => e.status === "warning").length, color: "hsl(var(--warning))" },
    { name: "Critical", value: employees.filter((e) => e.status === "critical").length, color: "hsl(var(--destructive))" },
  ]
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">Health Status Overview</h3>
      <div className="flex items-center gap-6">
        <div className="h-40 w-40 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-sm text-muted-foreground">{d.name}</span>
              <span className="ml-auto text-sm font-semibold text-card-foreground">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TeamStressChart({ employees }: { employees: Employee[] }) {
  const data = employees.map((e) => ({
    name: e.name.split(" ")[0],
    stress: e.vitals.stressLevel,
    fatigue: e.fatigue.score,
  }))
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="text-sm font-semibold text-card-foreground mb-4">Team Stress vs Fatigue</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fatigueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                fontSize: 12,
                color: "hsl(var(--card-foreground))",
              }}
            />
            <Area type="monotone" dataKey="stress" stroke="hsl(var(--chart-1))" fill="url(#stressGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="fatigue" stroke="hsl(var(--chart-4))" fill="url(#fatigueGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[hsl(var(--chart-1))]" />
          <span className="text-xs text-muted-foreground">Stress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[hsl(var(--chart-4))]" />
          <span className="text-xs text-muted-foreground">Fatigue</span>
        </div>
      </div>
    </div>
  )
}

function RecentAlerts() {
  const alerts = getAllAlerts().slice(0, 5)
  const iconMap: Record<string, React.ElementType> = {
    heart_rate: Heart,
    blood_oxygen: Activity,
    sleep: Moon,
    stress: Brain,
    fatigue: Zap,
    burnout: AlertOctagon,
    temperature: Thermometer,
  }
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">Recent Alerts</h3>
        <Link href="/alerts" className="flex items-center gap-1 text-xs font-medium text-[hsl(var(--primary))] hover:underline">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = iconMap[alert.type] ?? Bell
          return (
            <div key={alert.id} className="flex items-start gap-3 rounded-lg p-3 bg-secondary/50">
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                  alert.severity === "critical"
                    ? "bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))]"
                    : "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-card-foreground truncate">{alert.employeeName}</p>
                <p className="text-xs text-muted-foreground truncate">{alert.message}</p>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{alert.timestamp}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function QuickEmployeeList({ employees }: { employees: Employee[] }) {
  const sorted = [...employees].sort((a, b) => b.fatigue.score - a.fatigue.score).slice(0, 5)
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-card-foreground">Highest Fatigue</h3>
        <Link href="/employees" className="flex items-center gap-1 text-xs font-medium text-[hsl(var(--primary))] hover:underline">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="space-y-3">
        {sorted.map((emp) => (
          <Link
            key={emp.id}
            href={`/employees/${emp.id}`}
            className="flex items-center gap-3 rounded-lg p-2 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
              {emp.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-card-foreground truncate">{emp.name}</p>
              <p className="text-xs text-muted-foreground">{emp.role}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono font-semibold text-card-foreground">{emp.fatigue.score}</p>
              <StatusBadge status={emp.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function DashboardOverview() {
  const stats = getOverviewStats()
  const employees = getEmployees()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground text-balance">Wellness Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Monitor your team&apos;s health metrics from smartwatch data in real-time.
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Employees"
          value={stats.total}
          subtitle={`${stats.connected} watches connected`}
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Healthy"
          value={stats.healthy}
          subtitle={`${Math.round((stats.healthy / stats.total) * 100)}% of team`}
          icon={ShieldCheck}
          variant="success"
        />
        <StatCard
          title="Warnings"
          value={stats.warning}
          subtitle="Need attention"
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Critical"
          value={stats.critical}
          subtitle={`${stats.criticalAlerts} active alerts`}
          icon={AlertOctagon}
          variant="danger"
        />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Avg Fatigue"
          value={`${stats.avgFatigue}%`}
          icon={Brain}
          trend={{ value: stats.avgFatigue > 50 ? "Above normal" : "Within range", positive: stats.avgFatigue <= 50 }}
        />
        <StatCard
          title="Avg Sleep"
          value={`${stats.avgSleep}h`}
          icon={Moon}
          trend={{ value: stats.avgSleep >= 7 ? "Good average" : "Below recommended", positive: stats.avgSleep >= 7 }}
        />
        <StatCard
          title="Avg Stress"
          value={`${stats.avgStress}%`}
          icon={Zap}
          trend={{ value: stats.avgStress > 50 ? "Above target" : "Within target", positive: stats.avgStress <= 50 }}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HealthStatusPie employees={employees} />
        <FatigueDistribution employees={employees} />
      </div>

      {/* Stress chart */}
      <TeamStressChart employees={employees} />

      {/* Lists row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentAlerts />
        <QuickEmployeeList employees={employees} />
      </div>

      {/* Connected devices banner */}
      <div className="rounded-xl border border-[hsl(var(--primary))]/20 bg-[hsl(var(--primary))]/5 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--primary))]/10">
            <Watch className="h-5 w-5 text-[hsl(var(--primary))]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {stats.connected}/{stats.total} Smartwatches Connected
            </p>
            <p className="text-xs text-muted-foreground">
              {stats.total - stats.connected} employee(s) have disconnected devices. Health data may be outdated.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
