import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const { userId, sessionClaims } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const role = (sessionClaims?.metadata as { role?: string })?.role

  if (role === 'admin') {
    redirect('/admin/dashboard')
  } else {
    redirect('/employee/dashboard')
  }
}
