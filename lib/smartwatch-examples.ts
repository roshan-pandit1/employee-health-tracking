// Example usage of the Smartwatch Data Collection System

import {
  processSmartwatchData,
  registerSmartwatch,
  calculateHealthMetrics,
  getSmartwatchHistory,
} from '@/lib/smartwatch-service'
import { parseSmartWatchPayload } from '@/lib/bluetooth-handler'
import { SmartWatchDataPacket } from '@/lib/smartwatch-service'

/**
 * Example 1: Register a new smartwatch device
 */
export async function exampleRegisterDevice() {
  const result = await registerSmartwatch('emp-001', {
    deviceId: 'device-apple-watch-001',
    deviceName: 'Apple Watch Series 8',
    deviceModel: 'A2968',
    firmwareVersion: '10.1.1',
    batteryLevel: 85,
  })

  console.log('Device registered:', result)
  /*
  Output:
  {
    success: true,
    message: 'Smartwatch registered for employee emp-001',
    deviceId: 'device-apple-watch-001',
    pairedAt: 2026-02-17T12:00:00.000Z
  }
  */
}

/**
 * Example 2: Process incoming smartwatch data from Bluetooth
 */
export async function exampleProcessBTData() {
  // Simulating data received from smartwatch via Bluetooth
  const rawBluetoothData = {
    employeeId: 'emp-001',
    deviceId: 'device-apple-watch-001',
    readings: [
      {
        heartRate: 72,
        bloodOxygen: 98,
        steps: 250,
        stressLevel: 45,
        temperature: 98.6,
        caloriesBurned: 125,
        timestamp: new Date('2026-02-17T12:30:00Z'),
      },
      {
        heartRate: 75,
        bloodOxygen: 97,
        steps: 300,
        stressLevel: 48,
        temperature: 98.5,
        caloriesBurned: 135,
        timestamp: new Date('2026-02-17T12:45:00Z'),
      },
    ],
    syncedAt: new Date('2026-02-17T12:46:00Z'),
  }

  // Parse and validate
  const packet = await parseSmartWatchPayload(rawBluetoothData)

  // Process and store to database
  const result = await processSmartwatchData(packet)

  console.log('Smartwatch data processed:', result)
  /*
  Output:
  {
    success: true,
    recordsCreated: 2,
    syncId: 'cljf8x9js000008ju...'
  }
  */
}

/**
 * Example 3: Handle critical health data
 */
export async function exampleCriticalAlert() {
  // Processing data that triggers alerts
  const criticalData: SmartWatchDataPacket = {
    deviceId: 'device-apple-watch-001',
    employeeId: 'emp-002',
    vitals: [
      {
        heartRate: 125, // Critical - above 120
        bloodOxygen: 88, // Critical - below 90
        stressLevel: 85, // Critical - above 80
        temperature: 102.5, // Critical - above 102
        timestamp: new Date(),
      },
    ],
    syncedAt: new Date(),
    duration: 500,
  }

  const result = await processSmartwatchData(criticalData)

  console.log('Critical alerts generated:', result)
  /*
  Automatically creates alerts in the database:
  - Type: heart_rate, Severity: critical
  - Type: blood_oxygen, Severity: critical
  - Type: stress, Severity: critical
  - Type: temperature, Severity: critical
  */
}

/**
 * Example 4: Get health metrics for an employee
 */
export async function exampleGetMetrics() {
  const metrics = await calculateHealthMetrics('emp-001', 7) // Last 7 days

  console.log('Health metrics:', metrics)
  /*
  Output:
  {
    period: { since: 2026-02-10T12:00:00Z, until: 2026-02-17T12:00:00Z },
    totalReadings: 48,
    heartRate: {
      avg: 72,
      min: 60,
      max: 85
    },
    bloodOxygen: {
      avg: 97,
      min: 94,
      max: 99
    },
    steps: {
      total: 45000,
      avg: 6428
    },
    sleep: {
      total: 52.5,
      avg: 7.5,
      avgQuality: 78
    },
    stress: {
      avg: 45,
      max: 62
    }
  }
  */
}

/**
 * Example 5: Get smartwatch sync history
 */
