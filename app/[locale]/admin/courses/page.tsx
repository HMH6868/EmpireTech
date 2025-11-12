'use client';

import type React from 'react';

import { Badge } from '@/components/ui/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/use-locale';
import { adminCourses, type Course, type LocalizedText } from '@/lib/mock-data';
import { Edit, Plus, Search, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';

const emptyLocalized = (): LocalizedText => ({ en: '', vi: '' });
const ensureLocalizedText = (value: LocalizedText | string | undefined): LocalizedText => {
  if (!value) return emptyLocalized();
  if (typeof value === 'string') {
    return { en: value, vi: value };
  }
  return value;
};

const getLocalizedString = (value: LocalizedText | string | undefined, lang: 'en' | 'vi') => {
  if (!value) return '';
  return typeof value === 'string' ? value : value[lang] ?? '';
};

export default function AdminCoursesPage() {
  const { locale, currency, formatCurrency } = useLanguage();
  const [courseList, setCourseList] = useState<Course[]>(adminCourses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredCourses = courseList.filter((course) => {
    if (!normalizedQuery) return true;
    const titleMatches =
      course.title.en.toLowerCase().includes(normalizedQuery) ||
      course.title.vi.toLowerCase().includes(normalizedQuery);
    const instructorMatches = course.instructor.toLowerCase().includes(normalizedQuery);
    return titleMatches || instructorMatches;
  });

  const handleAddCourse = () => {
    setEditingCourse(null);
    setIsDialogOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setIsDialogOpen(true);
  };

  const handleDeleteCourse = (id: string) => {
    setCourseList(courseList.filter((course) => course.id !== id));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const galleryInput = (formData.get('images') as string) || '';
    const galleryImages = galleryInput
      .split('\n')
      .map((img) => img.trim())
      .filter(Boolean);

    const newCourse: Course = {
      id: editingCourse?.id || String(courseList.length + 1),
      slug: (formData.get('slug') as string)?.trim() || editingCourse?.slug || '',
      title: {
        en: (formData.get('title_en') as string)?.trim() || '',
        vi: (formData.get('title_vi') as string)?.trim() || '',
      },
      instructor: (formData.get('instructor') as string)?.trim() || '',
      price: {
        usd: Number.parseFloat((formData.get('price_usd') as string) || '0'),
        vnd: Number.parseFloat((formData.get('price_vnd') as string) || '0'),
      },
      description: {
        en: (formData.get('description_en') as string) || '',
        vi: (formData.get('description_vi') as string) || '',
      },
      lessons: Number.parseInt((formData.get('lessons') as string) || '0', 10),
      duration: {
        en: (formData.get('duration_en') as string) || '',
        vi: (formData.get('duration_vi') as string) || '',
      },
      thumbnail:
        (formData.get('thumbnail') as string)?.trim() ||
        galleryImages[0] ||
        editingCourse?.thumbnail ||
        '',
      images: galleryImages.length ? galleryImages : editingCourse?.images,
      rating: editingCourse?.rating || 0,
      status: (formData.get('status') as Course['status']) || 'Draft',
      createdAt:
        (formData.get('createdAt') as string) ||
        editingCourse?.createdAt ||
        new Date().toISOString().split('T')[0],
    };

    if (editingCourse) {
      setCourseList(
        courseList.map((course) => (course.id === editingCourse.id ? newCourse : course))
      );
    } else {
      setCourseList([...courseList, newCourse]);
    }

    setIsDialogOpen(false);
    setEditingCourse(null);
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Courses</h1>
          <p className="mt-2 text-muted-foreground">
            Add, edit, or remove courses from your catalog
          </p>
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
                <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
                <DialogDescription>
                  {editingCourse
                    ? 'Update the course details below.'
                    : 'Fill in the details for the new course. Use Markdown for description.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="title_en">Course Title (English)</Label>
                    <Input
                      id="title_en"
                      name="title_en"
                      placeholder="Complete Web Development Bootcamp"
                      defaultValue={editingCourse ? editingCourse.title.en : ''}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="title_vi">Course Title (Vietnamese)</Label>
                    <Input
                      id="title_vi"
                      name="title_vi"
                      placeholder="Bootcamp lập trình Full-Stack"
                      defaultValue={editingCourse ? editingCourse.title.vi : ''}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      name="slug"
                      placeholder="fullstack-web-bootcamp"
                      defaultValue={editingCourse?.slug}
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
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="price_usd">Price (USD)</Label>
                    <Input
                      id="price_usd"
                      name="price_usd"
                      type="number"
                      step="0.01"
                      placeholder="49.99"
                      defaultValue={editingCourse ? editingCourse.price.usd : ''}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price_vnd">Price (VND)</Label>
                    <Input
                      id="price_vnd"
                      name="price_vnd"
                      type="number"
                      step="1000"
                      placeholder="1299000"
                      defaultValue={editingCourse ? editingCourse.price.vnd : ''}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="lessons">Lessons</Label>
                    <Input
                      id="lessons"
                      name="lessons"
                      type="number"
                      placeholder="48"
                      defaultValue={editingCourse?.lessons}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Duration</Label>
                    <Input
                      name="duration_en"
                      placeholder="24 hours"
                      defaultValue={editingCourse ? editingCourse.duration.en : ''}
                      required
                    />
                    <Input
                      name="duration_vi"
                      placeholder="24 giờ"
                      defaultValue={editingCourse ? editingCourse.duration.vi : ''}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="thumbnail"
                      name="thumbnail"
                      placeholder="/images/courses/web/main.png"
                      defaultValue={editingCourse?.thumbnail}
                      required
                    />
                    <Button type="button" variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="images">Gallery Images (one per line)</Label>
                  <Textarea
                    id="images"
                    name="images"
                    placeholder="/images/courses/web/main.png"
                    defaultValue={editingCourse?.images?.join('\n') ?? ''}
                    className="min-h-[120px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description_en">Description (Markdown) - English</Label>
                  <Textarea
                    id="description_en"
                    name="description_en"
                    placeholder="## Course Overview\n\nThis course will teach you..."
                    defaultValue={editingCourse ? editingCourse.description.en : ''}
                    className="min-h-[160px] font-mono text-sm"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description_vi">Description (Markdown) - Vietnamese</Label>
                  <Textarea
                    id="description_vi"
                    name="description_vi"
                    placeholder="## Giới thiệu khóa học\n\nKhoá học này sẽ giúp bạn..."
                    defaultValue={editingCourse ? editingCourse.description.vi : ''}
                    className="min-h-[160px] font-mono text-sm"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={editingCourse?.status || 'Draft'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="createdAt">Created Date</Label>
                  <Input
                    id="createdAt"
                    name="createdAt"
                    type="date"
                    defaultValue={
                      editingCourse?.createdAt || new Date().toISOString().split('T')[0]
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingCourse ? 'Update' : 'Create'} Course</Button>
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
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    Title
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    Instructor
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    Price
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    Created
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="border-b border-border last:border-0">
                    <td className="py-3 text-sm font-medium">
                      {getLocalizedString(course.title, locale) || course.slug}
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">{course.instructor}</td>
                    <td className="py-3 text-sm font-medium">
                      {formatCurrency(course.price[currency], { currency })}
                    </td>
                    <td className="py-3">
                      <Badge variant={course.status === 'Published' ? 'default' : 'secondary'}>
                        {course.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {course.createdAt ?? '--'}
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
  );
}
