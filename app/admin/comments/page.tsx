"use client"

import { useState } from "react"
import { Search, Eye, EyeOff, Trash2, MessageCircle } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { comments } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function AdminCommentsPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.comment.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || comment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleApprove = (id: string) => {
    toast({
      title: "Comment approved",
      description: "The comment has been approved and is now visible.",
    })
  }

  const handleHide = (id: string) => {
    toast({
      title: "Comment hidden",
      description: "The comment has been hidden from public view.",
    })
  }

  const handleDelete = (id: string) => {
    toast({
      title: "Comment deleted",
      description: "The comment has been permanently deleted.",
      variant: "destructive",
    })
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 bg-muted/30 p-8 md:ml-64">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Comments Management</h1>
          <p className="mt-2 text-muted-foreground">Manage user comments on products and courses</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              All Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by user or comment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        No comments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredComments.map((comment) => (
                      <TableRow key={comment.id}>
                        <TableCell className="font-medium">{comment.userName}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="max-w-xs truncate text-left hover:underline">{comment.comment}</button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Comment Details</DialogTitle>
                                <DialogDescription>Posted by {comment.userName}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm font-medium">Full Comment:</p>
                                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                    {comment.comment}
                                  </p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="font-medium">Item Type:</p>
                                    <p className="text-muted-foreground capitalize">{comment.itemType}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Posted Date:</p>
                                    <p className="text-muted-foreground">{comment.createdAt}</p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell className="capitalize">{comment.itemType}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{comment.itemType}</Badge>
                        </TableCell>
                        <TableCell>{comment.createdAt}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              comment.status === "approved"
                                ? "default"
                                : comment.status === "pending"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {comment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {comment.status !== "approved" && (
                              <Button size="sm" variant="outline" onClick={() => handleApprove(comment.id)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            {comment.status !== "hidden" && (
                              <Button size="sm" variant="outline" onClick={() => handleHide(comment.id)}>
                                <EyeOff className="h-4 w-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline" onClick={() => handleDelete(comment.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
