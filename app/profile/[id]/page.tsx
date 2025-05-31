"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Star, Calendar, User, ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"

interface UserProfile {
  id: string
  name: string
  email: string
  joinedDate: string
  totalBooks: number
  booksRead: number
  avgRating: number
  favoriteGenres: string[]
}

interface PublicBook {
  id: string
  title: string
  author: string
  cover: string
  status: "reading" | "finished" | "want-to-read"
  rating?: number
  dateFinished?: string
  isPublic: boolean
}

interface PublicReview {
  id: string
  bookTitle: string
  bookAuthor: string
  bookCover: string
  rating: number
  content: string
  recommended: boolean
  createdAt: string
}

export default function ProfilePage() {
  const params = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [books, setBooks] = useState<PublicBook[]>([])
  const [reviews, setReviews] = useState<PublicReview[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("books")

  const isOwnProfile = currentUser?.id === params.id

  useEffect(() => {
    fetchProfileData()
  }, [params.id])

  const fetchProfileData = async () => {
    try {
      // Mock profile data for demo
      const mockProfile: UserProfile = {
        id: params.id as string,
        name: isOwnProfile ? currentUser?.name || "Demo User" : "Jane Reader",
        email: isOwnProfile ? currentUser?.email || "demo@bookburst.com" : "jane@example.com",
        joinedDate: "2023-06-15T00:00:00Z",
        totalBooks: 24,
        booksRead: 18,
        avgRating: 4.2,
        favoriteGenres: ["Fiction", "Mystery", "Romance", "Self-Help"],
      }

      const mockBooks: PublicBook[] = [
        {
          id: "1",
          title: "The Seven Husbands of Evelyn Hugo",
          author: "Taylor Jenkins Reid",
          cover: "/placeholder.svg?height=200&width=150",
          status: "finished",
          rating: 5,
          dateFinished: "2024-01-15T00:00:00Z",
          isPublic: true,
        },
        {
          id: "2",
          title: "Atomic Habits",
          author: "James Clear",
          cover: "/placeholder.svg?height=200&width=150",
          status: "finished",
          rating: 4,
          dateFinished: "2024-01-08T00:00:00Z",
          isPublic: true,
        },
        {
          id: "3",
          title: "The Silent Patient",
          author: "Alex Michaelides",
          cover: "/placeholder.svg?height=200&width=150",
          status: "reading",
          isPublic: true,
        },
        {
          id: "4",
          title: "Where the Crawdads Sing",
          author: "Delia Owens",
          cover: "/placeholder.svg?height=200&width=150",
          status: "want-to-read",
          isPublic: true,
        },
      ]

      const mockReviews: PublicReview[] = [
        {
          id: "1",
          bookTitle: "The Seven Husbands of Evelyn Hugo",
          bookAuthor: "Taylor Jenkins Reid",
          bookCover: "/placeholder.svg?height=200&width=150",
          rating: 5,
          content:
            "Absolutely captivating! This book had me hooked from the first page. The storytelling is masterful and the characters feel so real. I couldn't put it down.",
          recommended: true,
          createdAt: "2024-01-15T00:00:00Z",
        },
        {
          id: "2",
          bookTitle: "Atomic Habits",
          bookAuthor: "James Clear",
          bookCover: "/placeholder.svg?height=200&width=150",
          rating: 4,
          content:
            "Great practical advice for building better habits. Some concepts were repetitive but overall very helpful for personal development.",
          recommended: true,
          createdAt: "2024-01-08T00:00:00Z",
        },
      ]

      setProfile(mockProfile)
      setBooks(mockBooks.filter((book) => book.isPublic))
      setReviews(mockReviews)
    } catch (error) {
      console.error("Failed to fetch profile data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reading":
        return "bg-blue-100 text-blue-800"
      case "finished":
        return "bg-green-100 text-green-800"
      case "want-to-read":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "reading":
        return "Reading"
      case "finished":
        return "Finished"
      case "want-to-read":
        return "Want to Read"
      default:
        return status
    }
  }

  const getBooksByStatus = (status: string) => {
    return books.filter((book) => book.status === status)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h1>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-primary">BookBurst</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-6">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {profile.name}
                    {isOwnProfile && <span className="text-lg text-gray-500 ml-2">(You)</span>}
                  </h1>
                  <p className="text-gray-600 mb-4">
                    Member since{" "}
                    {new Date(profile.joinedDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </p>

                  {/* Reading Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{profile.totalBooks}</div>
                      <div className="text-sm text-gray-600">Total Books</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{profile.booksRead}</div>
                      <div className="text-sm text-gray-600">Books Read</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{profile.avgRating.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">Avg Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{reviews.length}</div>
                      <div className="text-sm text-gray-600">Reviews</div>
                    </div>
                  </div>

                  {/* Favorite Genres */}
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Favorite Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.favoriteGenres.map((genre) => (
                        <Badge key={genre} variant="secondary">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="books" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Public Bookshelf ({books.length})</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Reviews ({reviews.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="space-y-6">
            {/* Books by Status */}
            <div className="space-y-6">
              {["reading", "finished", "want-to-read"].map((status) => {
                const statusBooks = getBooksByStatus(status)
                if (statusBooks.length === 0) return null

                return (
                  <Card key={status}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{getStatusLabel(status)}</span>
                        <Badge variant="secondary">{statusBooks.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {statusBooks.map((book) => (
                          <div key={book.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                            <Link href={`/book/${book.id}`}>
                              <img
                                src={book.cover || "/placeholder.svg"}
                                alt={book.title}
                                className="w-full h-32 object-cover rounded mb-3 cursor-pointer hover:opacity-90"
                              />
                            </Link>
                            <Link href={`/book/${book.id}`}>
                              <h4 className="font-medium text-sm hover:text-primary cursor-pointer line-clamp-2 mb-1">
                                {book.title}
                              </h4>
                            </Link>
                            <p className="text-xs text-gray-600 mb-2">{book.author}</p>

                            <Badge className={`text-xs ${getStatusColor(book.status)}`}>
                              {getStatusLabel(book.status)}
                            </Badge>

                            {book.rating && (
                              <div className="flex items-center space-x-1 mt-2">
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

                            {book.dateFinished && (
                              <p className="text-xs text-gray-500 mt-1">
                                Finished {new Date(book.dateFinished).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {books.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {isOwnProfile ? "Your bookshelf is private" : "No public books"}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {isOwnProfile
                      ? "Add books to your collection to share with the community"
                      : "This user hasn't shared any books publicly yet"}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Star className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                  <p className="text-gray-600 text-center">
                    {isOwnProfile
                      ? "Start writing reviews to share your thoughts with the community"
                      : "This user hasn't written any reviews yet"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <div className="flex items-start space-x-4">
                        <Link href={`/book/${review.id}`}>
                          <img
                            src={review.bookCover || "/placeholder.svg"}
                            alt={review.bookTitle}
                            className="w-16 h-24 object-cover rounded cursor-pointer hover:opacity-90"
                          />
                        </Link>
                        <div className="flex-1">
                          <Link href={`/book/${review.id}`}>
                            <CardTitle className="text-lg hover:text-primary cursor-pointer">
                              {review.bookTitle}
                            </CardTitle>
                          </Link>
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

                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{review.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}