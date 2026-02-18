"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Bell,
  Activity,
  Watch,
  Heart,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getAllAlerts } from "@/lib/health-data"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/employees", label: "Employees", icon: Users },
  { href: "/alerts", label: "Alerts", icon: Bell },
]

export function AppSidebar() {
  const pathname = usePathname()
  const alerts = getAllAlerts()
  const criticalCount = alerts.filter((a) => a.severity === "critical").length

  return (
    <aside className="flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[hsl(var(--primary))]">
          <Heart className="h-5 w-5 text-[hsl(var(--primary-foreground))]" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-[hsl(var(--sidebar-accent-foreground))]">XYZ HealthPulse</h1>
          <p className="text-xs text-sidebar-foreground/60">Employee Wellness</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
          Overview
        </p>
        {navItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-[hsl(var(--sidebar-primary))]"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.label === "Alerts" && criticalCount > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[hsl(var(--destructive))] px-1.5 text-[10px] font-bold text-[hsl(var(--destructive-foreground))]">
                  {criticalCount}
                </span>
              )}
            </Link>
          )
        })}

        <div className="my-4 border-t border-sidebar-border" />

        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
          Integrations
        </p>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/60">
          <Watch className="h-4 w-4" />
          <span>Smartwatch API</span>
          <span className="ml-auto h-2 w-2 rounded-full bg-[hsl(var(--success))]" />
        </div>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/60">
          <Activity className="h-4 w-4" />
          <span>Health Analytics</span>
          <span className="ml-auto h-2 w-2 rounded-full bg-[hsl(var(--success))]" />
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-accent-foreground truncate">Admin User</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">admin@xyz-corp.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
