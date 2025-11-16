'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';
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

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title_en: '',
    title_vi: '',
    slug: '',
    instructor: '',
    price_usd: 0,
    price_vnd: 0,
    thumbnail: '',
    description_en: '',
    description_vi: '',
  });

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/courses');
      const data = await response.json();
      if (data.courses) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error('Lỗi khi tải khóa học:', error);
      toast.error('Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredCourses = courses.filter((course) => {
    if (!normalizedQuery) return true;
    const titleMatches =
      course.title_en.toLowerCase().includes(normalizedQuery) ||
      course.title_vi.toLowerCase().includes(normalizedQuery);
    const instructorMatches = course.instructor.toLowerCase().includes(normalizedQuery);
    return titleMatches || instructorMatches;
  });

  const handleAddCourse = () => {
    setEditingCourse(null);
    setGalleryImages([]);
    setFormData({
      title_en: '',
      title_vi: '',
      slug: '',
      instructor: '',
      price_usd: 0,
      price_vnd: 0,
      thumbnail: '',
      description_en: '',
      description_vi: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setGalleryImages(course.images?.map((img) => img.image_url) || []);
    setFormData({
      title_en: course.title_en,
      title_vi: course.title_vi,
      slug: course.slug,
      instructor: course.instructor,
      price_usd: course.price_usd,
      price_vnd: course.price_vnd,
      thumbnail: course.thumbnail || '',
      description_en: course.description_en || '',
      description_vi: course.description_vi || '',
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;

    try {
      const response = await fetch(`/api/courses/${courseToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCourses(courses.filter((course) => course.id !== courseToDelete.id));
        toast.success('Xóa khóa học thành công!');
        setDeleteDialogOpen(false);
        setCourseToDelete(null);
      } else {
        const error = await response.json();
        toast.error(`Lỗi: ${error.error}`);
      }
    } catch (error) {
      console.error('Lỗi khi xóa khóa học:', error);
      toast.error('Có lỗi xảy ra khi xóa khóa học');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const courseData = {
      slug: formData.slug,
      title_en: formData.title_en,
      title_vi: formData.title_vi,
      thumbnail: formData.thumbnail,
      instructor: formData.instructor,
      price_usd: formData.price_usd,
      price_vnd: formData.price_vnd,
      description_en: formData.description_en,
      description_vi: formData.description_vi,
      gallery_images: galleryImages.filter((url) => url.trim() !== ''),
    };

    try {
      if (editingCourse) {
        const response = await fetch(`/api/courses/${editingCourse.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseData),
        });

        if (response.ok) {
          const { course } = await response.json();
          if (course) {
            setCourses(courses.map((c) => (c.id === editingCourse.id ? course : c)));
            toast.success('Cập nhật khóa học thành công!');
          } else {
            toast.error('Không nhận được dữ liệu khóa học sau khi cập nhật');
            return;
          }
        } else {
          const error = await response.json();
          toast.error(`Lỗi: ${error.error}`);
          return;
        }
      } else {
        const response = await fetch('/api/courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseData),
        });

        if (response.ok) {
          const { course } = await response.json();
          if (course) {
            setCourses([course, ...courses]);
            toast.success('Tạo khóa học thành công!');
          } else {
            toast.error('Không nhận được dữ liệu khóa học sau khi tạo');
            return;
          }
        } else {
          const error = await response.json();
          toast.error(`Lỗi: ${error.error}`);
          return;
        }
      }

      setIsDialogOpen(false);
      setEditingCourse(null);
      setGalleryImages([]);
    } catch (error) {
      console.error('Lỗi khi lưu khóa học:', error);
      toast.error('Có lỗi xảy ra khi lưu khóa học');
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa khóa học</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa khóa học{' '}
              <span className="font-semibold">{courseToDelete?.title_vi}</span>? Hành động này không
              thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Xóa
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="p-6 md:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quản lý khóa học</h1>
            <p className="mt-2 text-muted-foreground">Thêm, sửa hoặc xóa khóa học</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={handleAddCourse}>
                <Plus className="h-4 w-4" />
                Thêm khóa học
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{editingCourse ? 'Sửa khóa học' : 'Thêm khóa học mới'}</DialogTitle>
                  <DialogDescription>
                    {editingCourse
                      ? 'Cập nhật thông tin khóa học bên dưới.'
                      : 'Điền thông tin cho khóa học mới. Sử dụng Markdown cho mô tả.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="title_en">Tên khóa học (Tiếng Anh)</Label>
                      <Input
                        id="title_en"
                        placeholder="Complete Web Development Bootcamp"
                        value={formData.title_en}
                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="title_vi">Tên khóa học (Tiếng Việt)</Label>
                      <Input
                        id="title_vi"
                        placeholder="Bootcamp lập trình Full-Stack"
                        value={formData.title_vi}
                        onChange={(e) => setFormData({ ...formData, title_vi: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        placeholder="fullstack-web-bootcamp"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="instructor">Giảng viên</Label>
                      <Input
                        id="instructor"
                        placeholder="John Smith"
                        value={formData.instructor}
                        onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="price_usd">Giá (USD)</Label>
                      <Input
                        id="price_usd"
                        type="number"
                        step="0.01"
                        placeholder="49.99"
                        value={formData.price_usd}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price_usd: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="price_vnd">Giá (VND)</Label>
                      <Input
                        id="price_vnd"
                        type="number"
                        step="1000"
                        placeholder="1299000"
                        value={formData.price_vnd}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price_vnd: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="thumbnail">URL hình ảnh chính</Label>
                    <div className="flex gap-2">
                      <Input
                        id="thumbnail"
                        placeholder="https://i.imgur.com/example.png"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Thư viện ảnh (Gallery)</Label>
                    <div className="space-y-2">
                      {galleryImages.map((imageUrl, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={`URL ảnh ${index + 1}`}
                            value={imageUrl}
                            onChange={(e) => {
                              const newImages = [...galleryImages];
                              newImages[index] = e.target.value;
                              setGalleryImages(newImages);
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              setGalleryImages(galleryImages.filter((_, i) => i !== index));
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setGalleryImages([...galleryImages, ''])}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm ảnh
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description_en">Mô tả (Markdown) - Tiếng Anh</Label>
                    <Textarea
                      id="description_en"
                      placeholder="## Course Overview&#10;&#10;This course will teach you..."
                      value={formData.description_en}
                      onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                      className="min-h-[160px] font-mono text-sm"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description_vi">Mô tả (Markdown) - Tiếng Việt</Label>
                    <Textarea
                      id="description_vi"
                      placeholder="## Giới thiệu khóa học&#10;&#10;Khóa học này sẽ giúp bạn..."
                      value={formData.description_vi}
                      onChange={(e) => setFormData({ ...formData, description_vi: e.target.value })}
                      className="min-h-[160px] font-mono text-sm"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit">{editingCourse ? 'Cập nhật' : 'Tạo'} khóa học</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Tất cả khóa học ({filteredCourses.length})</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm khóa học..."
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
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Khóa học
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Giảng viên
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Giá (VND)
                    </th>
                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="border-b border-border last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={course.thumbnail || '/placeholder.svg'}
                              alt={course.title_vi}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-sm font-medium">{course.title_vi}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm">{course.instructor}</td>
                      <td className="py-3 text-sm font-medium">
                        {course.price_vnd.toLocaleString('vi-VN')}đ
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditCourse(course)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteClick(course)}
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
    </>
  );
}
