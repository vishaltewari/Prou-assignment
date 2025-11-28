import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Employee from '@/models/Employee'

// Sync current user to MongoDB
export async function POST() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ clerkUserId: userId })
    if (existingEmployee) {
      return NextResponse.json({ employee: existingEmployee }, { status: 200 })
    }

    // If not exists, this means user needs to be synced manually
    return NextResponse.json(
      { error: 'Employee not found in database. Please contact admin.' },
      { status: 404 }
    )
  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 })
  }
}
