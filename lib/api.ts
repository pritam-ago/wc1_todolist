import { getAuth } from './auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://13.49.18.22:8080/api'

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const { token } = getAuth()
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || `API request failed with status ${response.status}`)
    }

    // For DELETE requests or other requests that might not return content
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return null
    }

    // Try to parse JSON only if there's content
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return await response.json()
    }

    return null
  } catch (error) {
    throw error
  }
}

// Task API functions
export const taskApi = {
  getAll: () => fetchWithAuth("/tasks"),

  create: (data: { title: string }) => fetchWithAuth("/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  }),

  update: (id: string, data: { title?: string; status?: string }) => fetchWithAuth(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),

  delete: (id: string) => fetchWithAuth(`/tasks/${id}`, {
    method: "DELETE",
  }),
} 