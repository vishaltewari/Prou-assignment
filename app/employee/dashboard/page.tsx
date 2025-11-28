'use client'

import { useEffect, useState } from 'react'
import { UserButton } from '@clerk/nextjs'

interface Task {
  _id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
  timeLogged?: number
}

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [timeToAdd, setTimeToAdd] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks')
      if (res.ok) {
        const data = await res.json()
        setTasks(data.tasks)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTask = async (taskId: string, updates: any) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (res.ok) {
        alert('Task updated successfully!')
        setSelectedTask(null)
        setNewStatus('')
        setTimeToAdd('')
        fetchTasks()
      } else {
        alert('Failed to update task')
      }
    } catch (error) {
      alert('Error updating task')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'Blocked':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
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

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && tasks.find((t) => t.dueDate === dueDate)?.status !== 'Completed'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    )
  }

  const todoTasks = tasks.filter((t) => t.status === 'To Do')
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress')
  const completedTasks = tasks.filter((t) => t.status === 'Completed')
  const blockedTasks = tasks.filter((t) => t.status === 'Blocked')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <UserButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">To Do</p>
            <p className="text-3xl font-bold text-gray-900">{todoTasks.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">{inProgressTasks.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-3xl font-bold text-green-600">{completedTasks.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm">Blocked</p>
            <p className="text-3xl font-bold text-red-600">{blockedTasks.length}</p>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg">No tasks assigned yet</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                  isOverdue(task.dueDate) ? 'border-red-500' : 'border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
                    <p className="text-gray-600 mt-2">{task.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedTask(task)
                      setNewStatus(task.status)
                    }}
                    className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                  >
                    Update
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 text-sm mt-4">
                  <span className={`px-3 py-1 rounded border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className={`px-3 py-1 rounded ${getPriorityColor(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                  <span className={`text-gray-600 ${isOverdue(task.dueDate) ? 'text-red-600 font-bold' : ''}`}>
                    📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                    {isOverdue(task.dueDate) && ' (OVERDUE)'}
                  </span>
                  {task.timeLogged !== undefined && task.timeLogged > 0 && (
                    <span className="text-gray-600">⏱️ Time Logged: {task.timeLogged} mins</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Update Task Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Update Task: {selectedTask.title}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Add Time (minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  value={timeToAdd}
                  onChange={(e) => setTimeToAdd(e.target.value)}
                  placeholder="e.g., 30"
                  className="w-full border rounded px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Current time logged: {selectedTask.timeLogged || 0} mins
                </p>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    const updates: any = { status: newStatus }
                    if (timeToAdd) {
                      updates.timeLogged = (selectedTask.timeLogged || 0) + parseInt(timeToAdd)
                    }
                    handleUpdateTask(selectedTask._id, updates)
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setSelectedTask(null)
                    setNewStatus('')
                    setTimeToAdd('')
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
