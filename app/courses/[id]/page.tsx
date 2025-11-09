"use client"

import type React from "react"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Clock, Users, CheckCircle2, Play } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CourseCard } from "@/components/course-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { courses, reviews } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function CourseDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })

  const course = courses.find((c) => c.id === params.id)
  const courseReviews = reviews.filter(
    (r) => r.itemId === params.id && r.itemType === "course" && r.status === "approved",
  )
  const relatedCourses = courses.filter((c) => c.id !== params.id).slice(0, 3)

  const averageRating =
    courseReviews.length > 0
      ? (courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length).toFixed(1)
      : "0.0"

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Course not found</h1>
            <Link href="/courses" className="mt-4 inline-block">
              <Button>Back to Courses</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const lessonsList = [
    "Introduction to the Course",
    "Getting Started with the Basics",
    "Core Concepts and Fundamentals",
    "Intermediate Techniques",
    "Advanced Strategies",
    "Real-world Projects",
    "Best Practices",
    "Final Assessment",
  ]

  const markdownDescription = `
## About This Course

${course.description}

### What You'll Learn

- Master **core concepts** and fundamentals
- Build real-world projects from scratch
- Learn industry best practices
- Get hands-on experience with practical exercises
- Understand advanced techniques

### Course Structure

This comprehensive course is designed for learners of all levels. Whether you're a complete beginner or looking to enhance your skills, you'll find valuable content throughout.

> *"The best investment you can make is in yourself."*

### Requirements

- Basic computer skills
- Enthusiasm to learn
- No prior experience needed
  `.trim()

  const handleEnroll = () => {
    toast({
      title: "Enrollment successful!",
      description: `You've been enrolled in ${course.title}`,
    })
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Review submitted!",
      description: "Your review has been submitted and is pending approval.",
    })
    setNewReview({ rating: 5, comment: "" })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Course Hero */}
        <section className="bg-gradient-to-b from-primary/10 via-background to-background py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Course Info */}
              <div className="lg:col-span-2">
                <Badge variant="secondary" className="mb-3">
                  Online Course
                </Badge>
                <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  {course.title}
                </h1>
                <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">{course.description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-primary text-primary" />
                    <span className="font-semibold">{averageRating}</span>
                    <span className="text-muted-foreground">({courseReviews.length} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-5 w-5" />
                    <span>2,540 students enrolled</span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Created by <span className="font-medium text-foreground">{course.instructor}</span>
                  </p>
                </div>
              </div>

              {/* Course Card */}
              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg bg-muted">
                    <Image
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 backdrop-blur-sm transition-transform hover:scale-110">
                        <Play className="h-8 w-8 fill-primary-foreground text-primary-foreground" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-3xl font-bold">${course.price}</p>
                    <Button size="lg" className="mt-4 w-full" onClick={handleEnroll}>
                      Enroll Now
                    </Button>
                    <div className="mt-6 space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Lessons</span>
                        <span className="font-medium">{course.lessons}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Level</span>
                        <span className="font-medium">All Levels</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Access</span>
                        <span className="font-medium">Lifetime</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full max-w-lg grid-cols-3">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews ({courseReviews.length})</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="mt-6">
                    <Card>
                      <CardContent className="p-6">
                        <MarkdownRenderer content={markdownDescription} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="content" className="mt-6">
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="mb-4 text-lg font-semibold">Course Content</h3>
                        <div className="space-y-2">
                          {lessonsList.map((lesson, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted"
                            >
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{lesson}</p>
                              </div>
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {Math.floor(Math.random() * 20 + 5)} min
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="reviews" className="mt-6">
                    <div className="space-y-6">
                      {/* Rating Summary */}
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-4xl font-bold">{averageRating}</span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-5 w-5 ${
                                        star <= Math.round(Number(averageRating))
                                          ? "fill-primary text-primary"
                                          : "text-muted-foreground"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                Based on {courseReviews.length} reviews
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Review Form */}
                      <Card>
                        <CardContent className="p-6">
                          <h3 className="mb-4 text-lg font-semibold">Write a Review</h3>
                          <form onSubmit={handleSubmitReview} className="space-y-4">
                            <div>
                              <Label>Rating</Label>
                              <div className="mt-2 flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                    className="transition-transform hover:scale-110"
                                  >
                                    <Star
                                      className={`h-6 w-6 ${
                                        star <= newReview.rating ? "fill-primary text-primary" : "text-muted-foreground"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="comment">Your Review</Label>
                              <Textarea
                                id="comment"
                                placeholder="Share your experience with this course..."
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                className="mt-2 min-h-[100px]"
                                required
                              />
                            </div>
                            <Button type="submit">Submit Review</Button>
                          </form>
                        </CardContent>
                      </Card>

                      {/* Reviews List */}
                      <div className="space-y-4">
                        {courseReviews.map((review) => (
                          <Card key={review.id}>
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                                    {review.userName.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-medium">{review.userName}</p>
                                    <div className="mt-1 flex items-center gap-2">
                                      <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star
                                            key={star}
                                            className={`h-4 w-4 ${
                                              star <= review.rating
                                                ? "fill-primary text-primary"
                                                : "text-muted-foreground"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                      <span className="text-sm text-muted-foreground">{review.createdAt}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <p className="mt-3 leading-relaxed text-muted-foreground">{review.comment}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="lg:col-span-1">
                {/* Instructor Info */}
                <div>
                  <h2 className="mb-4 text-2xl font-bold">Instructor</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                          {course.instructor.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{course.instructor}</p>
                          <p className="text-sm text-muted-foreground">Expert Instructor</p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        Professional instructor with years of experience in the field, dedicated to helping students
                        achieve their goals.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* What You'll Learn */}
                <div className="mt-6">
                  <h2 className="mb-4 text-2xl font-bold">What You'll Learn</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {["Master core concepts", "Build real projects", "Learn best practices", "Get certified"].map(
                          (item, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <section className="border-t border-border/40 bg-muted/30 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="mb-8 text-balance text-2xl font-bold tracking-tight sm:text-3xl">
                More Courses You Might Like
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {relatedCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
