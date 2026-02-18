import { NextRequest, NextResponse } from 'next/server'
import { getHealthSummary } from '@/lib/queries'

export async function GET(request: NextRequest) {
  try {
    const stats = await getHealthSummary()

    return NextResponse.json({
      success: true,
      data: {
        ...stats,
        lastUpdated: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Error fetching health summary:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch health summary' },
      { status: 500 }
    )
  }
}
