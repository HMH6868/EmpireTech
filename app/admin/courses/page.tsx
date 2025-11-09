"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit, Trash2, Search, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { adminCourses, type AdminCourse } from "@/lib/mock-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminCoursesPage() {
  const [courseList, setCourseList] = useState(adminCourses)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingCourse, setEditingCourse] = useState<AdminCourse | null>(null)

  const filteredCourses = courseList.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddCourse = () => {
    setEditingCourse(null)
    setIsDialogOpen(true)
  }

  const handleEditCourse = (course: AdminCourse) => {
    setEditingCourse(course)
    setIsDialogOpen(true)
  }

  const handleDeleteCourse = (id: string) => {
    setCourseList(courseList.filter((course) => course.id !== id))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newCourse: AdminCourse = {
      id: editingCourse?.id || String(courseList.length + 1),
      title: formData.get("title") as string,
      instructor: formData.get("instructor") as string,
      price: Number.parseFloat(formData.get("price") as string),
      status: formData.get("status") as "Published" | "Draft",
      createdAt: editingCourse?.createdAt || new Date().toISOString().split("T")[0],
    }

    if (editingCourse) {
      setCourseList(courseList.map((c) => (c.id === editingCourse.id ? newCourse : c)))
    } else {
      setCourseList([...courseList, newCourse])
    }

    setIsDialogOpen(false)
    setEditingCourse(null)
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Courses</h1>
          <p className="mt-2 text-muted-foreground">Add, edit, or remove courses from your catalog</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={handleAddCourse}>
              <Plus className="h-4 w-4" />
              Add New Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
                <DialogDescription>
                  {editingCourse
                    ? "Update the course details below."
                    : "Fill in the details for the new course. Use Markdown for description."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Complete Web Development Bootcamp"
                    defaultValue={editingCourse?.title}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="instructor">Instructor Name</Label>
                  <Input
                    id="instructor"
                    name="instructor"
                    placeholder="John Smith"
                    defaultValue={editingCourse?.instructor}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="49.99"
                    defaultValue={editingCourse?.price}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="thumbnail">Thumbnail Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="thumbnail"
                      name="thumbnail"
                      placeholder="/placeholder.svg?height=300&width=400"
                      defaultValue=""
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Enter image URL or click upload icon (mock)</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Markdown)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="## Course Overview&#10;&#10;Learn **full-stack development** from scratch...&#10;&#10;### What You'll Build:&#10;- Real-world projects&#10;- Portfolio websites"
                    defaultValue=""
                    className="min-h-[150px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports Markdown formatting (headers, bold, lists, etc.)
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={editingCourse?.status || "Draft"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingCourse ? "Update" : "Create"} Course</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Courses ({filteredCourses.length})</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Title</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Instructor</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Price</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Created</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm font-medium">{course.title}</td>
                    <td className="py-3 text-sm text-muted-foreground">{course.instructor}</td>
                    <td className="py-3 text-sm font-medium">${course.price}</td>
                    <td className="py-3">
                      <Badge variant={course.status === "Published" ? "default" : "secondary"}>{course.status}</Badge>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">{course.createdAt}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditCourse(course)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDeleteCourse(course.id)}
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
    </div>
  )
}
