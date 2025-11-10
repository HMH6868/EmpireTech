'use client';

import type React from 'react';

import { CourseCard } from '@/components/course-card';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { comments, courses, reviews } from '@/lib/mock-data';
import {
  Award,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageCircle,
  Play,
  ShoppingCart,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function CourseDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const { language, currency, formatCurrency } = useLanguage();
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [newComment, setNewComment] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const course = courses.find((c) => c.slug === params.slug);
  const courseReviews = reviews.filter(
    (r) => r.itemId === course?.id && r.itemType === 'course' && r.status === 'approved'
  );

  const courseComments = comments.filter(
    (c) => c.itemId === course?.id && c.itemType === 'course' && c.status === 'approved'
  );

  const relatedCourses = courses.filter((c) => c.slug !== course?.slug).slice(0, 4);

  const averageRating =
    courseReviews.length > 0
      ? (courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length).toFixed(1)
      : '0.0';

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              {language === 'vi' ? 'Không tìm thấy khóa học' : 'Course not found'}
            </h1>
            <Link href="/courses" className="mt-4 inline-block">
              <Button>
                {language === 'vi' ? 'Quay lại danh sách khóa học' : 'Back to Courses'}
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const courseDescription = course?.description[language] ?? '';
  const galleryImages = course.images || [course.thumbnail];

  const handleEnroll = () => {
    toast({
      title: language === 'vi' ? 'Đăng ký thành công!' : 'Enrollment successful!',
      description:
        language === 'vi'
          ? `Bạn đã đăng ký khóa ${course.title[language]}`
          : `You've been enrolled in ${course.title[language]}`,
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: language === 'vi' ? 'Đã gửi đánh giá!' : 'Review submitted!',
      description:
        language === 'vi'
          ? 'Đánh giá của bạn đã được gửi và đang chờ duyệt.'
          : 'Your review has been submitted and is pending approval.',
    });
    setNewReview({ rating: 5, comment: '' });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: language === 'vi' ? 'Đã gửi bình luận!' : 'Comment posted!',
      description:
        language === 'vi'
          ? 'Bình luận của bạn đã được gửi và đang chờ duyệt.'
          : 'Your comment has been submitted and is pending approval.',
    });
    setNewComment('');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Course Details */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Course Image with Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={course.thumbnail || '/placeholder.svg'}
                    alt={course.title[language]}
                    fill
                    className="object-cover"
                  />
                </div>
                {galleryImages.length > 1 && (
                  <div className="flex items-center gap-2">
                    <div className="grid flex-1 grid-cols-4 gap-2">
                      {galleryImages.slice(0, 3).map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                            currentImageIndex === idx ? 'border-primary' : 'border-transparent'
                          }`}
                        >
                          <Image
                            src={img || '/placeholder.svg'}
                            alt={`${course.title[language]} ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                      {galleryImages.length > 3 && (
                        <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                          <DialogTrigger asChild>
                            <button className="relative aspect-square overflow-hidden rounded-lg border-2 border-transparent bg-muted/50 transition-all hover:border-primary">
                              <div className="flex h-full items-center justify-center text-sm font-medium">
                                +{galleryImages.length - 3} {language === 'vi' ? 'ảnh' : 'more'}
                              </div>
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>
                                {course.title[language]} -{' '}
                                {language === 'vi' ? 'Bộ sưu tập' : 'Gallery'}
                              </DialogTitle>
                              <DialogDescription>
                                {language === 'vi'
                                  ? 'Xem toàn bộ hình ảnh khóa học'
                                  : 'View all course images'}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="relative">
                              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                                <Image
                                  src={galleryImages[currentImageIndex] || '/placeholder.svg'}
                                  alt={`${course.title[language]} ${currentImageIndex + 1}`}
                                  fill
                                  className="object-contain"
                                />
                              </div>
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
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                              {galleryImages.map((img, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentImageIndex(idx)}
                                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                                    currentImageIndex === idx
                                      ? 'border-primary'
                                      : 'border-transparent'
                                  }`}
                                >
                                  <Image
                                    src={img || '/placeholder.svg'}
                                    alt={`${course.title[language]} ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="flex flex-col">
                <div>
                  <Badge variant="secondary" className="mb-3">
                    <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                    {language === 'vi' ? 'Khoá học trực tuyến' : 'Online Course'}
                  </Badge>
                  <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                    {course.title[language]}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {language === 'vi' ? 'Giảng viên' : 'Instructor'}: {course.instructor}
                  </p>
                  {course.createdAt && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {language === 'vi' ? 'Ngày tạo' : 'Created'}:{' '}
                      {new Date(course.createdAt).toLocaleDateString(
                        language === 'vi' ? 'vi-VN' : 'en-US',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span className="text-lg font-semibold">{averageRating}</span>
                    </div>
                    <span className="text-muted-foreground">
                      ({courseReviews.length} {language === 'vi' ? 'đánh giá' : 'reviews'})
                    </span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-baseline gap-3">
                    <p className="text-4xl font-bold">
                      {formatCurrency(course.price[currency], { currency })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Check className="h-3 w-3" />
                      {language === 'vi' ? 'Có sẵn' : 'Available'}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Award className="h-3 w-3" />
                      {language === 'vi' ? 'Cấp chứng chỉ' : 'Certificate'}
                    </Badge>
                  </div>

                  {/* Features */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <BookOpen className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {language === 'vi' ? 'Bài học' : 'Lessons'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {course.lessons} {language === 'vi' ? 'bài học' : 'lessons'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {language === 'vi' ? 'Thời lượng' : 'Duration'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {course.duration[language]}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <Play className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {language === 'vi' ? 'Truy cập' : 'Access'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {language === 'vi' ? 'Trọn đời' : 'Lifetime'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button size="lg" className="flex-1 gap-2" onClick={handleEnroll}>
                      <ShoppingCart className="h-5 w-5" />
                      {language === 'vi' ? 'Thêm vào giỏ' : 'Add to Cart'}
                    </Button>
                    <Button size="lg" variant="outline" className="flex-1 bg-transparent">
                      {language === 'vi' ? 'Đăng ký ngay' : 'Enroll Now'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'vi' ? 'Mô tả chi tiết' : 'Course Details'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarkdownRenderer content={courseDescription} />
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'vi' ? 'Đánh giá từ học viên' : 'Student Reviews'} (
                      {courseReviews.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg border p-4">
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
                                      ? 'fill-primary text-primary'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {language === 'vi'
                              ? `Dựa trên ${courseReviews.length} đánh giá`
                              : `Based on ${courseReviews.length} reviews`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="mb-4 text-lg font-semibold">
                        {language === 'vi' ? 'Viết đánh giá' : 'Write a Review'}
                      </h3>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <Label>{language === 'vi' ? 'Đánh giá' : 'Rating'}</Label>
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
                                    star <= newReview.rating
                                      ? 'fill-primary text-primary'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="comment">
                            {language === 'vi' ? 'Nội dung đánh giá' : 'Your Review'}
                          </Label>
                          <Textarea
                            id="comment"
                            placeholder={
                              language === 'vi'
                                ? 'Chia sẻ trải nghiệm của bạn với khóa học này...'
                                : 'Share your experience with this course...'
                            }
                            value={newReview.comment}
                            onChange={(e) =>
                              setNewReview({ ...newReview, comment: e.target.value })
                            }
                            className="mt-2 min-h-[100px]"
                            required
                          />
                        </div>
                        <Button type="submit">
                          {language === 'vi' ? 'Gửi đánh giá' : 'Submit Review'}
                        </Button>
                      </form>
                    </div>

                    <div className="space-y-4">
                      {courseReviews.map((review) => (
                        <div key={review.id} className="rounded-lg border p-4">
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
                                            ? 'fill-primary text-primary'
                                            : 'text-muted-foreground'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {review.createdAt}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="mt-3 leading-relaxed text-muted-foreground">
                            {review.comment[language]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === 'vi' ? 'Câu hỏi & thảo luận' : 'Questions & Discussion'} (
                      {courseComments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                        <MessageCircle className="h-5 w-5" />
                        {language === 'vi' ? 'Đặt câu hỏi hoặc bình luận' : 'Post a Comment'}
                      </h3>
                      <form onSubmit={handleSubmitComment} className="space-y-4">
                        <Textarea
                          placeholder={
                            language === 'vi'
                              ? 'Đặt câu hỏi hoặc chia sẻ cảm nhận của bạn...'
                              : 'Ask a question or share your thoughts...'
                          }
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="min-h-[100px]"
                          required
                        />
                        <Button type="submit">
                          {language === 'vi' ? 'Gửi bình luận' : 'Post Comment'}
                        </Button>
                      </form>
                    </div>

                    <div className="space-y-4">
                      {courseComments.map((comment) => (
                        <div key={comment.id} className="rounded-lg border p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                              {comment.userName.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{comment.userName}</p>
                                <span className="text-sm text-muted-foreground">
                                  {comment.createdAt}
                                </span>
                              </div>
                              <p className="mt-2 leading-relaxed text-muted-foreground">
                                {comment.comment[language]}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <section className="border-t border-border/40 bg-muted/30 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="mb-8 text-balance text-2xl font-bold tracking-tight sm:text-3xl">
                {language === 'vi' ? 'Khóa học liên quan' : 'Related Courses'}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
  );
}
