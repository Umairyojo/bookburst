import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ items: [] })
    }

    // Mock Google Books API response for demo
    const mockBooks = [
      {
        id: "1",
        volumeInfo: {
          title: "The Great Gatsby",
          authors: ["F. Scott Fitzgerald"],
          imageLinks: {
            thumbnail: "/placeholder.svg?height=200&width=150",
          },
          description: "A classic American novel set in the Jazz Age.",
        },
      },
      {
        id: "2",
        volumeInfo: {
          title: "To Kill a Mockingbird",
          authors: ["Harper Lee"],
          imageLinks: {
            thumbnail: "/placeholder.svg?height=200&width=150",
          },
          description: "A gripping tale of racial injustice and childhood innocence.",
        },
      },
      {
        id: "3",
        volumeInfo: {
          title: "1984",
          authors: ["George Orwell"],
          imageLinks: {
            thumbnail: "/placeholder.svg?height=200&width=150",
          },
          description: "A dystopian social science fiction novel.",
        },
      },
      {
        id: "4",
        volumeInfo: {
          title: "Pride and Prejudice",
          authors: ["Jane Austen"],
          imageLinks: {
            thumbnail: "/placeholder.svg?height=200&width=150",
          },
          description: "A romantic novel of manners.",
        },
      },
      {
        id: "5",
        volumeInfo: {
          title: "The Catcher in the Rye",
          authors: ["J.D. Salinger"],
          imageLinks: {
            thumbnail: "/placeholder.svg?height=200&width=150",
          },
          description: "A controversial novel about teenage rebellion.",
        },
      },
    ]

    // Filter books based on query
    const filteredBooks = mockBooks.filter(
      (book) =>
        book.volumeInfo.title.toLowerCase().includes(query.toLowerCase()) ||
        book.volumeInfo.authors?.some((author) => author.toLowerCase().includes(query.toLowerCase())),
    )

    return NextResponse.json({ items: filteredBooks })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
