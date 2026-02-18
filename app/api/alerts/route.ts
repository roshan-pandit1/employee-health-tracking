import { NextRequest, NextResponse } from 'next/server'
import { getAllAlerts, acknowledgeAlert, deleteAlert } from '@/lib/queries'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const severity = searchParams.get('severity')
    const acknowledged = searchParams.get('acknowledged')
    const employeeId = searchParams.get('employeeId')

    const alerts = await getAllAlerts({
      ...(severity && { severity }),
      ...(acknowledged !== null && { acknowledged: acknowledged === 'true' }),
      ...(employeeId && { employeeId }),
    })

    return NextResponse.json({
      success: true,
      data: alerts,
      count: alerts.length,
    })
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}
