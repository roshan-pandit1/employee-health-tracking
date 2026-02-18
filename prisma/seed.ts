import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with sample data...')

  // Clear existing data
  await prisma.alert.deleteMany({})
  await prisma.burnoutScore.deleteMany({})
  await prisma.vitalReading.deleteMany({})
  await prisma.employee.deleteMany({})
  await prisma.smartwatchSync.deleteMany({})

  // Create sample employees
  const employees = await Promise.all([
    prisma.employee.create({
      data: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        role: 'Software Engineer',
        department: 'Engineering',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        age: 28,
        watchConnected: true,
        lastSync: new Date(),
      },
    }),
    prisma.employee.create({
      data: {
        name: 'Michael Chen',
        email: 'michael.chen@company.com',
        role: 'Product Manager',
        department: 'Product',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
        age: 35,
        watchConnected: true,
        lastSync: new Date(),
      },
    }),
    prisma.employee.create({
      data: {
        name: 'Emma Rodriguez',
        email: 'emma.rodriguez@company.com',
        role: 'Designer',
        department: 'Design',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        age: 26,
        watchConnected: true,
        lastSync: new Date(),
      },
    }),
    prisma.employee.create({
      data: {
        name: 'James Wilson',
        email: 'james.wilson@company.com',
        role: 'Senior Engineer',
        department: 'Engineering',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        age: 42,
        watchConnected: false,
        lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
    }),
    prisma.employee.create({
      data: {
        name: 'Lisa Park',
        email: 'lisa.park@company.com',
        role: 'Marketing Manager',
        department: 'Marketing',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
        age: 31,
        watchConnected: true,
        lastSync: new Date(),
      },
    }),
  ])

  console.log(`✅ Created ${employees.length} employees`)

  // Create sample vital readings
  for (const employee of employees) {
    const vitalReadings = []
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date()
      timestamp.setHours(timestamp.getHours() - i)

      vitalReadings.push({
        employeeId: employee.id,
        heartRate: Math.round(60 + Math.random() * 30),
        bloodOxygen: Math.round(95 + Math.random() * 5),
        steps: Math.round(Math.random() * 500),
        sleepHours: i === 0 ? +(6 + Math.random() * 3).toFixed(1) : null,
        sleepQuality: i === 0 ? Math.round(50 + Math.random() * 50) : null,
        stressLevel: Math.round(20 + Math.random() * 60),
        temperature: +(98.6 + (Math.random() - 0.5) * 2).toFixed(1),
        caloriesBurned: Math.round(50 + Math.random() * 150),
        timestamp,
      })
    }

    await prisma.vitalReading.createMany({
      data: vitalReadings,
    })
  }

  console.log('✅ Created vital readings')

  // Create sample alerts (for employees with concerning vitals)
  const alerts = [
    {
      employeeId: employees[0].id,
      type: 'sleep',
      severity: 'warning',
      message: 'Only 4.5 hours of sleep recorded last night.',
      suggestion: 'Recommend lighter workload today and earlier bedtime tonight.',
    },
    {
      employeeId: employees[1].id,
      type: 'stress',
      severity: 'warning',
      message: 'Stress level elevated at 72/100. Sustained high stress detected.',
      suggestion: 'Take a 10-minute break. Try deep breathing exercises.',
    },
    {
      employeeId: employees[2].id,
      type: 'heart_rate',
      severity: 'critical',
      message: 'Resting heart rate elevated at 98 bpm.',
      suggestion: 'Consider taking a break. Monitor heart rate and seek medical advice if it continues.',
    },
    {
      employeeId: employees[3].id,
      type: 'burnout',
      severity: 'critical',
      message: 'Critical burnout risk detected.',
      suggestion: 'Immediate intervention recommended. Consider mandatory time off.',
    },
    {
      employeeId: employees[4].id,
      type: 'blood_oxygen',
      severity: 'warning',
      message: 'Blood oxygen at 93%, slightly below healthy threshold.',
      suggestion: 'Ensure proper ventilation. Monitor oxygen levels.',
    },
  ]

  for (const alert of alerts) {
    await prisma.alert.create({
      data: {
        ...alert,
        timestamp: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000), // Within last 2 hours
      },
    })
  }

  console.log(`✅ Created ${alerts.length} alerts`)

  // Create burnout scores
  for (const employee of employees) {
    for (let i = 6; i >= 0; i--) {
      const timestamp = new Date()
      timestamp.setDate(timestamp.getDate() - i)

      await prisma.burnoutScore.create({
        data: {
          employeeId: employee.id,
          score: Math.round(20 + Math.random() * 70),
          risk:
            Math.random() > 0.7
              ? 'critical'
              : Math.random() > 0.6
                ? 'high'
                : Math.random() > 0.4
                  ? 'moderate'
                  : 'low',
          fatigueScore: Math.round(20 + Math.random() * 60),
          stressScore: Math.round(20 + Math.random() * 80),
          sleepScore: Math.round(30 + Math.random() * 70),
          timestamp,
        },
      })
    }
  }

  console.log('✅ Created burnout scores')

  console.log('🎉 Database seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
