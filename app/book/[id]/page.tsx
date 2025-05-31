"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Star, BookOpen, ArrowLeft, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

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

interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  content: string
  recommended: boolean
  createdAt: string
}

export default function BookDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const [book, setBook] = useState<Book | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [newReview, setNewReview] = useState("")
  const [newRating, setNewRating] = useState(0)
  const [recommended, setRecommended] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submittingReview, setSubmittingReview] = useState(false)

  useEffect(() => {
    fetchBookDetails()
    fetchReviews()
  }, [params.id])

  const fetchBookDetails = async () => {
    try {
      // Mock book data for demo
      const mockBook: Book = {
        id: params.id as string,
        title: "The Seven Husbands of Evelyn Hugo",
        author: "Taylor Jenkins Reid",
        cover: "/placeholder.svg?height=400&width=300",
        status: "finished",
        rating: 5,
        notes: "Absolutely loved this book! The storytelling was incredible.",
        dateAdded: "2024-01-01T00:00:00Z",
        dateFinished: "2024-01-15T00:00:00Z",
      }
      setBook(mockBook)
    } catch (error) {
      console.error("Failed to fetch book:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      // Mock reviews data for demo
      const mockReviews: Review[] = [
        {
          id: "1",
          userId: "user1",
          userName: "BookLover23",
          rating: 5,
          content:
            "This book completely blew me away! The character development is phenomenal and the plot twists kept me on the edge of my seat. Taylor Jenkins Reid has created something truly special here.",
          recommended: true,
          createdAt: "2024-01-10T00:00:00Z",
        },
        {
          id: "2",
          userId: "user2",
          userName: "ReadingAddict",
          rating: 4,
          content:
            "A compelling read with beautiful prose. While some parts felt a bit slow, the overall story was engaging and the ending was satisfying.",
          recommended: true,
          createdAt: "2024-01-08T00:00:00Z",
        },
        {
          id: "3",
          userId: "user3",
          userName: "CriticalReader",
          rating: 3,
          content:
            "Good book but didn't live up to the hype for me. The writing was solid but I found some of the plot points predictable.",
          recommended: false,
          createdAt: "2024-01-05T00:00:00Z",
        },
      ]
      setReviews(mockReviews)
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
    }
  }

  const submitReview = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to write a review.",
        variant: "destructive",
      })
      return
    }

    if (!newReview.trim() || newRating === 0) {
      toast({
        title: "Incomplete review",
        description: "Please provide both a rating and review text.",
        variant: "destructive",
      })
      return
    }

    setSubmittingReview(true)
    try {
      // Mock review submission
      const review: Review = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        userName: user.name,
        rating: newRating,
        content: newReview,
        recommended,
        createdAt: new Date().toISOString(),
      }

      setReviews([review, ...reviews])
      setNewReview("")
      setNewRating(0)
      setRecommended(false)

      toast({
        title: "Review submitted!",
        description: "Your review has been published.",
      })
    } catch (error) {
      console.error("Failed to submit review:", error)
      toast({
        title: "Failed to submit review",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Book not found</h1>
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
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Books
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">BookBurst</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Book Details */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <img
                  src={book.cover || "/placeholder.svg"}
                  alt={book.title}
                  className="w-full h-80 object-cover rounded-lg mb-4"
                />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-lg text-gray-600 mb-4">{book.author}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Your Status:</span>
                    <Badge
                      className={
                        book.status === "reading"
                          ? "bg-blue-100 text-blue-800"
                          : book.status === "finished"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {book.status === "reading" ? "Reading" : book.status === "finished" ? "Finished" : "Want to Read"}
                    </Badge>
                  </div>

                  {book.rating && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Your Rating:</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < book.rating! ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">{book.rating}/5</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Community Rating:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{averageRating.toFixed(1)}</span>
                      <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
                    </div>
                  </div>

                  {book.notes && (
                    <div>
                      <span className="text-sm text-gray-600 block mb-1">Your Notes:</span>
                      <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">{book.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Write Review */}
            {user && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Write a Review</span>
                  </CardTitle>
                  <CardDescription>Share your thoughts about this book with the community</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Rating</label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= newRating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-sm text-gray-600 ml-2">
                        {newRating > 0 ? `${newRating}/5` : "Select rating"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Review</label>
                    <Textarea
                      placeholder="What did you think of this book?"
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="recommended"
                      checked={recommended}
                      onChange={(e) => setRecommended(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="recommended" className="text-sm text-gray-700">
                      I would recommend this book
                    </label>
                  </div>

                  <Button onClick={submitReview} disabled={submittingReview} className="w-full">
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Reviews List */}
            <Card>
              <CardHeader>
                <CardTitle>Community Reviews ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                    <p className="text-gray-600">Be the first to review this book!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{review.userName}</h4>
                            <div className="flex items-center space-x-2 mt-1">
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
                              {review.recommended && (
                                <Badge className="bg-green-100 text-green-800 text-xs">Recommended</Badge>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
