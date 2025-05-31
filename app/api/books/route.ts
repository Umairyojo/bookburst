import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// In-memory storage for demo purposes
const books: Array<{
  id: string
  userId: string
  title: string
  author: string
  cover: string
  status: "reading" | "finished" | "want-to-read"
  rating?: number
  notes?: string
  dateAdded: string
  dateFinished?: string
}> = []

async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session")?.value
  return sessionId
}

export async function GET() {
  try {
    const userId = await getCurrentUser()
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userBooks = books.filter((book) => book.userId === userId)
    return NextResponse.json(userBooks)
  } catch (error) {
    console.error("Get books error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUser()
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { title, author, cover, status, notes } = await request.json()

    const book = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      title,
      author,
      cover,
      status,
      notes,
      dateAdded: new Date().toISOString(),
    }

    books.push(book)
    return NextResponse.json(book)
  } catch (error) {
    console.error("Add book error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
