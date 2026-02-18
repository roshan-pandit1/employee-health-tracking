"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { AppSidebar } from "./app-sidebar"
import { cn } from "@/lib/utils"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AppSidebar />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50">
            <AppSidebar />
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute right-4 top-4 z-50 rounded-lg bg-sidebar p-2 text-sidebar-foreground"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Main content */}
      <div className={cn("lg:pl-64")}>
        {/* Mobile header */}
        <header className="flex items-center gap-4 px-4 py-3 border-b border-border lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 hover:bg-secondary"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          <span className="text-sm font-semibold text-foreground">XYZ HealthPulse</span>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
