import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { users, addUser, findUserByEmail } from '@/lib/users'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, role, department } = body

    // Validate required fields
    if (!name || !email || !password || !role || !department) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Validate role
    const validRoles = ['physician', 'nurse', 'admin']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be physician, nurse, or admin' },
        { status: 400 }
      )
    }

    // Validate department
    const validDepartments = ['Cardiology', 'Neurology', 'Emergency', 'Pediatrics', 'Oncology', 'IT', 'Administration']
    if (!validDepartments.includes(department)) {
      return NextResponse.json(
        { error: 'Invalid department' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate user ID
    const newId = (users.length + 1).toString()

    // Create new user
    const newUser = {
      id: newId,
      name,
      email,
      password: hashedPassword,
      role,
      department,
      image: `https://images.unsplash.com/photo-${Math.random().toString(36).substring(2)}?w=150&h=150&fit=crop&crop=face`
    }

    // Add to users array
    addUser(newUser)

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: userWithoutPassword
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// No need to export users anymore
