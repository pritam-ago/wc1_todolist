"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Check, Trash2, ArrowLeft } from "lucide-react"

interface Task {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

export default function TodoPage() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("tasks")
      if (savedTasks) {
        try {
          // Parse dates properly from localStorage
          const parsedTasks = JSON.parse(savedTasks)
          return parsedTasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
          }))
        } catch (error) {
          console.error("Error parsing tasks from localStorage:", error)
          return []
        }
      }
    }
    return []
  })
  const [newTask, setNewTask] = useState("")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        createdAt: new Date(),
      }
      setTasks((prev) => [task, ...prev])
      setNewTask("")
    }
  }

  const toggleTask = (id: number) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  const completedCount = tasks.filter((task) => task.completed).length
  const activeCount = tasks.filter((task) => !task.completed).length

  const clearAllTasks = () => {
    if (confirm("Are you sure you want to delete all tasks?")) {
      setTasks([])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </div>
            <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-2xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Tasks</h1>
          <p className="text-gray-600">Stay organized and productive</p>
        </div>

        {/* Add Task Form */}
        <form onSubmit={addTask} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add
            </button>
          </div>
        </form>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{activeCount}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            {(["all", "active", "completed"] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  filter === filterType ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">
                {filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
              </div>
              <div className="text-gray-500 text-sm">
                {filter === "all" ? "Add your first task above!" : `Switch to "All" to see other tasks`}
              </div>
            </div>
          ) : (
            filteredTasks.map((task, index) => (
              <div
                key={task.id}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      task.completed
                        ? "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 hover:border-green-400"
                    }`}
                  >
                    {task.completed && <Check className="h-4 w-4" />}
                  </button>
                  <div className="flex-1">
                    <div
                      className={`text-lg transition-all duration-200 ${
                        task.completed ? "text-gray-500 line-through" : "text-gray-900"
                      }`}
                    >
                      {task.text}
                    </div>
                    <div className="text-sm text-gray-400">{task.createdAt.toLocaleDateString()}</div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Clear Completed Button */}
        {completedCount > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setTasks((prev) => prev.filter((task) => !task.completed))}
              className="text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              Clear {completedCount} completed task{completedCount !== 1 ? "s" : ""}
            </button>
          </div>
        )}

        {tasks.length > 0 && (
          <div className="text-center mt-4">
            <button
              onClick={clearAllTasks}
              className="text-gray-500 hover:text-gray-700 font-medium transition-colors text-sm"
            >
              Clear all tasks
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
