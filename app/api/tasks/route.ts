import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Task from '@/models/Task'
import Employee from '@/models/Employee'

// GET all tasks (filtered by role)
export async function GET() {
  try {
    const { userId, sessionClaims } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const userEmail = sessionClaims?.email as string
    const isAdminEmail = userEmail === 'vishaltewari2005@gmail.com'
    const role = isAdminEmail ? 'admin' : (sessionClaims?.metadata as { role?: string })?.role
    let tasks

    if (role === 'admin') {
      // Admin can see all tasks
      tasks = await Task.find().populate('assignedTo', 'name email department').sort({ createdAt: -1 })
    } else {
      // Employee can only see their own tasks
      const employee = await Employee.findOne({ clerkUserId: userId })
      if (!employee) {
        return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
      }
      tasks = await Task.find({ assignedTo: employee._id }).sort({ createdAt: -1 })
    }

    return NextResponse.json({ tasks }, { status: 200 })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}

// POST to Create new task 
export async function POST(req: Request) {
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

    const body = await req.json()
    const { title, description, assignedTo, priority, dueDate } = body

    if (!title || !description || !assignedTo || !dueDate) {
      return NextResponse.json(
        { error: 'Title, description, assignedTo, and dueDate are required' },
        { status: 400 }
      )
    }

    await connectDB()

    // Get employee details
    const employee = await Employee.findById(assignedTo)
    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedToEmail: employee.email,
      priority: priority || 'Medium',
      dueDate: new Date(dueDate),
      createdBy: userId,
    })

    const populatedTask = await Task.findById(task._id).populate('assignedTo', 'name email department')

    return NextResponse.json({ task: populatedTask }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create task' },
      { status: 500 }
    )
  }
}
