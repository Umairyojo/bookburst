import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// In-memory storage for demo purposes
const users: Array<{
  id: string
  email: string
  password: string
  name: string
  createdAt: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password, // In production, hash this password
      name,
      createdAt: new Date().toISOString(),
    }

    users.push(user)

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set("session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
