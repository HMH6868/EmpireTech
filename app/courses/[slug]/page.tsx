"use client"

import type React from "react"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Clock, Users, CheckCircle2, Play, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react"
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
import { courses, reviews, comments } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/hooks/use-language"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function CourseDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const { language, currency, formatCurrency } = useLanguage()
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [newComment, setNewComment] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const course = courses.find((c) => c.slug === params.slug)
  const courseReviews = reviews.filter(
    (r) => r.itemId === course?.id && r.itemType === "course" && r.status === "approved",
  )

  const courseComments = comments.filter(
    (c) => c.itemId === course?.id && c.itemType === "course" && c.status === "approved",
  )

  const relatedCourses = courses.filter((c) => c.slug !== course?.slug).slice(0, 3)

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
            <h1 className="text-2xl font-bold">{language === "vi" ? "Không tìm thấy khóa học" : "Course not found"}</h1>
            <Link href="/courses" className="mt-4 inline-block">
              <Button>{language === "vi" ? "Quay lại danh sách khóa học" : "Back to Courses"}</Button>
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

  const courseDescription = course?.description[language] ?? ""
  const markdownDescription = `
## ${language === "vi" ? "Giới thiệu khóa học" : "About This Course"}

${courseDescription}

### ${language === "vi" ? "Bạn sẽ học được" : "What You'll Learn"}

- ${language === "vi" ? "Nắm vững kiến thức cốt lõi" : "Master core concepts and fundamentals"}
- ${language === "vi" ? "Xây dựng dự án thực tế" : "Build real-world projects from scratch"}
- ${language === "vi" ? "Áp dụng best-practice mới nhất" : "Learn industry best practices"}
- ${language === "vi" ? "Tương tác qua bài tập thực hành" : "Get hands-on experience with practical exercises"}
- ${language === "vi" ? "Tiếp cận kỹ thuật nâng cao" : "Understand advanced techniques"}

### ${language === "vi" ? "Cấu trúc khóa học" : "Course Structure"}

${language === "vi"
    ? "Khoá học phù hợp cho cả người mới bắt đầu lẫn học viên nâng cao, có lộ trình rõ ràng và bài tập thực tế."
    : "This comprehensive course is designed for learners of all levels with real-world practice projects."}

> *${language === "vi" ? "Đầu tư tốt nhất là đầu tư cho bản thân." : '"The best investment you can make is in yourself."'}*

### ${language === "vi" ? "Yêu cầu" : "Requirements"}

- ${language === "vi" ? "Máy tính và kết nối Internet" : "Basic computer skills"}
- ${language === "vi" ? "Tinh thần ham học hỏi" : "Enthusiasm to learn"}
- ${language === "vi" ? "Không yêu cầu kinh nghiệm trước" : "No prior experience needed"}
  `.trim()

  const handleEnroll = () => {
    toast({
      title: language === "vi" ? "Đăng ký thành công!" : "Enrollment successful!",
      description:
        language === "vi"
          ? `Bạn đã đăng ký khóa ${course.title[language]}`
          : `You've been enrolled in ${course.title[language]}`,
    })
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: language === "vi" ? "Đã gửi đánh giá!" : "Review submitted!",
      description:
        language === "vi"
          ? "Đánh giá của bạn đã được gửi và đang chờ duyệt."
          : "Your review has been submitted and is pending approval.",
    })
    setNewReview({ rating: 5, comment: "" })
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: language === "vi" ? "Đã gửi bình luận!" : "Comment posted!",
      description:
        language === "vi"
          ? "Bình luận của bạn đã được gửi và đang chờ duyệt."
          : "Your comment has been submitted and is pending approval.",
    })
    setNewComment("")
  }

  const galleryImages = course.images || [course.thumbnail]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
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
                  {language === "vi" ? "Khoá học trực tuyến" : "Online Course"}
                </Badge>
                <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  {course.title[language]}
                </h1>
                <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                  {course.description[language]}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-primary text-primary" />
                    <span className="font-semibold">{averageRating}</span>
                    <span className="text-muted-foreground">
                      ({courseReviews.length} {language === "vi" ? "đánh giá" : "reviews"})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-5 w-5" />
                    <span>
                      2,540 {language === "vi" ? "học viên đã đăng ký" : "students enrolled"}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    {language === "vi" ? "Giảng viên" : "Created by"}{" "}
                    <span className="font-medium text-foreground">{course.instructor}</span>
                  </p>
                </div>
              </div>

              {/* Course Card */}
              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg bg-muted">
                    <Image
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title[language]}
                      fill
                      className="object-cover"
                    />
                    {galleryImages.length > 1 ? (
                      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                        <DialogTrigger asChild>
                          <div className="absolute inset-0 flex cursor-pointer items-center justify-center transition-colors hover:bg-black/20">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 backdrop-blur-sm transition-transform hover:scale-110">
                              <Play className="h-8 w-8 fill-primary-foreground text-primary-foreground" />
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>
                              {course.title[language]} - {language === "vi" ? "Xem trước" : "Preview"}
                            </DialogTitle>
                            <DialogDescription>
                              {language === "vi" ? "Xem hình ảnh khóa học" : "View course images"}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="relative">
                            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                              <Image
                                src={galleryImages[currentImageIndex] || "/placeholder.svg"}
                                alt={`${course.title[language]} ${currentImageIndex + 1}`}
                                fill
                                className="object-contain"
                              />
                            </div>
                            {galleryImages.length > 1 && (
                              <>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                                  onClick={prevImage}
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                                  onClick={nextImage}
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                          {galleryImages.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                              {galleryImages.map((img, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentImageIndex(idx)}
                                  className={`relative aspect-video overflow-hidden rounded-lg border-2 transition-all ${
                                    currentImageIndex === idx ? "border-primary" : "border-transparent"
                                  }`}
                                >
                                  <Image
                                    src={img || "/placeholder.svg"}
                                    alt={`${course.title[language]} ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 backdrop-blur-sm transition-transform hover:scale-110">
                          <Play className="h-8 w-8 fill-primary-foreground text-primary-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <p className="text-3xl font-bold">{formatCurrency(course.price[currency], { currency })}</p>
                    <Button size="lg" className="mt-4 w-full" onClick={handleEnroll}>
                      {language === "vi" ? "Đăng ký ngay" : "Enroll Now"}
                    </Button>
                    <div className="mt-6 space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{language === "vi" ? "Số bài học" : "Lessons"}</span>
                        <span className="font-medium">{course.lessons}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{language === "vi" ? "Thời lượng" : "Duration"}</span>
                        <span className="font-medium">{course.duration[language]}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{language === "vi" ? "Trình độ" : "Level"}</span>
                        <span className="font-medium">{language === "vi" ? "Mọi trình độ" : "All Levels"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{language === "vi" ? "Thời hạn" : "Access"}</span>
                        <span className="font-medium">{language === "vi" ? "Trọn đời" : "Lifetime"}</span>
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
                    <TabsTrigger value="description">{language === "vi" ? "Mô tả" : "Description"}</TabsTrigger>
                    <TabsTrigger value="content">{language === "vi" ? "Nội dung" : "Content"}</TabsTrigger>
                    <TabsTrigger value="reviews">
                      {language === "vi" ? "Đánh giá" : "Reviews"} ({courseReviews.length})
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="mt-6">
                    <Card>
                      <CardContent className="p-6">
                        <MarkdownRenderer content={markdownDescription} />
                      </CardContent>
                    </Card>

                    <div className="mt-6">
                      <h3 className="mb-4 text-xl font-semibold">
                        {language === "vi" ? "Bình luận" : "Comments"}
                      </h3>
                      <div className="space-y-6">
                        {/* Comment Form */}
                        <Card>
                          <CardContent className="p-6">
                            <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                              <MessageCircle className="h-5 w-5" />
                              {language === "vi" ? "Đặt câu hỏi hoặc bình luận" : "Post a Comment"}
                            </h4>
                            <form onSubmit={handleSubmitComment} className="space-y-4">
                              <div>
                                <Textarea
                                  placeholder={
                                    language === "vi"
                                      ? "Đặt câu hỏi hoặc chia sẻ suy nghĩ của bạn..."
                                      : "Ask a question or share your thoughts..."
                                  }
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  className="min-h-[100px]"
                                  required
                                />
                              </div>
                              <Button type="submit">{language === "vi" ? "Gửi bình luận" : "Post Comment"}</Button>
                            </form>
                          </CardContent>
                        </Card>

                        {/* Comments List */}
                        <div className="space-y-4">
                          {courseComments.map((comment) => (
                            <Card key={comment.id}>
                              <CardContent className="p-6">
                                <div className="flex items-start gap-3">
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                                    {comment.userName.charAt(0)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium">{comment.userName}</p>
                                      <span className="text-sm text-muted-foreground">{comment.createdAt}</span>
                                    </div>
                                    <p className="mt-2 leading-relaxed text-muted-foreground">
                                      {comment.comment[language]}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
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
                              {language === "vi"
                                ? `Dựa trên ${courseReviews.length} đánh giá`
                                : `Based on ${courseReviews.length} reviews`}
                            </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Review Form */}
                      <Card>
                        <CardContent className="p-6">
                        <h3 className="mb-4 text-lg font-semibold">
                          {language === "vi" ? "Viết đánh giá" : "Write a Review"}
                        </h3>
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
                            <Label htmlFor="comment">{language === "vi" ? "Nội dung đánh giá" : "Your Review"}</Label>
                            <Textarea
                              id="comment"
                              placeholder={
                                language === "vi"
                                  ? "Chia sẻ trải nghiệm của bạn với khóa học..."
                                  : "Share your experience with this course..."
                              }
                              value={newReview.comment}
                              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                              className="mt-2 min-h-[100px]"
                              required
                            />
                          </div>
                          <Button type="submit">{language === "vi" ? "Gửi đánh giá" : "Submit Review"}</Button>
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
                            <p className="mt-3 leading-relaxed text-muted-foreground">
                              {review.comment[language]}
                            </p>
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
                  <h2 className="mb-4 text-2xl font-bold">{language === "vi" ? "Giảng viên" : "Instructor"}</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                          {course.instructor.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{course.instructor}</p>
                          <p className="text-sm text-muted-foreground">
                            {language === "vi" ? "Chuyên gia hướng dẫn" : "Expert Instructor"}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {language === "vi"
                          ? "Giảng viên giàu kinh nghiệm, tận tâm đồng hành cùng học viên đạt mục tiêu."
                          : "Professional instructor dedicated to helping students achieve their goals."}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* What You'll Learn */}
                <div className="mt-6">
                  <h2 className="mb-4 text-2xl font-bold">
                    {language === "vi" ? "Bạn sẽ học được gì" : "What You'll Learn"}
                  </h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        {(language === "vi"
                          ? ["Nắm vững kiến thức cốt lõi", "Thực hành dự án thật", "Áp dụng best-practice", "Nhận chứng nhận"]
                          : ["Master core concepts", "Build real projects", "Learn best practices", "Get certified"]
                        ).map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
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
                {language === "vi" ? "Khoá học liên quan" : "More Courses You Might Like"}
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
