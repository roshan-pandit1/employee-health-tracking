// Smartwatch device management endpoints
import { NextRequest, NextResponse } from 'next/server'
import {
  registerSmartwatch,
  disconnectSmartwatch,
  getSmartwatchHistory,
  calculateHealthMetrics,
} from '@/lib/smartwatch-service'
import { getEmployeeById } from '@/lib/queries'

// Register a new smartwatch device
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { employeeId, deviceId, deviceName, deviceModel, firmwareVersion, batteryLevel } = body

    if (!employeeId || !deviceId || !deviceName || !deviceModel) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: employeeId, deviceId, deviceName, deviceModel',
        },
        { status: 400 }
      )
    }

    if (batteryLevel === undefined || batteryLevel < 0 || batteryLevel > 100) {
      return NextResponse.json(
        { success: false, error: 'Battery level must be between 0-100' },
        { status: 400 }
      )
    }

    const result = await registerSmartwatch(employeeId, {
      deviceId,
      deviceName,
      deviceModel,
      firmwareVersion,
      batteryLevel,
    })

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error registering smartwatch:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to register smartwatch',
      },
      { status: 400 }
    )
  }
}

// Get smartwatch device info and status
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const employeeId = searchParams.get('employeeId')
    const action = searchParams.get('action')

    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: 'employeeId parameter is required' },
        { status: 400 }
      )
    }

    const employee = await getEmployeeById(employeeId)

    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Get sync history
    if (action === 'history') {
      const days = searchParams.get('days')
      const history = await getSmartwatchHistory(employeeId, days ? parseInt(days) : 7)

      return NextResponse.json({
        success: true,
        data: {
          employeeId,
          employeeName: employee.name,
          watchConnected: employee.watchConnected,
          lastSync: employee.lastSync,
          syncHistory: history,
        },
      })
    }

    // Get health metrics
    if (action === 'metrics') {
      const days = searchParams.get('days')
      const metrics = await calculateHealthMetrics(employeeId, days ? parseInt(days) : 7)

      return NextResponse.json({
        success: true,
        data: {
          employeeId,
          employeeName: employee.name,
          metrics,
        },
      })
    }

    // Get basic device status
    return NextResponse.json({
      success: true,
      data: {
        employeeId,
        employeeName: employee.name,
        watchConnected: employee.watchConnected,
        lastSync: employee.lastSync,
        age: employee.age,
        department: employee.department,
      },
    })
  } catch (error: any) {
    console.error('Error fetching device info:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch device info',
      },
      { status: 500 }
    )
  }
}

// Disconnect a smartwatch
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const employeeId = searchParams.get('employeeId')

    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: 'employeeId parameter is required' },
        { status: 400 }
      )
    }

    const result = await disconnectSmartwatch(employeeId)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error('Error disconnecting smartwatch:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to disconnect smartwatch',
      },
      { status: 500 }
    )
  }
}
