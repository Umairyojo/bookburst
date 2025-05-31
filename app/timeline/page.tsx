"use client"

import { useAuth } from "@/components/auth-provider"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, Star, TrendingUp, ArrowLeft, ArrowRight } from 'lucide-react'
import Link from "next/link"

interface TimelineBook {
  id: string
  title: string
  author: string
  cover: string
  rating?: number
  notes?: string
  dateFinished: string
  reviewContent?: string
}

interface TimelineGroup {
  period: string
  books: TimelineBook[]
  totalBooks: number
}

export default function TimelinePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [timelineData, setTimelineData] = useState<TimelineGroup[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [expandedPeriods, setExpandedPeriods] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchTimelineData()
    }
  }, [user, selectedYear])

  const fetchTimelineData = async () => {
    try {
      // Mock timeline data for demo
      const mockFinishedBooks: TimelineBook[] = [
        {
          id: "1",
          title: "The Seven Husbands of Evelyn Hugo",
          author: "Taylor Jenkins Reid",
          cover: "/placeholder.svg?height=200&width=150",
          rating: 5,
          notes: "Absolutely captivating story!",
          dateFinished: "2024-01-15T00:00:00Z",
          reviewContent: "This book completely blew me away. The storytelling is masterful.",
        },
        {
          id: "2",
          title: "Atomic Habits",
          author: "James Clear",
          cover: "/placeholder.svg?height=200&width=150",
          rating: 4,
          notes: "Great practical advice for building better habits.",
          dateFinished: "2024-01-08T00:00:00Z",
        },
        {
          id: "3",
          title: "The Silent Patient",
          author: "Alex Michaelides",
          cover: "/placeholder.svg?height=200&width=150",
          rating: 4,
          notes: "Psychological thriller that keeps you guessing.",
          dateFinished: "2023-12-22T00:00:00Z",
        },
        {
          id: "4",
          title: "Where the Crawdads Sing",
          author: "Delia Owens",
          cover: "/placeholder.svg?height=200&width=150",
          rating: 5,
          notes: "Beautiful nature writing and compelling mystery.",
          dateFinished: "2023-12-10T00:00:00Z",
        },
        {
          id: "5",
          title: "The Midnight Library",
          author: "Matt Haig",
          cover: "/placeholder.svg?height=200&width=150",
          rating: 4,
          notes: "Thought-provoking concept about life choices.",
          dateFinished: "2023-11-28T00:00:00Z",
        },
        {
          id: "6",
          title: "Educated",
          author: "Tara Westover",
          cover: "/placeholder.svg?height=200&width=150",
          rating: 5,
          notes: "Powerful memoir about education and family.",
          dateFinished: "2023-11-15T00:00:00Z",
        },
      ]

      // Group books by month/year
      const grouped = mockFinishedBooks.reduce(
        (acc, book) => {
          const date = new Date(book.dateFinished)
          const year = date.getFullYear()

          if (year !== selectedYear) return acc

          const monthYear = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })

          if (!acc[monthYear]) {
            acc[monthYear] = []
          }
          acc[monthYear].push(book)
          return acc
        },
        {} as Record<string, TimelineBook[]>,
      )

      // Convert to timeline format
      const timeline: TimelineGroup[] = Object.entries(grouped)
        .map(([period, books]) => ({
          period,
          books: books.sort((a, b) => new Date(b.dateFinished).getTime() - new Date(a.dateFinished).getTime()),
          totalBooks: books.length,
        }))
        .sort((a, b) => new Date(b.period).getTime() - new Date(a.period).getTime())

      setTimelineData(timeline)
    } catch (error) {
      console.error("Failed to fetch timeline data:", error)
    }
  }

  const togglePeriodExpansion = (period: string) => {
    const newExpanded = new Set(expandedPeriods)
    if (newExpanded.has(period)) {
      newExpanded.delete(period)
    } else {
      newExpanded.add(period)
    }
    setExpandedPeriods(newExpanded)
  }

  const getYearStats = () => {
    const totalBooks = timelineData.reduce((sum, group) => sum + group.totalBooks, 0)
    const avgRating =
      timelineData.reduce((sum, group) => {
        const groupAvg = group.books.reduce((bookSum, book) => bookSum + (book.rating || 0), 0) / group.books.length
        return sum + (groupAvg || 0)
      }, 0) / (timelineData.length || 1)

    return { totalBooks, avgRating }
  }

  const { totalBooks, avgRating } = getYearStats()

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
              <Link href="/dashboard" className="text-gray-600 hover:text-primary">
                My Books
              </Link>
              <Link href="/explore" className="text-gray-600 hover:text-primary">
                Explore
              </Link>
              <Link href="/timeline" className="text-primary font-medium">
                Timeline
              </Link>
              <Link href={`/profile/${user.id}`} className="text-gray-600 hover:text-primary">
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reading Timeline</h1>
          <p className="text-gray-600 mt-1">Your reading journey through time</p>
        </div>

        {/* Year Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => setSelectedYear(selectedYear - 1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {selectedYear - 1}
            </Button>
            <h2 className="text-2xl font-bold text-gray-900">{selectedYear}</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedYear(selectedYear + 1)}
              disabled={selectedYear >= new Date().getFullYear()}
            >
              {selectedYear + 1}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Year Stats */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{totalBooks}</div>
              <div className="text-sm text-gray-600">Books Read</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{avgRating.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg Rating</div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {timelineData.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No books finished in {selectedYear}</h3>
              <p className="text-gray-600 text-center mb-4">
                Start reading and finishing books to see your timeline grow!
              </p>
              <Link href="/dashboard">
                <Button>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Go to My Books
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {timelineData.map((group) => (
              <Card key={group.period} className="overflow-hidden">
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => togglePeriodExpansion(group.period)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span>{group.period}</span>
                      </CardTitle>
                      <CardDescription>
                        {group.totalBooks} book{group.totalBooks !== 1 ? "s" : ""} completed
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{group.totalBooks} books</Badge>
                      <TrendingUp
                        className={`h-4 w-4 transition-transform ${
                          expandedPeriods.has(group.period) ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                </CardHeader>

                {expandedPeriods.has(group.period) && (
                  <CardContent className="pt-0">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.books.map((book) => (
                        <div key={book.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex space-x-3">
                            <Link href={`/book/${book.id}`}>
                              <img
                                src={book.cover || "/placeholder.svg"}
                                alt={book.title}
                                className="w-12 h-18 object-cover rounded cursor-pointer hover:opacity-90"
                              />
                            </Link>
                            <div className="flex-1 min-w-0">
                              <Link href={`/book/${book.id}`}>
                                <h4 className="font-medium text-sm hover:text-primary cursor-pointer line-clamp-2">
                                  {book.title}
                                </h4>
                              </Link>
                              <p className="text-xs text-gray-600 mb-2">{book.author}</p>

                              {book.rating && (
                                <div className="flex items-center space-x-1 mb-2">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < book.rating! ? "text-yellow-400 fill-current" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                  <span className="text-xs text-gray-600">{book.rating}/5</span>
                                </div>
                              )}

                              <p className="text-xs text-gray-500">
                                Finished {new Date(book.dateFinished).toLocaleDateString()}
                              </p>

                              {book.notes && <p className="text-xs text-gray-700 mt-2 line-clamp-2">{book.notes}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}