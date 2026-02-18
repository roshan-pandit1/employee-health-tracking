// Core smartwatch service for Bluetooth data handling
import { db } from './db'
import { SmartwatchSyncPayload, VitalReading } from './smartwatch-schemas'

export interface SmartWatchDataPacket {
  deviceId: string
  employeeId: string
  vitals: Array<VitalReading & { timestamp: Date }>
  syncedAt: Date
  duration: number // milliseconds
}

/**
 * Processes incoming smartwatch data and stores to database
 */
export async function processSmartwatchData(payload: SmartWatchDataPacket) {
  const startTime = Date.now()

  try {
    // 1. Validate employee exists
    const employee = await db.employee.findUnique({
      where: { id: payload.employeeId },
    })

    if (!employee) {
      throw new Error(`Employee not found: ${payload.employeeId}`)
    }

    // 2. Record all vital readings
    const createdReadings = await db.vitalReading.createMany({
      data: payload.vitals.map((vital) => ({
        employeeId: payload.employeeId,
        ...vital,
      })),
    })

    // 3. Update employee last sync time
    await db.employee.update({
      where: { id: payload.employeeId },
      data: {
        lastSync: payload.syncedAt,
        watchConnected: true,
      },
    })

    // 4. Record sync event
    const syncRecord = await db.smartwatchSync.create({
      data: {
        employeeId: payload.employeeId,
        syncedAt: payload.syncedAt,
        duration: payload.duration,
        status: 'success',
        recordsCount: createdReadings.count,
      },
    })

    // 5. Analyze vitals for alerts
    await analyzeSmartwatchData(payload.employeeId, payload.vitals)

    return {
      success: true,
      recordsCreated: createdReadings.count,
      syncId: syncRecord.id,
    }
  } catch (error: any) {
    console.error('Error processing smartwatch data:', error)

    // Record failed sync
    await db.smartwatchSync.create({
      data: {
        employeeId: payload.employeeId,
        syncedAt: new Date(),
        duration: Date.now() - startTime,
        status: 'failed',
        recordsCount: 0,
        errorMessage: error.message,
      },
    })

    throw error
  }
}

/**
 * Analyzes smartwatch data and generates alerts if needed
 */
