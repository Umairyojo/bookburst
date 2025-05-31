"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditBookDialog } from "@/components/edit-book-dialog"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

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

interface BookCardProps {
  book: Book
  onUpdate: () => void
}

export function BookCard({ book, onUpdate }: BookCardProps) {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const { toast } = useToast()

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

  const deleteBook = async () => {
    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Book removed",
          description: `${book.title} has been removed from your bookshelf.`,
        })
        onUpdate()
      } else {
        throw new Error("Failed to delete book")
      }
    } catch (error) {
      console.error("Failed to delete book:", error)
      toast({
        title: "Failed to remove book",
        description: "Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="relative">
            <Link href={`/book/${book.id}`}>
              <img
                src={book.cover || "/placeholder.svg"}
                alt={book.title}
                className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
              />
            </Link>
            <Badge className={`absolute top-2 right-2 ${getStatusColor(book.status)}`}>
              {getStatusLabel(book.status)}
            </Badge>
          </div>
          <div className="p-4">
            <Link href={`/book/${book.id}`}>
              <h3 className="font-semibold text-lg mb-1 hover:text-primary cursor-pointer line-clamp-2">
                {book.title}
              </h3>
            </Link>
            <p className="text-gray-600 text-sm mb-2">{book.author}</p>

            {book.rating && (
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < book.rating! ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">{book.rating}/5</span>
              </div>
            )}

            {book.notes && <p className="text-sm text-gray-600 line-clamp-2">{book.notes}</p>}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <span className="text-xs text-gray-500">Added {new Date(book.dateAdded).toLocaleDateString()}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={deleteBook} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>

      <EditBookDialog book={book} open={showEditDialog} onOpenChange={setShowEditDialog} onBookUpdated={onUpdate} />
    </>
  )
}
