import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// In-memory storage for demo purposes
const users: Array<{
  id: string
  email: string
  password: string
  name: string
  createdAt: string
}> = [
  {
    id: "demo-user-1",
    email: "demo@bookburst.com",
    password: "password123",
    name: "Demo User",
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("session")?.value

    if (!sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = users.find((u) => u.id === sessionId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
