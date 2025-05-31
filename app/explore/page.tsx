"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Star, BookOpen, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Review {
  id: string
  bookTitle: string
  bookAuthor: string
  bookCover: string
  rating: number
  content: string
  userName: string
  createdAt: string
  recommended: boolean
}

interface TrendingBook {
  title: string
  author: string
  cover: string
  addCount: number
  avgRating: number
  reviewCount: number
}

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("trending")
  const [reviews, setReviews] = useState<Review[]>([])
  const [trendingBooks, setTrendingBooks] = useState<TrendingBook[]>([])

  useEffect(() => {
    // Load saved tab from cookie
    const savedTab = document.cookie
      .split("; ")
      .find((row) => row.startsWith("explore-tab="))
      ?.split("=")[1]

    if (savedTab) {
      setActiveTab(savedTab)
    }
  }, [])

  useEffect(() => {
    // Save tab to cookie
    document.cookie = `explore-tab=${activeTab}; path=/; max-age=${60 * 60 * 24 * 30}` // 30 days
  }, [activeTab])

  useEffect(() => {
    fetchExploreData()
  }, [])

  const fetchExploreData = async () => {
    // Mock data for demo
    const mockReviews: Review[] = [
      {
        id: "1",
        bookTitle: "The Seven Husbands of Evelyn Hugo",
        bookAuthor: "Taylor Jenkins Reid",
        bookCover: "/placeholder.svg?height=200&width=150",
        rating: 5,
        content:
          "Absolutely captivating! This book had me hooked from the first page. The storytelling is masterful and the characters feel so real.",
        userName: "BookLover23",
        createdAt: "2024-01-15T10:30:00Z",
        recommended: true,
      },
      {
        id: "2",
        bookTitle: "Atomic Habits",
        bookAuthor: "James Clear",
        bookCover: "/placeholder.svg?height=200&width=150",
        rating: 4,
        content:
          "Great practical advice for building better habits. Some concepts were repetitive but overall very helpful.",
        userName: "ProductivityGuru",
        createdAt: "2024-01-14T15:45:00Z",
        recommended: true,
      },
      {
        id: "3",
        bookTitle: "The Silent Patient",
        bookAuthor: "Alex Michaelides",
        bookCover: "/placeholder.svg?height=200&width=150",
        rating: 4,
        content: "A psychological thriller that keeps you guessing until the very end. The twist was unexpected!",
        userName: "ThrillerFan",
        createdAt: "2024-01-13T09:20:00Z",
        recommended: true,
      },
    ]

    const mockTrending: TrendingBook[] = [
      {
        title: "Fourth Wing",
        author: "Rebecca Yarros",
        cover: "/placeholder.svg?height=200&width=150",
        addCount: 1247,
        avgRating: 4.6,
        reviewCount: 892,
      },
      {
        title: "Tomorrow, and Tomorrow, and Tomorrow",
        author: "Gabrielle Zevin",
        cover: "/placeholder.svg?height=200&width=150",
        addCount: 1156,
        avgRating: 4.4,
        reviewCount: 743,
      },
      {
        title: "The Atlas Six",
        author: "Olivie Blake",
        cover: "/placeholder.svg?height=200&width=150",
        addCount: 1089,
        avgRating: 4.2,
        reviewCount: 654,
      },
    ]

    setReviews(mockReviews)
    setTrendingBooks(mockTrending)
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
              <Link href="/explore" className="text-primary font-medium">
                Explore
              </Link>
              <Link href="/timeline" className="text-gray-600 hover:text-primary">
                Timeline
              </Link>
            </nav>
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore Books</h1>
          <p className="text-gray-600 mt-1">Discover trending books and read community reviews</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Trending</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Recent Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="top-rated" className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Top Rated</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingBooks.map((book, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex">
                      <img src={book.cover || "/placeholder.svg"} alt={book.title} className="w-24 h-36 object-cover" />
                      <div className="p-4 flex-1">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{book.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{book.author}</p>

                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{book.avgRating}</span>
                          <span className="text-sm text-gray-500">({book.reviewCount} reviews)</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{book.addCount} readers</Badge>
                          <Badge className="bg-green-100 text-green-800">#{index + 1} Trending</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <img
                        src={review.bookCover || "/placeholder.svg"}
                        alt={review.bookTitle}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-lg">{review.bookTitle}</CardTitle>
                        <CardDescription className="text-base">{review.bookAuthor}</CardDescription>

                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">{review.rating}/5</span>
                          </div>

                          {review.recommended && <Badge className="bg-green-100 text-green-800">Recommended</Badge>}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{review.content}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>by {review.userName}</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="top-rated" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingBooks
                .sort((a, b) => b.avgRating - a.avgRating)
                .map((book, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        <img
                          src={book.cover || "/placeholder.svg"}
                          alt={book.title}
                          className="w-24 h-36 object-cover"
                        />
                        <div className="p-4 flex-1">
                          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{book.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{book.author}</p>

                          <div className="flex items-center space-x-1 mb-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{book.avgRating}</span>
                            <span className="text-sm text-gray-500">({book.reviewCount} reviews)</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{book.addCount} readers</Badge>
                            <Badge className="bg-yellow-100 text-yellow-800">Top Rated</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
