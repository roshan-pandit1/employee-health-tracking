import { db } from './db'

// Get all employees with optional filtering
export async function getAllEmployees(filters?: { department?: string }) {
  return db.employee.findMany({
    where: filters?.department ? { department: filters.department } : undefined,
    include: {
      alerts: {
        take: 5,
        orderBy: { timestamp: 'desc' },
      },
      burnoutScores: {
        take: 1,
        orderBy: { timestamp: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

// Get employee by ID
export async function getEmployeeById(id: string) {
  return db.employee.findUnique({
    where: { id },
    include: {
      vitals: {
        orderBy: { timestamp: 'desc' },
        take: 100,
      },
      alerts: {
        orderBy: { timestamp: 'desc' },
        take: 20,
      },
      burnoutScores: {
        orderBy: { timestamp: 'desc' },
        take: 10,
      },
    },
  })
}

// Create new employee
export async function createEmployee(data: {
  name: string
  email: string
  role: string
  department: string
  avatar?: string
  age?: number
}) {
  return db.employee.create({
    data,
  })
}

// Update employee
export async function updateEmployee(
  id: string,
  data: Partial<{
    name?: string
    email?: string
    role?: string
    department?: string
    avatar?: string | null
    age?: number | null
    watchConnected?: boolean
    lastSync?: Date
  }>
) {
  return db.employee.update({
    where: { id },
    data,
  })
}

// Delete employee
export async function deleteEmployee(id: string) {
  return db.employee.delete({
    where: { id },
  })
}

// Get all alerts with optional filtering
export async function getAllAlerts(filters?: {
  severity?: string
  acknowledged?: boolean
  employeeId?: string
}) {
  return db.alert.findMany({
    where: {
      ...(filters?.severity && { severity: filters.severity }),
      ...(filters?.acknowledged !== undefined && { acknowledged: filters.acknowledged }),
      ...(filters?.employeeId && { employeeId: filters.employeeId }),
    },
    include: {
      employee: {
        select: { id: true, name: true, department: true },
      },
    },
    orderBy: { timestamp: 'desc' },
  })
}

// Get alert by ID
export async function getAlertById(id: string) {
  return db.alert.findUnique({
    where: { id },
    include: {
      employee: {
        select: { id: true, name: true, email: true, department: true },
      },
    },
  })
}

// Acknowledge alert
export async function acknowledgeAlert(id: string) {
  return db.alert.update({
    where: { id },
    data: {
      acknowledged: true,
      acknowledgedAt: new Date(),
    },
  })
}

// Delete alert
export async function deleteAlert(id: string) {
  return db.alert.delete({
    where: { id },
  })
}

// Get employee vitals
export async function getEmployeeVitals(
  employeeId: string,
  options?: { hours?: number; limit?: number }
) {
  const hoursToRetrieve = options?.hours || 24
  const limit = options?.limit || 100

  const since = new Date()
  since.setHours(since.getHours() - hoursToRetrieve)

  return db.vitalReading.findMany({
    where: {
      employeeId,
      timestamp: {
        gte: since,
      },
    },
    orderBy: { timestamp: 'desc' },
    take: limit,
  })
}

// Record new vital reading
export async function recordVitalReading(
  employeeId: string,
  data: {
    heartRate?: number
    bloodOxygen?: number
    steps?: number
    sleepHours?: number
    sleepQuality?: number
    stressLevel?: number
    temperature?: number
    caloriesBurned?: number
  }
) {
  return db.vitalReading.create({
    data: {
      employeeId,
      ...data,
    },
  })
}

// Get health summary
export async function getHealthSummary() {
  const employees = await db.employee.findMany({
    include: {
      alerts: true,
      burnoutScores: {
        orderBy: { timestamp: 'desc' },
        take: 1,
      },
    },
  })

  const alerts = await db.alert.findMany({})

  const departments = [
    ...new Set(employees.map((e: typeof employees[number]) => e.department)),
  ]

  const stats = {
    totalEmployees: employees.length,
    connectedWatches: employees.filter((e: typeof employees[number]) => e.watchConnected).length,
    healthStatus: {
      critical: employees.filter((e: typeof employees[number]) => {
        const latest = e.burnoutScores[0]
        return latest?.risk === 'critical'
      }).length,
      high: employees.filter((e: typeof employees[number]) => {
        const latest = e.burnoutScores[0]
        return latest?.risk === 'high'
      }).length,
      moderate: employees.filter((e: typeof employees[number]) => {
        const latest = e.burnoutScores[0]
        return latest?.risk === 'moderate'
      }).length,
      low: employees.filter((e: typeof employees[number]) => {
        const latest = e.burnoutScores[0]
        return !latest || latest.risk === 'low'
      }).length,
    },
    alerts: {
      total: alerts.length,
      critical: alerts.filter((a: typeof alerts[number]) => a.severity === 'critical').length,
      warning: alerts.filter((a: typeof alerts[number]) => a.severity === 'warning').length,
      acknowledged: alerts.filter((a: typeof alerts[number]) => a.acknowledged).length,
    },
    departments: departments.length,
  }

  return stats
}

// Get burnout trend for employee
export async function getEmployeeBurnoutTrend(employeeId: string, days: number = 7) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  return db.burnoutScore.findMany({
    where: {
      employeeId,
      timestamp: {
        gte: since,
      },
    },
    orderBy: { timestamp: 'asc' },
  })
}

// Get department stats
export async function getDepartmentStats() {
  const employees = await db.employee.findMany({
    include: {
      vitals: {
        orderBy: { timestamp: 'desc' },
        take: 1,
      },
      burnoutScores: {
        orderBy: { timestamp: 'desc' },
        take: 1,
      },
    },
  })

  const departments: Record<string, any> = {}

  employees.forEach((emp: typeof employees[number]) => {
    if (!departments[emp.department]) {
      departments[emp.department] = {
        name: emp.department,
        totalEmployees: 0,
        connectedWatches: 0,
        riskLevels: { critical: 0, high: 0, moderate: 0, low: 0 },
        avgHeartRate: 0,
        avgStress: 0,
      }
    }

    const dept = departments[emp.department]
    dept.totalEmployees++
    if (emp.watchConnected) dept.connectedWatches++

    if (emp.burnoutScores.length > 0) {
      const risk = emp.burnoutScores[0].risk
      if (risk in dept.riskLevels) {
        dept.riskLevels[risk as keyof typeof dept.riskLevels]++
      }
    }
  })

  return Object.values(departments)
}
