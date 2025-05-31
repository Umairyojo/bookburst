"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
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

interface EditBookDialogProps {
  book: Book
  open: boolean
  onOpenChange: (open: boolean) => void
  onBookUpdated: () => void
}

export function EditBookDialog({ book, open, onOpenChange, onBookUpdated }: EditBookDialogProps) {
  const [status, setStatus] = useState(book.status)
  const [rating, setRating] = useState(book.rating || 0)
  const [notes, setNotes] = useState(book.notes || "")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const updateBook = async () => {
    setLoading(true)
    try {
      const updateData = {
        status,
        rating: rating > 0 ? rating : undefined,
        notes: notes.trim() || undefined,
      }

      const response = await fetch(`/api/books/${book.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        toast({
          title: "Book updated!",
          description: `${book.title} has been updated.`,
        })
        onBookUpdated()
        onOpenChange(false)
      } else {
        throw new Error("Failed to update book")
      }
    } catch (error) {
      console.error("Failed to update book:", error)
      toast({
        title: "Failed to update book",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>Update your reading progress and notes for {book.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <img src={book.cover || "/placeholder.svg"} alt={book.title} className="w-16 h-24 object-cover rounded" />
            <div>
              <h3 className="font-semibold">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author}</p>
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
              <Label>Rating</Label>
              <div className="flex items-center space-x-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star === rating ? 0 : star)}
                    className="focus:outline-none"
                  >
                    <Star className={`h-6 w-6 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                  </button>
                ))}
                <span className="text-sm text-gray-600 ml-2">{rating > 0 ? `${rating}/5` : "No rating"}</span>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add your thoughts about this book..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={updateBook} disabled={loading} className="flex-1">
                {loading ? "Updating..." : "Update Book"}
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
