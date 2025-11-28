import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Employee from '@/models/Employee'
import { clerkClient } from '@clerk/nextjs/server'

// GET all employees (Admin only)
export async function GET() {
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

    await connectDB()
    const employees = await Employee.find().sort({ createdAt: -1 })

    return NextResponse.json({ employees }, { status: 200 })
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 })
  }
}

// POST - Create new employee (Admin only)
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
    const { email, name, department, position, password } = body

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ email })
    if (existingEmployee) {
      return NextResponse.json({ error: 'Employee already exists' }, { status: 400 })
    }

    // Create user in Clerk
    try {
      const client = await clerkClient()
      const clerkUser = await client.users.createUser({
        emailAddress: [email],
        password: password,
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || undefined,
        publicMetadata: {
          role: 'employee',
        },
      })

      // Create employe in Mongodb
      const employee = await Employee.create({
        clerkUserId: clerkUser.id,
        email,
        name,
        department,
        position,
        role: 'employee',
      })

      return NextResponse.json({ employee }, { status: 201 })
    } catch (clerkError: any) {
      console.error('Clerk API Error:', clerkError)
      console.error('Clerk Error Details:', clerkError.errors)
      
      // Return eror msg
      const errorMessage = clerkError.errors?.[0]?.message || clerkError.message || 'Failed to create user in Clerk'
      return NextResponse.json(
        { error: errorMessage, details: clerkError.errors },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error creating employee:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create employee' },
      { status: 500 }
    )
  }
}
