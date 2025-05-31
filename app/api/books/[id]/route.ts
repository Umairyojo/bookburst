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

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const userId = await getCurrentUser()
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const bookIndex = books.findIndex((book) => book.id === id && book.userId === userId)
    if (bookIndex === -1) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    const updates = await request.json()
    books[bookIndex] = { ...books[bookIndex], ...updates }

    // Set dateFinished if status changed to finished
    if (updates.status === "finished" && !books[bookIndex].dateFinished) {
      books[bookIndex].dateFinished = new Date().toISOString()
    }

    return NextResponse.json(books[bookIndex])
  } catch (error) {
    console.error("Update book error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const userId = await getCurrentUser()
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const bookIndex = books.findIndex((book) => book.id === id && book.userId === userId)
    if (bookIndex === -1) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 })
    }

    books.splice(bookIndex, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete book error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
