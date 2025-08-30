import bcrypt from 'bcryptjs'

// Mock user database - in production, use a real database
export let users = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@clinic.org",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2e", // "password123"
    role: "physician",
    department: "Cardiology",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "2", 
    name: "Dr. Michael Chen",
    email: "michael.chen@clinic.org",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2e", // "password123"
    role: "physician",
    department: "Neurology",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "3",
    name: "Nurse Emily Rodriguez",
    email: "emily.rodriguez@clinic.org", 
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2e", // "password123"
    role: "nurse",
    department: "Emergency",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: "4",
    name: "Admin User",
    email: "admin@clinic.org",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2e", // "password123"
    role: "admin",
    department: "IT",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  }
]

export const addUser = (user: any) => {
  users.push(user)
}

export const findUserByEmail = (email: string) => {
  return users.find(user => user.email === email)
}

export const findUserById = (id: string) => {
  return users.find(user => user.id === id)
}
