// API endpoint for smartwatch data sync
import { NextRequest, NextResponse } from 'next/server'
import { parseSmartWatchPayload, simulateBluetoothDataCollection } from '@/lib/bluetooth-handler'
import { processSmartwatchData } from '@/lib/smartwatch-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Parse and validate incoming smartwatch data
    const packet = await parseSmartWatchPayload(body)

    // Process and store the data
    const result = await processSmartwatchData(packet)

    return NextResponse.json(
      {
        success: true,
        message: 'Smartwatch data synced successfully',
        data: result,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error syncing smartwatch data:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to sync smartwatch data',
      },
      { status: 400 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const employeeId = searchParams.get('employeeId')
    const simulate = searchParams.get('simulate') === 'true'

    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: 'employeeId parameter is required' },
        { status: 400 }
      )
    }

    // For testing/demo: simulate Bluetooth data collection
    if (simulate) {
      const packet = await simulateBluetoothDataCollection(employeeId)
      const result = await processSmartwatchData(packet)

      return NextResponse.json({
        success: true,
        message: 'Simulated smartwatch data synced',
        data: result,
      })
    }

    return NextResponse.json(
      { success: false, error: 'Use POST endpoint to sync real data, or add ?simulate=true' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Error in sync endpoint:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process request',
      },
      { status: 500 }
    )
  }
}