export async function exampleGetHistory() {
  const history = await getSmartwatchHistory('emp-001', 7)

  console.log('Last 7 days of syncs:', history)
  /*
  Output: Array of sync events
  [
    {
      id: 'sync-001',
      employeeId: 'emp-001',
      syncedAt: 2026-02-17T14:30:00Z,
      duration: 523,
      status: 'success',
      recordsCount: 12,
      errorMessage: null
    },
    {
      id: 'sync-002',
      employeeId: 'emp-001',
      syncedAt: 2026-02-17T13:30:00Z,
      duration: 415,
      status: 'success',
      recordsCount: 10,
      errorMessage: null
    },
    ...
  ]
  */
}

/**
 * Example 6: Frontend React component consuming smartwatch data
 */
export function ExampleReactComponent() {
  return (
    <div>
      <h2>Smartwatch Status</h2>

      {/* Register device */}
      <button
        onClick={async () => {
          const response = await fetch('/api/smartwatch/device', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              employeeId: 'emp-001',
              deviceId: 'device-001',
              deviceName: 'My Watch',
              deviceModel: 'Series 8',
              batteryLevel: 85,
            }),
          })
          const data = await response.json()
          console.log('Device registered:', data)
        }}
      >
        Register Watch
      </button>

      {/* Sync data */}
      <button
        onClick={async () => {
          const response = await fetch('/api/smartwatch/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              employeeId: 'emp-001',
              deviceId: 'device-001',
              readings: [
                {
                  heartRate: 72,
                  bloodOxygen: 98,
                  steps: 5000,
                  timestamp: new Date().toISOString(),
                },
              ],
              syncedAt: new Date().toISOString(),
            }),
          })
          const data = await response.json()
          console.log('Data synced:', data)
        }}
      >
        Sync Smartwatch Data
      </button>

      {/* Get metrics */}
      <button
        onClick={async () => {
          const response = await fetch(
            '/api/smartwatch/device?employeeId=emp-001&action=metrics&days=7'
          )
          const data = await response.json()
          console.log('Health metrics:', data.data.metrics)
        }}
      >
        View Metrics
      </button>
    </div>
  )
}

/**
 * Example 7: Real-time Bluetooth data collection (Web Bluetooth API)
 */
export async function exampleWebBluetooth() {
  // Request user to select a Bluetooth device
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: ['heart_rate'] }],
  })

  // Connect to device
  const gatt = await device.gatt?.connect()
  if (!gatt) return

  // Get heart rate service
  const service = await gatt.getPrimaryService('heart_rate')
  const characteristic = await service.getCharacteristic('heart_rate_measurement')

  // Listen for updates
  characteristic.addEventListener('characteristicvaluechanged', async (event: any) => {
    const value = event.target.value
    const heartRate = value.getUint8(1) // Example parsing

    // Send to backend
    await fetch('/api/smartwatch/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId: 'emp-001',
        deviceId: device.id,
        readings: [
          {
            heartRate,
            timestamp: new Date().toISOString(),
          },
        ],
        syncedAt: new Date().toISOString(),
      }),
    })
  })

  // Start notifications
  await characteristic.startNotifications()
}

/**
 * Example 8: React Native Bluetooth data collection
 */
export async function exampleReactNativeBluetooth() {
  // This would use react-native-ble-plx
  /*
  import BleManager from 'react-native-ble-plx'
  
  const bleManager = new BleManager()
  
  const connectAndSubscribe = async (deviceId: string, employeeId: string) => {
    const device = await bleManager.connectToDevice(deviceId)
    await device.discoverAllServicesAndCharacteristics()
    
    const heartRateChar = await device.readCharacteristicForService(
      'heart_rate_service',
      'heart_rate_measurement'
    )
    
    // Monitor characteristic
    bleManager.monitorCharacteristicForDevice(
      deviceId,
      'heart_rate_service',
      'heart_rate_measurement',
      async (error, characteristic) => {
        if (error) {
          console.error('Error reading characteristic:', error)
          return
        }
        
        if (characteristic?.value) {
          const heartRate = parseInt(characteristic.value)
          
          // Send to backend
          await fetch('https://your-server.com/api/smartwatch/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              employeeId,
              deviceId,
              readings: [{
                heartRate,
                timestamp: new Date().toISOString()
              }],
              syncedAt: new Date().toISOString()
            })
          })
        }
      }
    )
  }
  */
}
