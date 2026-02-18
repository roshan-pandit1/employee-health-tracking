// Simulated smartwatch health data for XYZ Company employees

export type HealthStatus = "healthy" | "warning" | "critical"

export interface VitalReading {
  time: string
  value: number
}

export interface Employee {
  id: string
  name: string
  role: string
  department: string
  avatar: string
  age: number
  joinDate: string
  watchConnected: boolean
  lastSync: string
  vitals: {
    heartRate: number
    heartRateHistory: VitalReading[]
    bloodOxygen: number
    bloodOxygenHistory: VitalReading[]
    steps: number
    stepsGoal: number
    stepsHistory: VitalReading[]
    sleepHours: number
    sleepQuality: number
    sleepHistory: VitalReading[]
    stressLevel: number
    stressHistory: VitalReading[]
    temperature: number
    caloriesBurned: number
  }
  fatigue: {
    score: number
    trend: "improving" | "stable" | "worsening"
    factors: string[]
  }
  burnout: {
    score: number
    risk: "low" | "moderate" | "high" | "critical"
    weeklyTrend: number[]
  }
  status: HealthStatus
  alerts: Alert[]
}

export interface Alert {
  id: string
  employeeId: string
  employeeName: string
  type: "heart_rate" | "blood_oxygen" | "sleep" | "stress" | "fatigue" | "burnout" | "temperature"
  severity: "info" | "warning" | "critical"
  message: string
  timestamp: string
  acknowledged: boolean
  suggestion: string
}

function generateHistory(base: number, variance: number, count: number): VitalReading[] {
  const hours = []
  for (let i = count - 1; i >= 0; i--) {
    const h = new Date()
    h.setHours(h.getHours() - i)
    hours.push({
      time: h.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      value: Math.round(base + (Math.random() - 0.5) * variance * 2),
    })
  }
  return hours
}

function generateSleepHistory(): VitalReading[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return days.map((d) => ({
    time: d,
    value: +(4 + Math.random() * 5).toFixed(1),
  }))
}

function generateStepsHistory(): VitalReading[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return days.map((d) => ({
    time: d,
    value: Math.round(2000 + Math.random() * 10000),
  }))
}

function generateRandomVitals() {
  // Generate more realistic health data - biased toward normal/healthy ranges
  // Most employees should be healthy, with only some warnings and few critical cases
  
  // Heart rate: Normal range 60-100, with some variation
  const heartRate = Math.floor(60 + Math.random() * 40 + (Math.random() > 0.8 ? Math.random() * 20 : 0))
  
  // Blood oxygen: Normal range 95-100, rarely below 93
  const bloodOxygen = Math.floor(95 + Math.random() * 5 + (Math.random() > 0.9 ? -Math.random() * 5 : 0))
  
  // Steps: Normal range 2000-12000, with some low activity days
  const steps = Math.floor(2000 + Math.random() * 10000)
  
  // Sleep hours: Normal range 6-9, with some variation
  const sleepHours = +(6 + Math.random() * 3 + (Math.random() > 0.85 ? -Math.random() * 2 : 0)).toFixed(1)
  
  // Sleep quality: Normal range 70-95, with some poor sleep nights
  const sleepQuality = Math.floor(70 + Math.random() * 25 + (Math.random() > 0.8 ? -Math.random() * 30 : 0))
  
  // Stress level: Normal range 20-60, with some high stress cases
  const stressLevel = Math.floor(20 + Math.random() * 40 + (Math.random() > 0.75 ? Math.random() * 30 : 0))
  
  // Temperature: Normal range 97.5-99.5
  const temperature = +(97.5 + Math.random() * 2).toFixed(1)
  
  // Calories burned: Based on steps and activity
  const caloriesBurned = Math.floor(800 + (steps / 1000) * 100 + Math.random() * 400)

  return {
    heartRate,
    heartRateHistory: generateHistory(heartRate, 8, 12),
    bloodOxygen,
    bloodOxygenHistory: generateHistory(bloodOxygen, 1, 12),
    steps,
    stepsGoal: 10000,
    stepsHistory: generateStepsHistory(),
    sleepHours,
    sleepQuality,
    sleepHistory: generateSleepHistory(),
    stressLevel,
    stressHistory: generateHistory(stressLevel, 12, 12),
    temperature,
    caloriesBurned,
  }
}

