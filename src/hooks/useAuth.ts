import { useState, useEffect, createContext, useContext } from 'react'
import type { User, LoginData, InsertUser } from '../../shared/schema'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (data: LoginData) => Promise<void>
  register: (data: InsertUser) => Promise<void>
  logout: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useAuthProvider(): AuthContextType {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check for stored token on app start
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      // Verify token with backend
      fetchUserProfile(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        localStorage.removeItem('authToken')
      }
    } catch (error) {
      localStorage.removeItem('authToken')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (data: LoginData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        localStorage.setItem('authToken', result.token)
        setUser(result.user)
      } else {
        setError(result.message || 'Błąd logowania')
      }
    } catch (error) {
      setError('Błąd połączenia z serwerem')
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: InsertUser) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        localStorage.setItem('authToken', result.token)
        setUser(result.user)
      } else {
        setError(result.message || 'Błąd rejestracji')
      }
    } catch (error) {
      setError('Błąd połączenia z serwerem')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
    setError(null)
  }

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    error
  }
}

export { AuthContext }