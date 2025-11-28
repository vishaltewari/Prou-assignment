import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Task from '@/models/Task'
import Employee from '@/models/Employee'

// GET single task
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    const task = await Task.findById(id).populate('assignedTo', 'name email department')
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const role = (sessionClaims?.metadata as { role?: string })?.role

    // Check if employee is trying to access someone else's task
    if (role !== 'admin') {
      const employee = await Employee.findOne({ clerkUserId: userId })
      if (!employee || task.assignedTo._id.toString() !== employee._id.toString()) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    return NextResponse.json({ task }, { status: 200 })
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 })
  }
}

// PUT - Update task
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const role = (sessionClaims?.metadata as { role?: string })?.role

    await connectDB()

    const task = await Task.findById(id)
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    if (role === 'admin') {
      // Admin can update everything
      const { title, description, assignedTo, priority, dueDate, status } = body
      
      let updateData: any = { title, description, priority, dueDate, status }
      
      if (assignedTo) {
        const employee = await Employee.findById(assignedTo)
        if (!employee) {
          return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
        }
        updateData.assignedTo = assignedTo
        updateData.assignedToEmail = employee.email
      }

      const updatedTask = await Task.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('assignedTo', 'name email department')

      return NextResponse.json({ task: updatedTask }, { status: 200 })
    } else {
      // Employee can only update status and log time
      const employee = await Employee.findOne({ clerkUserId: userId })
      if (!employee || task.assignedTo.toString() !== employee._id.toString()) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }

      const { status, timeLogged } = body
      const updateData: any = {}
      if (status) updateData.status = status
      if (timeLogged !== undefined) updateData.timeLogged = timeLogged

      const updatedTask = await Task.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('assignedTo', 'name email department')

      return NextResponse.json({ task: updatedTask }, { status: 200 })
    }
  } catch (error: any) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update task' },
      { status: 500 }
    )
  }
}

// DELETE - Delete task (Admin only)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const role = (sessionClaims?.metadata as { role?: string })?.role
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = await params
    await connectDB()

    const task = await Task.findByIdAndDelete(id)
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 })
  } catch (error: any) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete task' },
      { status: 500 }
    )
  }
}
