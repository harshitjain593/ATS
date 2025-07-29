import { mockUsers, type User } from "@/data/mock-data"

// Mock authentication functions
export const authenticateUser = (email: string, password: string): User | null => {
  // In a real app, you'd hash passwords and compare securely.
  // For this mock, we'll just check if the email exists and use a dummy password.
  const user = mockUsers.find((u) => u.email === email)
  if (user && password === "password123") {
    // Dummy password for all mock users
    return user
  }
  return null
}

export const registerUser = (name: string, email: string, password: string, role: User["role"]): User | null => {
  // Check if user already exists
  if (mockUsers.some((u) => u.email === email)) {
    return null // User with this email already exists
  }

  const newUser: User = {
    id: `user-${mockUsers.length + 1}`,
    name,
    email,
    role,
  }
  mockUsers.push(newUser) // Add to mock data
  return newUser
}

export const getCurrentUser = (): User | null => {
  // In a real application, this would check session cookies or tokens.
  // For this mock, we'll assume a user is "logged in" if their ID is stored in localStorage.
  if (typeof window !== "undefined") {
    const userId = localStorage.getItem("currentUserId")
    if (userId) {
      return mockUsers.find((u) => u.id === userId) || null
    }
  }
  return null
}

export const logoutUser = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUserId")
  }
}

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find((user) => user.id === id)
}
