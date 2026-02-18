"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Heart,
  Droplets,
  Moon,
  Brain,
  Footprints,
  Thermometer,
  Flame,
  Watch,
  WifiOff,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Lightbulb,
  ShieldAlert,
  Activity,
} from "lucide-react"
import { type Employee, getSuggestions } from "@/lib/health-data"
import { StatusBadge } from "./status-badge"
import { HealthGauge } from "./health-gauge"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

const chartTooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
  color: "hsl(var(--card-foreground))",
}
const axisTick = { fontSize: 10, fill: "hsl(var(--muted-foreground))" }

function VitalCard({
  icon: Icon,
  label,
  value,
  unit,
  color,
  history,
  historyKey,
}: {
  icon: React.ElementType
  label: string
  value: number | string
  unit: string
  color: string
  history: { time: string; value: number }[]
  historyKey?: string
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4" style={{ color }} />
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-bold text-card-foreground font-mono">
        {value}
        <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
      </p>
      <div className="h-16 mt-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id={`grad-${historyKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={`url(#grad-${historyKey})`}
              strokeWidth={1.5}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function EmployeeDetail({ employee }: { employee: Employee }) {
  const suggestions = getSuggestions(employee)
  const trendIcon =
    employee.fatigue.trend === "improving"
      ? TrendingDown
      : employee.fatigue.trend === "worsening"
      ? TrendingUp
      : Minus

  return (
    <div className="space-y-6">
      {/* Back nav */}
      <Link
        href="/employees"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Employees
      </Link>

      {/* Profile header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-lg font-bold text-secondary-foreground">
              {employee.avatar}
            </div>
            <span
              className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-card ${
                employee.watchConnected ? "bg-[hsl(var(--success))]" : "bg-muted-foreground"
              }`}
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-bold text-card-foreground">{employee.name}</h1>
              <StatusBadge status={employee.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {employee.role} &middot; {employee.department} &middot; Age {employee.age}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {employee.watchConnected ? (
                  <Watch className="h-3.5 w-3.5 text-[hsl(var(--success))]" />
                ) : (
                  <WifiOff className="h-3.5 w-3.5" />
                )}
                {employee.watchConnected ? "Connected" : "Disconnected"} &middot; Synced {employee.lastSync}
              </div>
              <span className="text-xs text-muted-foreground">Joined {employee.joinDate}</span>
            </div>
          </div>
          {employee.alerts.length > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-[hsl(var(--destructive))]/10 px-3 py-2">
              <AlertTriangle className="h-4 w-4 text-[hsl(var(--destructive))]" />
              <span className="text-xs font-medium text-[hsl(var(--destructive))]">
                {employee.alerts.length} active alert{employee.alerts.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Vital cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <VitalCard
          icon={Heart}
          label="Heart Rate"
          value={employee.vitals.heartRate}
          unit="BPM"
          color="hsl(var(--destructive))"
          history={employee.vitals.heartRateHistory}
          historyKey="hr"
        />
        <VitalCard
          icon={Droplets}
          label="Blood Oxygen"
          value={employee.vitals.bloodOxygen}
          unit="%"
          color="hsl(var(--primary))"
          history={employee.vitals.bloodOxygenHistory}
          historyKey="spo2"
        />
        <VitalCard
          icon={Moon}
          label="Sleep"
          value={employee.vitals.sleepHours}
          unit="hrs"
          color="hsl(var(--chart-5))"
          history={employee.vitals.sleepHistory}
          historyKey="sleep"
        />
        <VitalCard
          icon={Brain}
          label="Stress Level"
          value={employee.vitals.stressLevel}
          unit="%"
          color="hsl(var(--warning))"
          history={employee.vitals.stressHistory}
          historyKey="stress"
        />
        <VitalCard
          icon={Footprints}
          label="Steps"
          value={employee.vitals.steps.toLocaleString()}
          unit={`/ ${employee.vitals.stepsGoal.toLocaleString()}`}
          color="hsl(var(--success))"
          history={employee.vitals.stepsHistory}
          historyKey="steps"
        />
        <VitalCard
          icon={Thermometer}
          label="Temperature"
          value={employee.vitals.temperature}
          unit="°F"
          color="hsl(var(--chart-3))"
          history={[
            { time: "1", value: 98.2 },
            { time: "2", value: 98.4 },
            { time: "3", value: employee.vitals.temperature },
          ]}
          historyKey="temp"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fatigue & Burnout panel */}
        <div className="rounded-xl border border-border bg-card p-5 space-y-5">
          <h2 className="text-sm font-semibold text-card-foreground">Fatigue & Burnout Analysis</h2>

          <div className="space-y-4">
            <HealthGauge
              label="Fatigue Score"
              value={employee.fatigue.score}
              variant={
                employee.fatigue.score > 60
                  ? "danger"
                  : employee.fatigue.score > 35
                  ? "warning"
                  : "success"
              }
            />
            <div className="flex items-center gap-2">
              {(() => {
                const TrendIconComponent = trendIcon
                return <TrendIconComponent className="h-4 w-4 text-muted-foreground" />
              })()}
              <span className="text-xs text-muted-foreground capitalize">
                Trend: {employee.fatigue.trend}
              </span>
            </div>
            {employee.fatigue.factors.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {employee.fatigue.factors.map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-[hsl(var(--warning))]/10 px-2.5 py-1 text-[10px] font-medium text-[hsl(var(--warning))]"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-border pt-4">
            <HealthGauge
              label="Burnout Risk Score"
              value={Math.round(employee.burnout.score)}
              variant={
                employee.burnout.risk === "critical"
                  ? "danger"
                  : employee.burnout.risk === "high"
                  ? "danger"
                  : employee.burnout.risk === "moderate"
                  ? "warning"
                  : "success"
              }
            />
            <div className="mt-2">
              <StatusBadge status={employee.burnout.risk} />
            </div>
          </div>

          {/* Weekly burnout trend */}
          <div className="border-t border-border pt-4">
            <p className="text-xs font-medium text-muted-foreground mb-3">Weekly Burnout Trend</p>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={employee.burnout.weeklyTrend.map((v, i) => ({ day: ["M", "T", "W", "T", "F", "S", "S"][i], value: v }))}>
                  <XAxis dataKey="day" tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={20}>
                    {employee.burnout.weeklyTrend.map((v, i) => (
                      <Cell key={i} fill={v > 60 ? "hsl(var(--destructive))" : v > 40 ? "hsl(var(--warning))" : "hsl(var(--success))"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Suggestions panel */}
        <div className="space-y-4">
          {/* Suggestions */}
          <div className="rounded-xl border border-[hsl(var(--primary))]/20 bg-[hsl(var(--primary))]/5 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-[hsl(var(--primary))]" />
              <h2 className="text-sm font-semibold text-foreground">Wellness Suggestions</h2>
            </div>
            <div className="space-y-3">
              {suggestions.map((s, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-card p-3 border border-border">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10 text-[10px] font-bold text-[hsl(var(--primary))]">
                    {i + 1}
                  </span>
                  <p className="text-sm text-card-foreground leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active alerts for this employee */}
          {employee.alerts.length > 0 && (
            <div className="rounded-xl border border-[hsl(var(--destructive))]/20 bg-[hsl(var(--destructive))]/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="h-5 w-5 text-[hsl(var(--destructive))]" />
                <h2 className="text-sm font-semibold text-foreground">Active Alerts</h2>
              </div>
              <div className="space-y-3">
                {employee.alerts.map((alert) => (
                  <div key={alert.id} className="rounded-lg bg-card p-3 border border-border space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          alert.severity === "critical"
                            ? "bg-[hsl(var(--destructive))]"
                            : "bg-[hsl(var(--warning))]"
                        }`}
                      />
                      <p className="text-sm font-medium text-card-foreground">{alert.message}</p>
                    </div>
                    <p className="text-xs text-muted-foreground pl-4">{alert.suggestion}</p>
                    <p className="text-[10px] text-muted-foreground/60 pl-4">{alert.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed charts */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Heart Rate History</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={employee.vitals.heartRateHistory}>
                  <XAxis dataKey="time" tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis tick={axisTick} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Stress Level History</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={employee.vitals.stressHistory}>
                  <defs>
                    <linearGradient id="stressDetailGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={axisTick} axisLine={false} tickLine={false} />
                  <YAxis tick={axisTick} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--warning))" fill="url(#stressDetailGrad)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Activity summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-4 w-4 text-[hsl(var(--warning))]" />
            <span className="text-xs text-muted-foreground">Calories Burned</span>
          </div>
          <p className="text-2xl font-bold text-card-foreground font-mono">{employee.vitals.caloriesBurned.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">kcal today</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-[hsl(var(--success))]" />
            <span className="text-xs text-muted-foreground">Sleep Quality</span>
          </div>
          <p className="text-2xl font-bold text-card-foreground font-mono">{employee.vitals.sleepQuality}%</p>
          <p className="text-xs text-muted-foreground mt-1">
            {employee.vitals.sleepQuality >= 80 ? "Good" : employee.vitals.sleepQuality >= 50 ? "Fair" : "Poor"}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Footprints className="h-4 w-4 text-[hsl(var(--primary))]" />
            <span className="text-xs text-muted-foreground">Step Goal</span>
          </div>
          <p className="text-2xl font-bold text-card-foreground font-mono">
            {Math.round((employee.vitals.steps / employee.vitals.stepsGoal) * 100)}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {employee.vitals.steps.toLocaleString()} / {employee.vitals.stepsGoal.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Weekly sleep chart */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Weekly Sleep Pattern</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={employee.vitals.sleepHistory}>
              <XAxis dataKey="time" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} domain={[0, 10]} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={32}>
                {employee.vitals.sleepHistory.map((v, i) => (
                  <Cell
                    key={i}
                    fill={v.value >= 7 ? "hsl(var(--success))" : v.value >= 5 ? "hsl(var(--warning))" : "hsl(var(--destructive))"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
