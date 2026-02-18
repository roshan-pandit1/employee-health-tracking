import { AppShell } from "@/components/app-shell"
import { EmployeeDetail } from "@/components/employee-detail"
import { getEmployee, getEmployees } from "@/lib/health-data"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return getEmployees().map((e) => ({ id: e.id }))
}

export default async function EmployeeDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const employee = getEmployee(id)
  if (!employee) notFound()

  return (
    <AppShell>
      <EmployeeDetail employee={employee} />
    </AppShell>
  )
}
