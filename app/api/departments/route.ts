import { NextRequest, NextResponse } from 'next/server'
import { getDepartmentStats } from '@/lib/queries'

export async function GET(request: NextRequest) {
  try {
    const departments = await getDepartmentStats()

    return NextResponse.json({
      success: true,
      data: departments,
      count: departments.length,
    })
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch departments' },
      { status: 500 }
    )
  }
}
