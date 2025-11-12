"use client"

import { useState } from "react"
import { Eye, EyeOff, Trash2, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { reviews, type Review } from "@/lib/mock-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/hooks/use-locale"
import type { LocalizedText } from "@/lib/mock-data"

const getLocalizedString = (value: LocalizedText | string, lang: "en" | "vi") =>
  typeof value === "string" ? value : value[lang] ?? ""

const localizedToLower = (value: LocalizedText | string, lang: "en" | "vi") =>
  getLocalizedString(value, lang).toLowerCase()

export default function AdminReviewsPage() {
  const { locale } = useLanguage()
  const [reviewList, setReviewList] = useState(reviews)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "product" | "course">("all")
  const [filterRating, setFilterRating] = useState<"all" | "5" | "4" | "3" | "2" | "1">("all")
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  const filteredReviews = reviewList.filter((review) => {
    const normalizedQuery = searchQuery.toLowerCase()
    const matchesSearch =
      localizedToLower(review.itemName, locale).includes(normalizedQuery) ||
      review.userName.toLowerCase().includes(normalizedQuery) ||
      localizedToLower(review.comment, locale).includes(normalizedQuery)

    const matchesType = filterType === "all" || review.itemType === filterType
    const matchesRating = filterRating === "all" || review.rating === Number(filterRating)

    return matchesSearch && matchesType && matchesRating
  })

  const handleApprove = (id: string) => {
    setReviewList(reviewList.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r)))
  }

  const handleHide = (id: string) => {
    setReviewList(reviewList.map((r) => (r.id === id ? { ...r, status: "hidden" as const } : r)))
  }

  const handleDelete = (id: string) => {
    setReviewList(reviewList.filter((r) => r.id !== id))
    setSelectedReview(null)
  }

  const getStatusBadge = (status: Review["status"]) => {
    switch (status) {
      case "approved":
        return <Badge variant="default">Approved</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "hidden":
        return <Badge variant="outline">Hidden</Badge>
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Review Management</h1>
        <p className="mt-2 text-muted-foreground">Manage product and course reviews from users</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>All Reviews ({filteredReviews.length})</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Item Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="product">Products</SelectItem>
                  <SelectItem value="course">Courses</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterRating} onValueChange={(v) => setFilterRating(v as typeof filterRating)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">User</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Item</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Rating</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.map((review) => (
                  <tr
                    key={review.id}
                    className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-muted/50"
                    onClick={() => setSelectedReview(review)}
                  >
                    <td className="py-3 text-sm text-muted-foreground">#{review.id}</td>
                    <td className="py-3 text-sm font-medium">{review.userName}</td>
                    <td className="py-3 text-sm">{localizedToLower(review.itemName, locale) || review.id}</td>
                    <td className="py-3">
                      <Badge variant="secondary">{review.itemType}</Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-primary text-primary" />
                        <span className="text-sm font-medium">{review.rating}</span>
                      </div>
                    </td>
                    <td className="py-3">{getStatusBadge(review.status)}</td>
                    <td className="py-3 text-sm text-muted-foreground">{review.createdAt}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        {review.status !== "approved" && (
                          <Button variant="ghost" size="icon" onClick={() => handleApprove(review.id)} title="Approve">
                            <Eye className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        {review.status !== "hidden" && (
                          <Button variant="ghost" size="icon" onClick={() => handleHide(review.id)} title="Hide">
                            <EyeOff className="h-4 w-4 text-orange-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(review.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Review Detail Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>View complete review information</DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Review ID</p>
                  <p className="text-sm">#{selectedReview.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedReview.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User</p>
                  <p className="text-sm">{selectedReview.userName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="text-sm">{selectedReview.createdAt}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Item</p>
                <p className="text-sm">{getLocalizedString(selectedReview.itemName, locale)}</p>
                <Badge variant="secondary" className="mt-1">
                  {selectedReview.itemType}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rating</p>
                <div className="mt-1 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= selectedReview.rating ? "fill-primary text-primary" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium">{selectedReview.rating}/5</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Comment</p>
                <p className="mt-1 rounded-lg bg-muted p-3 text-sm leading-relaxed">
                  {getLocalizedString(selectedReview.comment, locale)}
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                {selectedReview.status !== "approved" && (
                  <Button onClick={() => handleApprove(selectedReview.id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                )}
                {selectedReview.status !== "hidden" && (
                  <Button variant="outline" onClick={() => handleHide(selectedReview.id)}>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Hide
                  </Button>
                )}
                <Button variant="destructive" onClick={() => handleDelete(selectedReview.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
