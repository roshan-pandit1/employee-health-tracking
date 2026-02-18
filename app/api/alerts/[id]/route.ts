import { NextRequest, NextResponse } from 'next/server'
import { getAlertById, acknowledgeAlert, deleteAlert } from '@/lib/queries'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const alert = await getAlertById(id)

    if (!alert) {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: alert,
    })
  } catch (error) {
    console.error('Error fetching alert:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch alert' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await getAlertById(id)
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      )
    }

    // If acknowledging
    if (body.acknowledged === true) {
      const updated = await acknowledgeAlert(id)
      return NextResponse.json({
        success: true,
        data: updated,
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid update request' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating alert:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update alert' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const existing = await getAlertById(id)
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Alert not found' },
        { status: 404 }
      )
    }

    await deleteAlert(id)

    return NextResponse.json({
      success: true,
      message: 'Alert deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting alert:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete alert' },
      { status: 500 }
    )
  }
}
