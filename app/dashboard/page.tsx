"use client"

import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, Star, LogOut, Search, TrendingUp } from "lucide-react"
import Link from "next/link"
import { AddBookDialog } from "@/components/add-book-dialog"
import { BookCard } from "@/components/book-card"
import { Input } from "@/components/ui/input"

interface Book {
  id: string
  title: string
  author: string
  cover: string
  status: "reading" | "finished" | "want-to-read"
  rating?: number
  notes?: string
  dateAdded: string
  dateFinished?: string
}

export default function DashboardPage() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [activeTab, setActiveTab] = useState("reading")
  const [showAddBook, setShowAddBook] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    // Load saved tab from cookie
    const savedTab = document.cookie
      .split("; ")
      .find((row) => row.startsWith("bookshelf-tab="))
      ?.split("=")[1]

    if (savedTab) {
      setActiveTab(savedTab)
    }
  }, [])

  useEffect(() => {
    // Save tab to cookie
    document.cookie = `bookshelf-tab=${activeTab}; path=/; max-age=${60 * 60 * 24 * 30}` // 30 days
  }, [activeTab])

  useEffect(() => {
    if (user) {
      fetchBooks()
    }
  }, [user])

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books")
      if (response.ok) {
        const data = await response.json()
        setBooks(data)
      }
    } catch (error) {
      console.error("Failed to fetch books:", error)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const filteredBooks = books.filter((book) => {
    const matchesTab = book.status === activeTab
    const matchesSearch =
      searchQuery === "" ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const getTabCount = (status: string) => {
    return books.filter((book) => book.status === status).length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">BookBurst</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="text-primary font-medium">
                My Books
              </Link>
              <Link href="/explore" className="text-gray-600 hover:text-primary">
                Explore
              </Link>
              <Link href="/timeline" className="text-gray-600 hover:text-primary">
                Timeline
              </Link>
              <Link href={`/profile/${user.id}`} className="text-gray-600 hover:text-primary">
                Profile
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookshelf</h1>
            <p className="text-gray-600 mt-1">Track and organize your reading journey</p>
          </div>
          <Button onClick={() => setShowAddBook(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search your books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reading" className="flex items-center space-x-2">
              <span>Currently Reading</span>
              <Badge variant="secondary">{getTabCount("reading")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="finished" className="flex items-center space-x-2">
              <span>Finished</span>
              <Badge variant="secondary">{getTabCount("finished")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="want-to-read" className="flex items-center space-x-2">
              <span>Want to Read</span>
              <Badge variant="secondary">{getTabCount("want-to-read")}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reading" className="space-y-4">
            {filteredBooks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No books currently reading</h3>
                  <p className="text-gray-600 text-center mb-4">Add a book to start tracking your reading progress</p>
                  <Button onClick={() => setShowAddBook(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Book
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} onUpdate={fetchBooks} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="finished" className="space-y-4">
            {filteredBooks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Star className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No finished books yet</h3>
                  <p className="text-gray-600 text-center mb-4">Books you've completed will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} onUpdate={fetchBooks} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="want-to-read" className="space-y-4">
            {filteredBooks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <TrendingUp className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No books in your wishlist</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Add books you want to read to keep track of your reading goals
                  </p>
                  <Button onClick={() => setShowAddBook(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Books to Read
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} onUpdate={fetchBooks} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <AddBookDialog open={showAddBook} onOpenChange={setShowAddBook} onBookAdded={fetchBooks} />
      </main>
    </div>
  )
}
