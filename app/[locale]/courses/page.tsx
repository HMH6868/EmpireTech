'use client';

import { CourseCard } from '@/components/course-card';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { useLanguage } from '@/hooks/use-locale';
import { useEffect, useState } from 'react';

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

const copy = {
  title: { en: 'Explore Courses', vi: 'Khám phá khóa học' },
  subtitle: {
    en: 'Upskill with expert-led lessons, practice projects, and lifetime access.',
    vi: 'Nâng cấp kỹ năng với khóa học cùng chuyên gia, dự án thực hành và truy cập trọn đời.',
  },
  empty: { en: 'No courses found.', vi: 'Không tìm thấy khóa học.' },
  loading: { en: 'Loading courses...', vi: 'Đang tải khóa học...' },
};

export default function CoursesPage() {
  const { locale } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/courses');
        const data = await response.json();
        if (data.courses) {
          setCourses(data.courses);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="border-b border-border/40 bg-muted/30 py-5 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-balance text-xl font-bold tracking-tight sm:text-2xl">
              {copy.title[locale]}
            </h1>
            <p className="mt-1 text-pretty text-base text-muted-foreground">
              {copy.subtitle[locale]}
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">{copy.loading[locale]}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>

                {courses.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">{copy.empty[locale]}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
