"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Create Auth Context
type User = {
  id: string
  username: string
  email: string
  role: "user" | "admin" | "chef" | "developer"
  restaurantId?: string
  restaurantName?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Mock user data
const mockUser: User = {
  id: "user-1",
  username: "john_doe",
  email: "john@example.com",
  role: "admin",
  restaurantId: "1",
  restaurantName: "Pizza Palace",
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate checking for an existing session
  useEffect(() => {
    const checkAuth = async () => {
      // In a real app, we would check localStorage, cookies, or make an API call
      // Simulating a delay to check auth
      setTimeout(() => {
        // For demo purposes, let's auto-login the user
        // In a real app, you would check for a valid session
        setUser(mockUser)
        setIsLoading(false)
      }, 500)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API login
    setIsLoading(true)

    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // For demo purposes, any credentials will work
        setUser(mockUser)
        setIsLoading(false)
        resolve(true)
      }, 1000)
    })
  }

  const logout = () => {
    setUser(null)
  }

  const authValue = {
    user,
    login,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function RouteGuard({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    // In a real app, you would redirect to login
    return <div>Please login to access this page</div>
  }

  if (allowedRoles.includes(user.role)) {
    return <>{children}</>
  }

  return <div>You do not have permission to access this page</div>
}
