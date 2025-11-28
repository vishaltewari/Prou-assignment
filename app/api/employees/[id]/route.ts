import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Employee from '@/models/Employee'
import Task from '@/models/Task'
import { clerkClient } from '@clerk/nextjs/server'

// GET single employee
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = sessionClaims?.email as string
    const isAdminEmail = userEmail === 'vishaltewari2005@gmail.com'
    const role = isAdminEmail ? 'admin' : (sessionClaims?.metadata as { role?: string })?.role
    
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = await params
    await connectDB()

    const employee = await Employee.findById(id)
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    return NextResponse.json({ employee }, { status: 200 })
  } catch (error) {
    console.error('Error fetching employee:', error)
    return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 })
  }
}

// PUT - Update employee
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = sessionClaims?.email as string
    const isAdminEmail = userEmail === 'vishaltewari2005@gmail.com'
    const role = isAdminEmail ? 'admin' : (sessionClaims?.metadata as { role?: string })?.role
    
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { name, department, position } = body

    await connectDB()

    const employee = await Employee.findByIdAndUpdate(
      id,
      { name, department, position },
      { new: true, runValidators: true }
    )

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    // Update Clerk user
    const client = await clerkClient()
    await client.users.updateUser(employee.clerkUserId, {
      firstName: name.split(' ')[0],
      lastName: name.split(' ').slice(1).join(' ') || '',
    })

    return NextResponse.json({ employee }, { status: 200 })
  } catch (error: any) {
    console.error('Error updating employee:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update employee' },
      { status: 500 }
    )
  }
}

// DELETE to Delete employee
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userEmail = sessionClaims?.email as string
    const isAdminEmail = userEmail === 'vishaltewari2005@gmail.com'
    const role = isAdminEmail ? 'admin' : (sessionClaims?.metadata as { role?: string })?.role
    
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = await params
    await connectDB()

    const employee = await Employee.findById(id)
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    // Delete from Clerk
    const client = await clerkClient()
    await client.users.deleteUser(employee.clerkUserId)

    // Delete all tasks assigned to this employee
    await Task.deleteMany({ assignedTo: id })

    // Delete employee from MongoDB
    await Employee.findByIdAndDelete(id)

    return NextResponse.json({ message: 'Employee deleted successfully' }, { status: 200 })
  } catch (error: any) {
    console.error('Error deleting employee:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete employee' },
      { status: 500 }
    )
  }
}
