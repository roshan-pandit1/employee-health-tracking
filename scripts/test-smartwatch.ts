#!/usr/bin/env node

/**
 * Test script for smartwatch data collection system
 * Usage: npx ts-node scripts/test-smartwatch.ts [employeeId]
 */

// Use global fetch if available (Node 18+), otherwise provide compatibility layer
const fetchFn: any = (typeof globalThis !== 'undefined' && globalThis.fetch)
  ? globalThis.fetch.bind(globalThis)
  : async (url: string, options?: any) => {
      // Fallback implementation
      console.warn('Warning: global fetch not available, tests may fail')
      throw new Error('fetch not available in this environment')
    }

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const employeeId = process.argv[2] || 'emp-001'

interface TestResult {
  name: string
  status: 'pass' | 'fail'
  message: string
  data?: any
}

const results: TestResult[] = []

async function test(name: string, fn: () => Promise<any>) {
  try {
    console.log(`\n▶️  Testing: ${name}`)
    const data = await fn()
    console.log(`✅ ${name}`)
    results.push({
      name,
      status: 'pass',
      message: 'Success',
      data,
    })
  } catch (error: any) {
    console.error(`❌ ${name}`)
    console.error(`   Error: ${error.message}`)
    results.push({
      name,
      status: 'fail',
      message: error.message,
    })
  }
}

async function runTests() {
  console.log('🧪 Smartwatch System Tests\n')
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Employee ID: ${employeeId}\n`)

  // Test 1: Register smartwatch device
  await test('Register smartwatch device', async () => {
    const response = await fetchFn(`${BASE_URL}/api/smartwatch/device`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId,
        deviceId: `device-${Date.now()}`,
        deviceName: 'Test Watch',
        deviceModel: 'Series 8',
        firmwareVersion: '10.1.1',
        batteryLevel: 85,
      }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data
  })

  // Test 2: Get device status
  await test('Get device status', async () => {
    const response = await fetchFn(`${BASE_URL}/api/smartwatch/device?employeeId=${employeeId}`)
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data
  })

  // Test 3: Simulate smartwatch data sync
  await test('Simulate smartwatch data sync', async () => {
    const response = await fetchFn(`${BASE_URL}/api/smartwatch/sync?employeeId=${employeeId}&simulate=true`)
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data
  })

  // Test 4: Send real smartwatch data
  await test('Send real smartwatch data', async () => {
    const response = await fetchFn(`${BASE_URL}/api/smartwatch/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId,
        deviceId: `device-${Date.now()}`,
        readings: [
          {
            heartRate: 72,
            bloodOxygen: 98,
            steps: 250,
            stressLevel: 45,
            temperature: 98.6,
            caloriesBurned: 125,
            timestamp: new Date().toISOString(),
          },
        ],
        syncedAt: new Date().toISOString(),
      }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data
  })

  // Test 5: Get sync history
  await test('Get sync history', async () => {
    const response = await fetchFn(`${BASE_URL}/api/smartwatch/device?employeeId=${employeeId}&action=history`)
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data
  })

  // Test 6: Get health metrics
  await test('Get health metrics', async () => {
    const response = await fetchFn(`${BASE_URL}/api/smartwatch/device?employeeId=${employeeId}&action=metrics`)
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data
  })

  // Test 7: Send critical heart rate data (should generate alert)
  await test('Send critical vitals (alert generation)', async () => {
    const response = await fetchFn(`${BASE_URL}/api/smartwatch/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId,
        deviceId: `device-${Date.now()}`,
        readings: [
          {
            heartRate: 125, // Critical
            bloodOxygen: 89, // Warning
            stressLevel: 85, // Critical
            timestamp: new Date().toISOString(),
          },
        ],
        syncedAt: new Date().toISOString(),
      }),
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data
  })

  // Test 8: Get alerts
  await test('Get generated alerts', async () => {
    const response = await fetchFn(`${BASE_URL}/api/alerts?employeeId=${employeeId}`)
    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data
  })

  // Print summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Test Summary\n')

  const passed = results.filter((r) => r.status === 'pass').length
  const failed = results.filter((r) => r.status === 'fail').length

  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📈 Total: ${results.length}`)

  if (failed > 0) {
    console.log('\nFailed Tests:')
    results
      .filter((r) => r.status === 'fail')
      .forEach((r) => {
        console.log(`  - ${r.name}: ${r.message}`)
      })
  }

  console.log('\n' + '='.repeat(50))
  process.exit(failed > 0 ? 1 : 0)
}

runTests()
