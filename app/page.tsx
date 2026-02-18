import { AppShell } from "@/components/app-shell"
import { DashboardOverview } from "@/components/dashboard-overview"
import { LoginCheck } from "@/components/login-check"

export default function Page() {
  return (
    <LoginCheck>
      <AppShell>
        <DashboardOverview />
      </AppShell>
    </LoginCheck>
  )
}
