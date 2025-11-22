'use client';

import { CourseCard } from '@/components/course-card';
import { ProductFilters, type FilterState } from '@/components/filters';
import { Footer } from '@/components/footer';
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
  empty: { en: 'No courses found.', vi: 'Không tìm thấy khóa học.' },
  loading: { en: 'Loading courses...', vi: 'Đang tải khóa học...' },
};

export default function CoursesPage() {
  const { locale, currency } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    category: 'all',
    priceRange: { min: '', max: '' },
    sortBy: 'default',
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/courses');
        const data = await response.json();
        // API returns 'items' not 'courses'
        if (data.items) {
          setCourses(data.items);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses
    .filter((course) => {
      // Filter by Price
      const price = currency === 'vnd' ? course.price_vnd : course.price_usd;
      const minPrice = appliedFilters.priceRange.min
        ? parseFloat(appliedFilters.priceRange.min)
        : 0;
      const maxPrice = appliedFilters.priceRange.max
        ? parseFloat(appliedFilters.priceRange.max)
        : Infinity;

      if (price < minPrice || price > maxPrice) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (appliedFilters.sortBy === 'default') return 0;

      const priceA = currency === 'vnd' ? a.price_vnd : a.price_usd;
      const priceB = currency === 'vnd' ? b.price_vnd : b.price_usd;

      return appliedFilters.sortBy === 'price-asc' ? priceA - priceB : priceB - priceA;
    });

  const handleApplyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="py-5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ProductFilters categories={[]} onFilter={handleApplyFilters} className="mb-8" />

            {loading ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">{copy.loading[locale]}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>

                {filteredCourses.length === 0 && (
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
