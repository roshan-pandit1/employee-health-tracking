import { NextRequest, NextResponse } from 'next/server'
import { getEmployeeById, getEmployeeVitals, recordVitalReading } from '@/lib/queries'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const employeeId = searchParams.get('employeeId')
    const hours = searchParams.get('hours')
    const limit = searchParams.get('limit')

    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: 'employeeId parameter is required' },
        { status: 400 }
      )
    }

    // Verify employee exists
    const employee = await getEmployeeById(employeeId)
    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      )
    }

    const vitals = await getEmployeeVitals(employeeId, {
      hours: hours ? parseInt(hours) : 24,
      limit: limit ? parseInt(limit) : 100,
    })

    return NextResponse.json({
      success: true,
      data: {
        employeeId: employee.id,
        employeeName: employee.name,
        vitals,
        count: vitals.length,
      },
    })
  } catch (error) {
    console.error('Error fetching vitals:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vitals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { employeeId, ...vitalData } = body

    if (!employeeId) {
      return NextResponse.json(
        { success: false, error: 'employeeId is required' },
        { status: 400 }
      )
    }

    // Verify employee exists
    const employee = await getEmployeeById(employeeId)
    if (!employee) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      )
    }

    const reading = await recordVitalReading(employeeId, vitalData)

    return NextResponse.json(
      {
        success: true,
        data: reading,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error recording vital:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to record vital' },
      { status: 500 }
    )
  }
}