export function calculateFatigueScore(employee: {
  vitals: { sleepHours: number; sleepQuality: number; stressLevel: number; heartRate: number; steps: number }
}): number {
  const { sleepHours, sleepQuality, stressLevel, heartRate, steps } = employee.vitals
  let score = 0
  // Sleep factor (0-30)
  if (sleepHours < 5) score += 30
  else if (sleepHours < 6) score += 22
  else if (sleepHours < 7) score += 12
  else score += 5
  // Sleep quality factor (0-20)
  score += Math.round((100 - sleepQuality) * 0.2)
  // Stress factor (0-25)
  score += Math.round(stressLevel * 0.25)
  // Heart rate factor (0-15)
  if (heartRate > 100) score += 15
  else if (heartRate > 90) score += 10
  else if (heartRate > 80) score += 5
  // Activity factor (0-10)
  if (steps < 2000) score += 10
  else if (steps < 4000) score += 6
  else if (steps < 6000) score += 3
  return Math.min(100, Math.max(0, score))
}

export function calculateBurnoutRisk(fatigue: number, stressHistory: VitalReading[]): "low" | "moderate" | "high" | "critical" {
  const avgStress = stressHistory.reduce((s, v) => s + v.value, 0) / stressHistory.length
  const combined = fatigue * 0.6 + avgStress * 0.4
  if (combined > 75) return "critical"
  if (combined > 55) return "high"
  if (combined > 35) return "moderate"
  return "low"
}

export function getSuggestions(employee: Employee): string[] {
  const suggestions: string[] = []
  const { vitals, fatigue, burnout } = employee
  if (vitals.sleepHours < 6) {
    suggestions.push("Aim for at least 7-8 hours of sleep. Consider setting a consistent bedtime routine.")
  }
  if (vitals.stressLevel > 70) {
    suggestions.push("High stress detected. Try 10 minutes of deep breathing or a short walk.")
  }
  if (vitals.heartRate > 95) {
    suggestions.push("Elevated resting heart rate. Consider reducing caffeine and taking regular breaks.")
  }
  if (vitals.steps < 4000) {
    suggestions.push("Low physical activity today. A 15-minute walk can significantly improve energy levels.")
  }
  if (vitals.bloodOxygen < 95) {
    suggestions.push("Blood oxygen is slightly low. Ensure good ventilation and practice deep breathing exercises.")
  }
  if (fatigue.score > 60) {
    suggestions.push("Fatigue level is high. Take a 20-minute power nap if possible, or switch to lighter tasks.")
  }
  if (burnout.risk === "high" || burnout.risk === "critical") {
    suggestions.push("Burnout risk is elevated. Consider scheduling time off or speaking with a wellness counselor.")
  }
  if (vitals.sleepQuality < 50) {
    suggestions.push("Sleep quality is poor. Avoid screens 1 hour before bed and keep your bedroom cool and dark.")
  }
  if (suggestions.length === 0) {
    suggestions.push("Great health metrics! Keep maintaining your current healthy habits.")
    suggestions.push("Stay hydrated throughout the day and continue your regular exercise routine.")
  }
  return suggestions
}

