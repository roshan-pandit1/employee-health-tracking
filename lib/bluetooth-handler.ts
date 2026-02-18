// Real-time Bluetooth data handler using WebSocket
import { NextRequest } from 'next/server'
import { SmartWatchDataPacket, processSmartwatchData } from '@/lib/smartwatch-service'
import { SmartwatchSyncPayloadSchema } from '@/lib/smartwatch-schemas'

/**
 * Simulates Bluetooth device data stream
 * In production, this would connect to actual Bluetooth devices
 */
export class BluetoothStreamHandler {
  private listeners: Map<string, Set<(data: any) => void>> = new Map()

  /**
   * Subscribe to Bluetooth data stream for an employee
   */
  subscribe(employeeId: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(employeeId)) {
      this.listeners.set(employeeId, new Set())
    }
    this.listeners.get(employeeId)?.add(callback)

    // Return unsubscribe function
    return () => {
      this.listeners.get(employeeId)?.delete(callback)
      if (this.listeners.get(employeeId)?.size === 0) {
        this.listeners.delete(employeeId)
      }
    }
  }

  /**
   * Send smartwatch data through the stream
   */
  sendData(employeeId: string, data: any) {
    const callbacks = this.listeners.get(employeeId)
    if (callbacks) {
      callbacks.forEach((cb) => cb(data))
    }
  }

  /**
   * Close stream for an employee
   */
  closeStream(employeeId: string) {
    this.listeners.delete(employeeId)
  }
}

/**
 * Parse and validate incoming smartwatch payload
 */
export async function parseSmartWatchPayload(body: any): Promise<SmartWatchDataPacket> {
  const validated = SmartwatchSyncPayloadSchema.parse(body)

  const startTime = Date.now()

  return {
    deviceId: validated.deviceId,
    employeeId: validated.employeeId,
    vitals: validated.readings.map((reading) => ({
      ...reading,
      timestamp: typeof reading.timestamp === 'string' ? new Date(reading.timestamp) : reading.timestamp,
    })),
    syncedAt: typeof validated.syncedAt === 'string' ? new Date(validated.syncedAt) : validated.syncedAt,
    duration: Date.now() - startTime,
  }
}

/**
 * Simulate real-time Bluetooth data collection
 * In production, this would interface with actual Bluetooth libraries
 */
export async function simulateBluetoothDataCollection(employeeId: string) {
  const vitals = {
    heartRate: Math.round(60 + Math.random() * 40),
    bloodOxygen: Math.round(95 + Math.random() * 5),
    steps: Math.round(Math.random() * 100),
    stressLevel: Math.round(Math.random() * 100),
    temperature: +(98.6 + (Math.random() - 0.5) * 2).toFixed(1),
    caloriesBurned: Math.round(50 + Math.random() * 200),
  }

  const packet: SmartWatchDataPacket = {
    deviceId: `device-${employeeId}`,
    employeeId,
    vitals: [
      {
        ...vitals,
        timestamp: new Date(),
      },
    ],
    syncedAt: new Date(),
    duration: Math.random() * 1000,
  }

  return packet
}
