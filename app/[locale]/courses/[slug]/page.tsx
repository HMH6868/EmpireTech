'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/use-locale';
import {
  Award,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Play,
  ShoppingCart,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Course = {
  id: string;
  slug: string;
  title_en: string;
  title_vi: string;
  thumbnail?: string;
  instructor: string;
  price_usd: number;
  price_vnd: number;
  description_en?: string;
  description_vi?: string;
  created_at?: string;
  images?: Array<{
    id: string;
    image_url: string;
    order_index: number;
  }>;
};

type Comment = {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
  user?: {
    full_name: string;
  };
};

export default function CourseDetailPage() {
  const params = useParams();
  const { locale, currency, formatCurrency } = useLanguage();
  const [course, setCourse] = useState<Course | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [comments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [params.slug]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/courses');
      const data = await response.json();

      if (data.courses) {
        const foundCourse = data.courses.find((c: Course) => c.slug === params.slug);
        setCourse(foundCourse || null);

        if (foundCourse) {
          const related = data.courses
            .filter((c: Course) => c.slug !== foundCourse.slug)
            .slice(0, 4);
          setRelatedCourses(related);
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Không thể tải khóa học');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{locale === 'vi' ? 'Đang tải...' : 'Loading...'}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              {locale === 'vi' ? 'Không tìm thấy khóa học' : 'Course not found'}
            </h1>
            <Link href={`/${locale}/courses`} className="mt-4 inline-block">
              <Button>{locale === 'vi' ? 'Quay lại danh sách khóa học' : 'Back to Courses'}</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const courseTitle = locale === 'vi' ? course.title_vi : course.title_en;
  const courseDescription = locale === 'vi' ? course.description_vi : course.description_en;
  const price = currency === 'vnd' ? course.price_vnd : course.price_usd;

  const galleryImages =
    course.images && course.images.length > 0
      ? course.images.sort((a, b) => a.order_index - b.order_index).map((img) => img.image_url)
      : course.thumbnail
      ? [course.thumbnail]
      : ['/placeholder.svg'];

  const handleEnroll = () => {
    toast.success(
      locale === 'vi'
        ? `${courseTitle} đã được thêm vào giỏ hàng.`
        : `${courseTitle} has been added to your cart.`
    );
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      locale === 'vi'
        ? 'Bình luận của bạn đã được gửi và đang chờ duyệt.'
        : 'Your comment has been submitted and is pending approval.'
    );
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
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Course Image with Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={galleryImages[currentImageIndex] || '/placeholder.svg'}
                    alt={courseTitle}
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
                            alt={`${courseTitle} ${idx + 1}`}
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
                                +{galleryImages.length - 3} {locale === 'vi' ? 'ảnh' : 'more'}
                              </div>
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>
                                {courseTitle} - {locale === 'vi' ? 'Bộ sưu tập' : 'Gallery'}
                              </DialogTitle>
                              <DialogDescription>
                                {locale === 'vi'
                                  ? 'Xem toàn bộ hình ảnh khóa học'
                                  : 'View all course images'}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="relative">
                              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                                <Image
                                  src={galleryImages[currentImageIndex] || '/placeholder.svg'}
                                  alt={`${courseTitle} ${currentImageIndex + 1}`}
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
                                    alt={`${courseTitle} ${idx + 1}`}
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
                    {locale === 'vi' ? 'Khóa học trực tuyến' : 'Online Course'}
                  </Badge>
                  <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                    {courseTitle}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {locale === 'vi' ? 'Giảng viên' : 'Instructor'}: {course.instructor}
                  </p>
                  {course.created_at && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {locale === 'vi' ? 'Ngày tạo' : 'Created'}:{' '}
                      {new Date(course.created_at).toLocaleDateString(
                        locale === 'vi' ? 'vi-VN' : 'en-US',
                        { year: 'numeric', month: 'long', day: 'numeric' }
                      )}
                    </p>
                  )}
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-baseline gap-3">
                    <p className="text-4xl font-bold">{formatCurrency(price, { currency })}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Check className="h-3 w-3" />
                      {locale === 'vi' ? 'Có sẵn' : 'Available'}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Award className="h-3 w-3" />
                      {locale === 'vi' ? 'Cấp chứng chỉ' : 'Certificate'}
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
                              {locale === 'vi' ? 'Nội dung' : 'Content'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {locale === 'vi' ? 'Video bài giảng' : 'Video lectures'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <Play className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {locale === 'vi' ? 'Truy cập' : 'Access'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {locale === 'vi' ? 'Trọn đời' : 'Lifetime'}
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
                      {locale === 'vi' ? 'Thêm vào giỏ' : 'Add to Cart'}
                    </Button>
                    <Button size="lg" variant="outline" className="flex-1 bg-transparent">
                      {locale === 'vi' ? 'Đăng ký ngay' : 'Enroll Now'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-8">
              {/* Description */}
              {courseDescription && (
                <Card>
                  <CardHeader>
                    <CardTitle>{locale === 'vi' ? 'Mô tả chi tiết' : 'Course Details'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MarkdownRenderer content={courseDescription} />
                  </CardContent>
                </Card>
              )}

              {/* Comments Section */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {locale === 'vi' ? 'Câu hỏi & bình luận' : 'Questions & Comments'} (
                    {comments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                      <MessageCircle className="h-5 w-5" />
                      {locale === 'vi' ? 'Đặt câu hỏi hoặc bình luận' : 'Post a Comment'}
                    </h3>
                    <form onSubmit={handleSubmitComment} className="space-y-4">
                      <Textarea
                        placeholder={
                          locale === 'vi'
                            ? 'Đặt câu hỏi hoặc chia sẻ cảm nhận của bạn...'
                            : 'Ask a question or share your thoughts...'
                        }
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[100px]"
                        required
                      />
                      <Button type="submit">
                        {locale === 'vi' ? 'Gửi bình luận' : 'Post Comment'}
                      </Button>
                    </form>
                  </div>

                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="rounded-lg border p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                            {comment.user?.full_name?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{comment.user?.full_name || 'User'}</p>
                              <span className="text-sm text-muted-foreground">
                                {new Date(comment.created_at).toLocaleDateString(
                                  locale === 'vi' ? 'vi-VN' : 'en-US'
                                )}
                              </span>
                            </div>
                            <p className="mt-2 leading-relaxed text-muted-foreground">
                              {comment.comment}
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
        </section>

        {/* Related Courses */}
        {relatedCourses.length > 0 && (
          <section className="border-t border-border/40 bg-muted/30 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="mb-8 text-balance text-2xl font-bold tracking-tight sm:text-3xl">
                {locale === 'vi' ? 'Khóa học liên quan' : 'Related Courses'}
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