const employeesRaw: Omit<Employee, "fatigue" | "burnout" | "status" | "alerts">[] = [
  {
    id: "emp-001",
    name: "Sarah Chen",
    role: "Senior Developer",
    department: "Engineering",
    avatar: "SC",
    age: 32,
    joinDate: "2022-03-15",
    watchConnected: true,
    lastSync: "2 min ago",
    vitals: generateRandomVitals(),
  },
  {
    id: "emp-002",
    name: "Marcus Johnson",
    role: "Product Manager",
    department: "Product",
    avatar: "MJ",
    age: 28,
    joinDate: "2023-01-10",
    watchConnected: true,
    lastSync: "5 min ago",
    vitals: generateRandomVitals(),
  },
  {
    id: "emp-003",
    name: "Emily Rodriguez",
    role: "UX Designer",
    department: "Design",
    avatar: "ER",
    age: 35,
    joinDate: "2021-07-20",
    watchConnected: true,
    lastSync: "1 min ago",
    vitals: generateRandomVitals(),
  },
  {
    id: "emp-004",
    name: "David Kim",
    role: "Data Analyst",
    department: "Analytics",
    avatar: "DK",
    age: 30,
    joinDate: "2023-05-01",
    watchConnected: true,
    lastSync: "8 min ago",
    vitals: generateRandomVitals(),
  },
  {
    id: "emp-005",
    name: "Lisa Thompson",
    role: "Marketing Lead",
    department: "Marketing",
    avatar: "LT",
    age: 41,
    joinDate: "2020-11-30",
    watchConnected: true,
    lastSync: "3 min ago",
    vitals: generateRandomVitals(),
  },
  {
    id: "emp-006",
    name: "James Wright",
    role: "DevOps Engineer",
    department: "Engineering",
    avatar: "JW",
    age: 37,
    joinDate: "2022-09-12",
    watchConnected: true,
    lastSync: "1 min ago",
    vitals: generateRandomVitals(),
  },
  {
    id: "emp-007",
    name: "Priya Patel",
    role: "HR Specialist",
    department: "Human Resources",
    avatar: "PP",
    age: 29,
    joinDate: "2023-08-05",
    watchConnected: false,
    lastSync: "2 hours ago",
    vitals: generateRandomVitals(),
  },
  {
    id: "emp-008",
    name: "Alex Martinez",
    role: "QA Engineer",
    department: "Engineering",
    avatar: "AM",
    age: 33,
    joinDate: "2022-02-18",
    watchConnected: true,
    lastSync: "4 min ago",
    vitals: generateRandomVitals(),
  },
]

function generateAlerts(emp: Employee): Alert[] {
  const alerts: Alert[] = []
  if (emp.vitals.heartRate > 95) {
    alerts.push({
      id: `alert-${emp.id}-hr`,
      employeeId: emp.id,
      employeeName: emp.name,
      type: "heart_rate",
      severity: emp.vitals.heartRate > 100 ? "critical" : "warning",
      message: `Resting heart rate is ${emp.vitals.heartRate} BPM, above normal range.`,
      timestamp: "5 min ago",
      acknowledged: false,
      suggestion: "Encourage a break and monitor. If persistent, recommend a medical check-up.",
    })
  }
  if (emp.vitals.bloodOxygen < 95) {
    alerts.push({
      id: `alert-${emp.id}-bo`,
      employeeId: emp.id,
      employeeName: emp.name,
      type: "blood_oxygen",
      severity: emp.vitals.bloodOxygen < 92 ? "critical" : "warning",
      message: `Blood oxygen at ${emp.vitals.bloodOxygen}%, below healthy threshold.`,
      timestamp: "10 min ago",
      acknowledged: false,
      suggestion: "Ensure proper ventilation. If below 90%, seek immediate medical attention.",
    })
  }
  if (emp.vitals.sleepHours < 5) {
    alerts.push({
      id: `alert-${emp.id}-sl`,
      employeeId: emp.id,
      employeeName: emp.name,
      type: "sleep",
      severity: "warning",
      message: `Only ${emp.vitals.sleepHours} hours of sleep recorded last night.`,
      timestamp: "1 hour ago",
      acknowledged: false,
      suggestion: "Suggest lighter workload today and recommend earlier bedtime tonight.",
    })
  }
  if (emp.burnout.risk === "critical") {
    alerts.push({
      id: `alert-${emp.id}-bo-risk`,
      employeeId: emp.id,
      employeeName: emp.name,
      type: "burnout",
      severity: "critical",
      message: `Critical burnout risk detected. Multiple health indicators are concerning.`,
      timestamp: "15 min ago",
      acknowledged: false,
      suggestion: "Immediate intervention recommended. Consider mandatory time off and wellness counseling.",
    })
  } else if (emp.burnout.risk === "high") {
    alerts.push({
      id: `alert-${emp.id}-bo-high`,
      employeeId: emp.id,
      employeeName: emp.name,
      type: "burnout",
      severity: "warning",
      message: `High burnout risk detected. Fatigue and stress levels are elevated.`,
      timestamp: "30 min ago",
      acknowledged: false,
      suggestion: "Schedule a wellness check-in and consider workload adjustments.",
    })
  }
  if (emp.vitals.temperature > 99.0) {
    alerts.push({
      id: `alert-${emp.id}-temp`,
      employeeId: emp.id,
      employeeName: emp.name,
      type: "temperature",
      severity: emp.vitals.temperature > 100 ? "critical" : "warning",
      message: `Body temperature at ${emp.vitals.temperature}°F, slightly elevated.`,
      timestamp: "20 min ago",
      acknowledged: false,
      suggestion: "Monitor temperature. If it continues to rise, recommend staying home.",
    })
  }
  return alerts
}

