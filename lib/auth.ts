import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const API_URL = 'http://localhost:8080/api'

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      login: async (email: string, password: string) => {
        try {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Login failed')
          }

          set({
            user: data.user,
            isAuthenticated: true,
            token: data.token,
          })
          return true
        } catch (error) {
          return false
        }
      },
      signup: async (email: string, password: string) => {
        try {
          const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || 'Signup failed')
          }

          set({
            user: data.user,
            isAuthenticated: true,
            token: data.token,
          })
          return true
        } catch (error) {
          return false
        }
      },
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
        })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    }
  )
)

// Non-hook way to get auth state
export const getAuth = () => {
  const state = useAuth.getState()
  return {
    token: state.token,
    isAuthenticated: state.isAuthenticated
  }
} 