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
    vitals: {
      heartRate: 72,
      heartRateHistory: generateHistory(72, 8, 12),
      bloodOxygen: 98,
      bloodOxygenHistory: generateHistory(98, 1, 12),
      steps: 8450,
      stepsGoal: 10000,
      stepsHistory: generateStepsHistory(),
      sleepHours: 7.5,
      sleepQuality: 85,
      sleepHistory: generateSleepHistory(),
      stressLevel: 35,
      stressHistory: generateHistory(35, 12, 12),
      temperature: 98.2,
      caloriesBurned: 1850,
    },
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
    vitals: {
      heartRate: 88,
      heartRateHistory: generateHistory(88, 10, 12),
      bloodOxygen: 96,
      bloodOxygenHistory: generateHistory(96, 2, 12),
      steps: 3200,
      stepsGoal: 10000,
      stepsHistory: generateStepsHistory(),
      sleepHours: 5.2,
      sleepQuality: 42,
      sleepHistory: generateSleepHistory(),
      stressLevel: 72,
      stressHistory: generateHistory(72, 10, 12),
      temperature: 98.6,
      caloriesBurned: 1200,
    },
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
    vitals: {
      heartRate: 68,
      heartRateHistory: generateHistory(68, 6, 12),
      bloodOxygen: 99,
      bloodOxygenHistory: generateHistory(99, 1, 12),
      steps: 11200,
      stepsGoal: 10000,
      stepsHistory: generateStepsHistory(),
      sleepHours: 8.1,
      sleepQuality: 92,
      sleepHistory: generateSleepHistory(),
      stressLevel: 22,
      stressHistory: generateHistory(22, 8, 12),
      temperature: 97.9,
      caloriesBurned: 2100,
    },
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
    vitals: {
      heartRate: 102,
      heartRateHistory: generateHistory(102, 12, 12),
      bloodOxygen: 93,
      bloodOxygenHistory: generateHistory(93, 2, 12),
      steps: 1800,
      stepsGoal: 10000,
      stepsHistory: generateStepsHistory(),
      sleepHours: 4.5,
      sleepQuality: 30,
      sleepHistory: generateSleepHistory(),
      stressLevel: 85,
      stressHistory: generateHistory(85, 8, 12),
      temperature: 99.4,
      caloriesBurned: 900,
    },
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
    vitals: {
      heartRate: 76,
      heartRateHistory: generateHistory(76, 7, 12),
      bloodOxygen: 97,
      bloodOxygenHistory: generateHistory(97, 1, 12),
      steps: 6700,
      stepsGoal: 10000,
      stepsHistory: generateStepsHistory(),
      sleepHours: 6.8,
      sleepQuality: 68,
      sleepHistory: generateSleepHistory(),
      stressLevel: 55,
      stressHistory: generateHistory(55, 15, 12),
      temperature: 98.4,
      caloriesBurned: 1600,
    },
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
    vitals: {
      heartRate: 80,
      heartRateHistory: generateHistory(80, 9, 12),
      bloodOxygen: 97,
      bloodOxygenHistory: generateHistory(97, 1, 12),
      steps: 5200,
      stepsGoal: 10000,
      stepsHistory: generateStepsHistory(),
      sleepHours: 6.2,
      sleepQuality: 55,
      sleepHistory: generateSleepHistory(),
      stressLevel: 62,
      stressHistory: generateHistory(62, 12, 12),
      temperature: 98.5,
      caloriesBurned: 1450,
    },
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
    vitals: {
      heartRate: 70,
      heartRateHistory: generateHistory(70, 5, 12),
      bloodOxygen: 98,
      bloodOxygenHistory: generateHistory(98, 1, 12),
      steps: 7400,
      stepsGoal: 10000,
      stepsHistory: generateStepsHistory(),
      sleepHours: 7.8,
      sleepQuality: 80,
      sleepHistory: generateSleepHistory(),
      stressLevel: 30,
      stressHistory: generateHistory(30, 10, 12),
      temperature: 98.1,
      caloriesBurned: 1700,
    },
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
    vitals: {
      heartRate: 92,
      heartRateHistory: generateHistory(92, 10, 12),
      bloodOxygen: 95,
      bloodOxygenHistory: generateHistory(95, 2, 12),
      steps: 2900,
      stepsGoal: 10000,
      stepsHistory: generateStepsHistory(),
      sleepHours: 5.5,
      sleepQuality: 45,
      sleepHistory: generateSleepHistory(),
      stressLevel: 68,
      stressHistory: generateHistory(68, 10, 12),
      temperature: 98.8,
      caloriesBurned: 1100,
    },
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