export function getEmployees(): Employee[] {
  return employeesRaw.map((raw) => {
    const fatigueScore = calculateFatigueScore(raw)
    const burnoutRisk = calculateBurnoutRisk(fatigueScore, raw.vitals.stressHistory)
    const fatigue = {
      score: fatigueScore,
      trend: fatigueScore > 60 ? "worsening" as const : fatigueScore > 30 ? "stable" as const : "improving" as const,
      factors: [] as string[],
    }
    if (raw.vitals.sleepHours < 6) fatigue.factors.push("Poor sleep")
    if (raw.vitals.stressLevel > 60) fatigue.factors.push("High stress")
    if (raw.vitals.steps < 4000) fatigue.factors.push("Low activity")
    if (raw.vitals.heartRate > 90) fatigue.factors.push("Elevated heart rate")

    const burnout = {
      score: fatigueScore * 0.5 + raw.vitals.stressLevel * 0.5,
      risk: burnoutRisk,
      weeklyTrend: Array.from({ length: 7 }, () => Math.round(20 + Math.random() * 60)),
    }

    let status: HealthStatus = "healthy"
    if (burnoutRisk === "critical" || raw.vitals.heartRate > 100 || raw.vitals.bloodOxygen < 93) {
      status = "critical"
    } else if (burnoutRisk === "high" || raw.vitals.sleepHours < 5.5 || raw.vitals.stressLevel > 65) {
      status = "warning"
    }

    const emp: Employee = { ...raw, fatigue, burnout, status, alerts: [] }
    emp.alerts = generateAlerts(emp)
    return emp
  })
}

export function getEmployee(id: string): Employee | undefined {
  return getEmployees().find((e) => e.id === id)
}

export function getAllAlerts(): Alert[] {
  return getEmployees().flatMap((e) => e.alerts).sort((a, b) => {
    const sev = { critical: 0, warning: 1, info: 2 }
    return sev[a.severity] - sev[b.severity]
  })
}

export function getOverviewStats() {
  const employees = getEmployees()
  const total = employees.length
  const healthy = employees.filter((e) => e.status === "healthy").length
  const warning = employees.filter((e) => e.status === "warning").length
  const critical = employees.filter((e) => e.status === "critical").length
  const avgFatigue = Math.round(employees.reduce((s, e) => s + e.fatigue.score, 0) / total)
  const avgStress = Math.round(employees.reduce((s, e) => s + e.vitals.stressLevel, 0) / total)
  const avgSleep = +(employees.reduce((s, e) => s + e.vitals.sleepHours, 0) / total).toFixed(1)
  const connected = employees.filter((e) => e.watchConnected).length
  const totalAlerts = getAllAlerts().length
  const criticalAlerts = getAllAlerts().filter((a) => a.severity === "critical").length
  return { total, healthy, warning, critical, avgFatigue, avgStress, avgSleep, connected, totalAlerts, criticalAlerts }
}
