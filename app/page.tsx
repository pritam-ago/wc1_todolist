"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { taskApi } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Plus, LogOut } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  status: string
  created_at: string
  updated_at: string
}

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const { logout, isAuthenticated, token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('Home page mounted, auth state:', { isAuthenticated, token })
    if (isAuthenticated) {
      fetchTasks()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, token])

  const fetchTasks = async () => {
    try {
      console.log('Fetching tasks...')
      setIsLoading(true)
      setError("")
      const data = await taskApi.getAll()
      console.log('Tasks fetched:', data)
      setTasks(data || []) // Ensure we always set an array
    } catch (err) {
      console.error('Error fetching tasks:', err)
      setError(err instanceof Error ? err.message : "Failed to fetch tasks")
      setTasks([]) // Reset tasks to empty array on error
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Add task form submitted:', { 
      newTask, 
      isSubmitting
    })
 
    if (isSubmitting) {
      console.log('Task submission prevented: already submitting')
      return
    }
    

    try {
      console.log('Starting to add new task:', { title: newTask })
      setIsSubmitting(true)
      setError("")
      
      const task = await taskApi.create({ title: newTask })
      console.log('Task added successfully:', task)
      
      setTasks(prevTasks => {
        const updatedTasks = [task, ...(prevTasks || [])]
        console.log('Updated tasks state:', updatedTasks)
        return updatedTasks
      })
      
      setNewTask("")
    } catch (err) {
      console.error('Error adding task:', err)
      const errorMessage = err instanceof Error ? err.message : "Failed to add task"
      console.error('Setting error message:', errorMessage)
      setError(errorMessage)
    } finally {
      console.log('Task submission completed')
      setIsSubmitting(false)
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      console.log('Deleting task:', id)
      setError("")
      await taskApi.delete(id)
      console.log('Task deleted:', id)
      setTasks(prevTasks => (prevTasks || []).filter(task => task.id !== id))
    } catch (err) {
      console.error('Error deleting task:', err)
      setError(err instanceof Error ? err.message : "Failed to delete task")
    }
  }

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed"
    try {
      console.log('Updating task status:', { id, newStatus })
      setError("")
      
      // Find the current task to preserve its title
      const currentTask = tasks.find(task => task.id === id)
      if (!currentTask) {
        throw new Error("Task not found")
      }

      const updatedTask = await taskApi.update(id, { 
        status: newStatus,
        title: currentTask.title // Preserve the title
      })
      console.log('Task updated:', updatedTask)
      
      setTasks(prevTasks => (prevTasks || []).map(task => 
        task.id === id ? { ...task, status: newStatus } : task
      ))
    } catch (err) {
      console.error('Error updating task:', err)
      setError(err instanceof Error ? err.message : "Failed to update task")
    }
  }

  const handleLogout = () => {
    console.log('Logging out...')
    logout()
    router.push("/")
  }

  const handleLogin = () => {
    router.push("/login")
  }

  const handleSignup = () => {
    router.push("/signup")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto p-4 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Welcome to TaskFlow
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Your personal task management solution</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="block w-full px-6 py-3 text-center text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Login
            </button>
            <button
              onClick={handleSignup}
              className="block w-full px-6 py-3 text-center text-sm sm:text-base bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Tasks
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>

        <form onSubmit={handleAddTask} className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => {
                console.log('Input changed:', e.target.value)
                setNewTask(e.target.value)
              }}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 text-sm sm:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium transition-all duration-200 ${
                isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-lg transform hover:scale-105"
              }`}
            >
              <Plus className="h-5 w-5" />
              {isSubmitting ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-sm sm:text-base">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {!tasks || tasks.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-md">
              <p className="text-sm sm:text-base text-gray-500">No tasks yet. Add your first task above!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className={`text-base sm:text-lg font-medium ${task.status === "completed" ? "line-through text-gray-500" : "text-gray-900"}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="mt-2 text-sm sm:text-base text-gray-600">{task.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                    <button
                      onClick={() => handleUpdateStatus(task.id, task.status)}
                      className={`px-4 py-2 text-sm sm:text-base rounded-lg font-medium ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                    >
                      {task.status === "completed" ? "Completed" : "Mark Complete"}
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 text-sm sm:text-base text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
