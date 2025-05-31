"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AddBookDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onBookAdded: () => void
}

interface GoogleBook {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    imageLinks?: {
      thumbnail: string
    }
    description?: string
  }
}

export function AddBookDialog({ open, onOpenChange, onBookAdded }: AddBookDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<GoogleBook[]>([])
  const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null)
  const [status, setStatus] = useState<"reading" | "finished" | "want-to-read">("want-to-read")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const { toast } = useToast()

  const searchBooks = async () => {
    if (!searchQuery.trim()) return

    setSearching(true)
    try {
      const response = await fetch(`/api/books/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.items || [])
      }
    } catch (error) {
      console.error("Search failed:", error)
      toast({
        title: "Search failed",
        description: "Unable to search for books. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSearching(false)
    }
  }

  const addBook = async () => {
    if (!selectedBook) return

    setLoading(true)
    try {
      const bookData = {
        title: selectedBook.volumeInfo.title,
        author: selectedBook.volumeInfo.authors?.[0] || "Unknown Author",
        cover: selectedBook.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg?height=200&width=150",
        status,
        notes,
      }

      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      })

      if (response.ok) {
        toast({
          title: "Book added!",
          description: `${bookData.title} has been added to your bookshelf.`,
        })
        onBookAdded()
        onOpenChange(false)
        resetForm()
      } else {
        throw new Error("Failed to add book")
      }
    } catch (error) {
      console.error("Failed to add book:", error)
      toast({
        title: "Failed to add book",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSearchQuery("")
    setSearchResults([])
    setSelectedBook(null)
    setStatus("want-to-read")
    setNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add a Book</DialogTitle>
          <DialogDescription>Search for a book and add it to your bookshelf</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedBook ? (
            <>
              <div className="flex space-x-2">
                <Input
                  placeholder="Search for books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchBooks()}
                />
                <Button onClick={searchBooks} disabled={searching}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedBook(book)}
                    >
                      <img
                        src={book.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg?height=60&width=40"}
                        alt={book.volumeInfo.title}
                        className="w-10 h-15 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{book.volumeInfo.title}</h4>
                        <p className="text-sm text-gray-600">
                          {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-start space-x-4 p-4 border rounded-lg">
                <img
                  src={selectedBook.volumeInfo.imageLinks?.thumbnail || "/placeholder.svg?height=120&width=80"}
                  alt={selectedBook.volumeInfo.title}
                  className="w-20 h-30 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedBook.volumeInfo.title}</h3>
                  <p className="text-gray-600">{selectedBook.volumeInfo.authors?.join(", ") || "Unknown Author"}</p>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedBook(null)} className="mt-2">
                    Choose Different Book
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Reading Status</Label>
                  <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="want-to-read">Want to Read</SelectItem>
                      <SelectItem value="reading">Currently Reading</SelectItem>
                      <SelectItem value="finished">Finished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any personal notes about this book..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={addBook} disabled={loading} className="flex-1">
                    {loading ? "Adding..." : "Add to Bookshelf"}
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedBook(null)}>
                    Back
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
