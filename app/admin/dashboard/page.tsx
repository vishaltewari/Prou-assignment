'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

interface Employee {
  _id: string
  name: string
  email: string
  department?: string
  position?: string
  role: string
  hireDate: string
}
interface Task {
  _id: string
  title: string
  description: string
  assignedTo: any
  assignedToEmail: string
  status: string
  priority: string
  dueDate: string
  timeLogged?: number
}
export default function AdminDashboard() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'employees' | 'tasks'>('overview')
  const [showEmployeeForm, setShowEmployeeForm] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)

  // Employee form state
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    position: '',
  })

  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'Medium',
    dueDate: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [employeesRes, tasksRes] = await Promise.all([
        fetch('/api/employees'),
        fetch('/api/tasks'),
      ])

      if (employeesRes.ok) {
        const empData = await employeesRes.json()
        setEmployees(empData.employees)
      }

      if (tasksRes.ok) {
        const taskData = await tasksRes.json()
        setTasks(taskData.tasks)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeForm),
      })

      if (res.ok) {
        alert('Employee created successfully!')
        setShowEmployeeForm(false)
        setEmployeeForm({ name: '', email: '', password: '', department: '', position: '' })
        fetchData()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to create employee')
      }
    } catch (error) {
      alert('Error creating employee')
    }
  }

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskForm),
      })

      if (res.ok) {
        alert('Task created successfully!')
        setShowTaskForm(false)
        setTaskForm({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' })
        fetchData()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to create task')
      }
    } catch (error) {
      alert('Error creating task')
    }
  }

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure? This will delete all tasks assigned to this employee.')) return

    try {
      const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Employee deleted successfully!')
        fetchData()
      } else {
        alert('Failed to delete employee')
      }
    } catch (error) {
      alert('Error deleting employee')
    }
  }

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Task deleted successfully!')
        fetchData()
      } else {
        alert('Failed to delete task')
      }
    } catch (error) {
      alert('Error deleting task')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800'
      case 'Blocked':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800'
      case 'High':
        return 'bg-orange-100 text-orange-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-green-100 text-green-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    )
  }

  const stats = {
    totalEmployees: employees.filter((e) => e.role !== 'admin').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === 'Completed').length,
    inProgressTasks: tasks.filter((t) => t.status === 'In Progress').length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <UserButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2 px-4 ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className={`pb-2 px-4 ${
              activeTab === 'employees'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Employees
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-2 px-4 ${
              activeTab === 'tasks'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600'
            }`}
          >
            Tasks
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEmployees}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTasks}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completedTasks}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600 text-sm">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">{stats.inProgressTasks}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Recent Tasks</h2>
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task._id} className="border-b pb-3 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{task.title}</p>
                        <p className="text-sm text-gray-600">
                          Assigned to: {task.assignedTo?.name || task.assignedToEmail}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Employees</h2>
              <button
                onClick={() => setShowEmployeeForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Add Employee
              </button>
            </div>

            {showEmployeeForm && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Create New Employee</h3>
                <form onSubmit={handleCreateEmployee} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={employeeForm.name}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={employeeForm.email}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      value={employeeForm.password}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Department</label>
                    <input
                      type="text"
                      value={employeeForm.department}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Position</label>
                    <input
                      type="text"
                      value={employeeForm.position}
                      onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Create Employee
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEmployeeForm(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employees
                    .filter((e) => e.role !== 'admin')
                    .map((employee) => (
                      <tr key={employee._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{employee.department || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{employee.position || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteEmployee(employee._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Tasks</h2>
              <button
                onClick={() => setShowTaskForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Create Task
              </button>
            </div>

            {showTaskForm && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">Create New Task</h3>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={taskForm.title}
                      onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description *</label>
                    <textarea
                      required
                      value={taskForm.description}
                      onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Assign To *</label>
                    <select
                      required
                      value={taskForm.assignedTo}
                      onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select Employee</option>
                      {employees
                        .filter((e) => e.role !== 'admin')
                        .map((emp) => (
                          <option key={emp._id} value={emp._id}>
                            {emp.name} ({emp.email})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Due Date *</label>
                    <input
                      type="date"
                      required
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Create Task
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTaskForm(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold">{task.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className={`px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="text-gray-600">
                      Assigned: {task.assignedTo?.name || task.assignedToEmail}
                    </span>
                    <span className="text-gray-600">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    {task.timeLogged !== undefined && task.timeLogged > 0 && (
                      <span className="text-gray-600">Time: {task.timeLogged} mins</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