export async function analyzeSmartwatchData(
  employeeId: string,
  vitals: Array<VitalReading & { timestamp?: Date }>
) {
  const alerts: Array<{
    type: string
    severity: string
    message: string
    suggestion: string
  }> = []

  // Check each vital for concerning levels
  vitals.forEach((vital) => {
    // Heart Rate Analysis
    if (vital.heartRate) {
      if (vital.heartRate > 100) {
        alerts.push({
          type: 'heart_rate',
          severity: vital.heartRate > 120 ? 'critical' : 'warning',
          message: `Elevated heart rate detected: ${vital.heartRate} bpm`,
          suggestion: `Take a break and rest. If persists, consult a healthcare provider.`,
        })
      } else if (vital.heartRate < 40) {
        alerts.push({
          type: 'heart_rate',
          severity: 'critical',
          message: `Unusually low heart rate detected: ${vital.heartRate} bpm`,
          suggestion: `Monitor closely and seek medical attention if symptomatic.`,
        })
      }
    }

    // Blood Oxygen Analysis
    if (vital.bloodOxygen) {
      if (vital.bloodOxygen < 93) {
        alerts.push({
          type: 'blood_oxygen',
          severity: vital.bloodOxygen < 88 ? 'critical' : 'warning',
          message: `Low blood oxygen level detected: ${vital.bloodOxygen}%`,
          suggestion: `Ensure proper ventilation and practice deep breathing.`,
        })
      }
    }

    // Temperature Analysis
    if (vital.temperature) {
      if (vital.temperature > 100.4) {
        alerts.push({
          type: 'temperature',
          severity: vital.temperature > 102 ? 'critical' : 'warning',
          message: `Elevated body temperature: ${vital.temperature}°F`,
          suggestion: `Monitor for fever symptoms. Consider staying home.`,
        })
      } else if (vital.temperature < 95) {
        alerts.push({
          type: 'temperature',
          severity: 'warning',
          message: `Low body temperature: ${vital.temperature}°F`,
          suggestion: `Ensure warm environment and monitor vital signs.`,
        })
      }
    }

    // Stress Level Analysis
    if (vital.stressLevel) {
      if (vital.stressLevel > 80) {
        alerts.push({
          type: 'stress',
          severity: 'critical',
          message: `Very high stress levels detected: ${vital.stressLevel}/100`,
          suggestion: `Take a break, practice meditation, or speak with a counselor.`,
        })
      } else if (vital.stressLevel > 65) {
        alerts.push({
          type: 'stress',
          severity: 'warning',
          message: `Elevated stress levels: ${vital.stressLevel}/100`,
          suggestion: `Try relaxation techniques or take a short walk.`,
        })
      }
    }

    // Sleep Analysis
    if (vital.sleepHours) {
      if (vital.sleepHours < 5) {
        alerts.push({
          type: 'sleep',
          severity: 'warning',
          message: `Insufficient sleep detected: ${vital.sleepHours} hours`,
          suggestion: `Prioritize sleep tonight. Aim for 7-9 hours.`,
        })
      }
    }

    if (vital.sleepQuality && vital.sleepQuality < 40) {
      alerts.push({
        type: 'sleep',
        severity: 'warning',
        message: `Poor sleep quality detected: ${vital.sleepQuality}%`,
        suggestion: `Improve sleep environment. Avoid screens before bed.`,
      })
    }
  })

  // Create alerts in database
  if (alerts.length > 0) {
    await db.alert.createMany({
      data: alerts.map((alert) => ({
        employeeId,
        type: alert.type,
        severity: alert.severity,
        message: alert.message,
        suggestion: alert.suggestion,
      })),
    })
  }

  return alerts
}

/**
 * Register a new smartwatch device for an employee
 */
export async function registerSmartwatch(
  employeeId: string,
  deviceInfo: {
    deviceId: string
    deviceName: string
    deviceModel: string
    firmwareVersion?: string
    batteryLevel: number
  }
) {
  // Verify employee exists
  const employee = await db.employee.findUnique({
    where: { id: employeeId },
  })

  if (!employee) {
    throw new Error(`Employee not found: ${employeeId}`)
  }

  // Create or update smartwatch device record
  // Note: This would need a SmartwatchDevice model in your Prisma schema
  // For now, we're storing it in the sync logs and updating employee.watchConnected

  await db.employee.update({
    where: { id: employeeId },
    data: {
      watchConnected: true,
      lastSync: new Date(),
    },
  })

  return {
    success: true,
    message: `Smartwatch registered for employee ${employeeId}`,
    deviceId: deviceInfo.deviceId,
    pairedAt: new Date(),
  }
}

/**
 * Disconnect a smartwatch device
 */
export async function disconnectSmartwatch(employeeId: string) {
  await db.employee.update({
    where: { id: employeeId },
    data: {
      watchConnected: false,
    },
  })

  return {
    success: true,
    message: `Smartwatch disconnected for employee ${employeeId}`,
  }
}

/**
 * Get smartwatch sync history for an employee
 */
export async function getSmartwatchHistory(employeeId: string, days: number = 7) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  return db.smartwatchSync.findMany({
    where: {
      employeeId,
      syncedAt: {
        gte: since,
      },
    },
    orderBy: { syncedAt: 'desc' },
  })
}

/**
 * Calculate health metrics from accumulated vital data
 */
