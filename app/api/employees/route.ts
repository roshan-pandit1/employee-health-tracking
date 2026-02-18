import { NextRequest, NextResponse } from 'next/server'
import { getAllEmployees, createEmployee, updateEmployee, deleteEmployee } from '@/lib/queries'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const department = searchParams.get('department')

    const employees = await getAllEmployees(
      department ? { department } : undefined
    )

    return NextResponse.json({
      success: true,
      data: employees,
      count: employees.length,
    })
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.role || !body.department) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, email, role, department' },
        { status: 400 }
      )
    }

    const employee = await createEmployee(body)

    return NextResponse.json(
      {
        success: true,
        data: employee,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating employee:', error)
    
    // Handle unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create employee' },
      { status: 500 }
    )
  }
}
