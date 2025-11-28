import Link from 'next/link'
import { auth,currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const { userId } = await auth()

  if (userId) {
    const user = await currentUser()
    const userEmail = user?.emailAddresses?.[0]?.emailAddress
   
    // const isAdminEmail = userEmail === 'vishaltewari2005@gmail.com'
   
    
    // to check email and metadata
    const role =  (user?.publicMetadata as { role?: string })?.role
    // const role = isAdminEmail ? 'admin' : (user?.publicMetadata as { role?: string })?.role
    

    if (role === 'admin') {
      redirect('/admin/dashboard')
    } else {
      redirect('/employee/dashboard')
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Employee Task Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Streamline your workflow and boost productivity
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">👨‍💼</div>
            <h2 className="text-2xl font-bold mb-4">Admin Portal</h2>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li>✓ Manage employees</li>
              <li>✓ Assign tasks</li>
              <li>✓ Track progress</li>
              <li>✓ Monitor performance</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">👨‍💻</div>
            <h2 className="text-2xl font-bold mb-4">Employee Portal</h2>
            <ul className="space-y-2 text-gray-600 mb-6">
              <li>✓ View assigned tasks</li>
              <li>✓ Update task status</li>
              <li>✓ Log time spent</li>
              <li>✓ Track deadlines</li>
            </ul>
          </div>
        </div>

        <div className="text-center space-x-4">
          <Link
            href="/sign-in"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
          >
            Sign Up
          </Link>
        </div>

        <div className="mt-16 text-center text-gray-600">
          <p className="text-sm">Track 3: Fullstack Web + API + Database Assignment</p>
        </div>
      </div>
    </div>
  );
}