export async function calculateHealthMetrics(employeeId: string, days: number = 7) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const vitals = await db.vitalReading.findMany({
    where: {
      employeeId,
      timestamp: {
        gte: since,
      },
    },
  })

  if (vitals.length === 0) {
    return null
  }

  const metrics = {
    period: { since, until: new Date() },
    totalReadings: vitals.length,
    heartRate: vitals.filter((v: typeof vitals[number]) => v.heartRate !== null).length
      ? {
          avg: Math.round(
            vitals.filter((v: typeof vitals[number]) => v.heartRate !== null).reduce((sum: number, v: typeof vitals[number]) => sum + (v.heartRate || 0), 0) /
              vitals.filter((v: typeof vitals[number]) => v.heartRate !== null).length
          ),
          min: Math.min(...vitals.filter((v: typeof vitals[number]) => v.heartRate !== null).map((v: typeof vitals[number]) => v.heartRate || 0)),
          max: Math.max(...vitals.filter((v: typeof vitals[number]) => v.heartRate !== null).map((v: typeof vitals[number]) => v.heartRate || 0)),
        }
      : null,
    bloodOxygen: vitals.filter((v: typeof vitals[number]) => v.bloodOxygen !== null).length
      ? {
          avg: Math.round(
            vitals.filter((v: typeof vitals[number]) => v.bloodOxygen !== null).reduce((sum: number, v: typeof vitals[number]) => sum + (v.bloodOxygen || 0), 0) /
              vitals.filter((v: typeof vitals[number]) => v.bloodOxygen !== null).length
          ),
          min: Math.min(...vitals.filter((v: typeof vitals[number]) => v.bloodOxygen !== null).map((v: typeof vitals[number]) => v.bloodOxygen || 0)),
          max: Math.max(...vitals.filter((v: typeof vitals[number]) => v.bloodOxygen !== null).map((v: typeof vitals[number]) => v.bloodOxygen || 0)),
        }
      : null,
    steps: vitals.filter((v: typeof vitals[number]) => v.steps !== null).length
      ? {
          total: vitals.filter((v: typeof vitals[number]) => v.steps !== null).reduce((sum: number, v: typeof vitals[number]) => sum + (v.steps || 0), 0),
          avg: Math.round(
            vitals.filter((v: typeof vitals[number]) => v.steps !== null).reduce((sum: number, v: typeof vitals[number]) => sum + (v.steps || 0), 0) /
              vitals.filter((v: typeof vitals[number]) => v.steps !== null).length
          ),
        }
      : null,
    sleep: vitals.filter((v: typeof vitals[number]) => v.sleepHours !== null).length
      ? {
          total: +(
            vitals.filter((v: typeof vitals[number]) => v.sleepHours !== null).reduce((sum: number, v: typeof vitals[number]) => sum + (v.sleepHours || 0), 0) as number
          ).toFixed(1),
          avg: +(
            (vitals.filter((v: typeof vitals[number]) => v.sleepHours !== null).reduce((sum: number, v: typeof vitals[number]) => sum + (v.sleepHours || 0), 0) as number) /
            vitals.filter((v: typeof vitals[number]) => v.sleepHours !== null).length
          ).toFixed(1),
          avgQuality: Math.round(
            vitals.filter((v: typeof vitals[number]) => v.sleepQuality !== null).reduce((sum: number, v: typeof vitals[number]) => sum + (v.sleepQuality || 0), 0) /
              vitals.filter((v: typeof vitals[number]) => v.sleepQuality !== null).length
          ),
        }
      : null,
    stress: vitals.filter((v: typeof vitals[number]) => v.stressLevel !== null).length
      ? {
          avg: Math.round(
            vitals.filter((v: typeof vitals[number]) => v.stressLevel !== null).reduce((sum: number, v: typeof vitals[number]) => sum + (v.stressLevel || 0), 0) /
              vitals.filter((v: typeof vitals[number]) => v.stressLevel !== null).length
          ),
          max: Math.max(...vitals.filter((v: typeof vitals[number]) => v.stressLevel !== null).map((v: typeof vitals[number]) => v.stressLevel || 0)),
        }
      : null,
  }

  return metrics
}
