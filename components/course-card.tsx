import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-locale';
import { useTranslations } from '@/hooks/useTranslations';
import type { Course } from '@/lib/mock-data';
import { BookOpen, Clock, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const { locale, formatCurrency } = useLanguage();
  const t = useTranslations('products');
  const lessonLabel = t('courseCard.lessons');
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/courses/${course.slug}`}>
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={course.thumbnail || '/placeholder.svg'}
            alt={course.title[locale]}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/courses/${course.slug}`}>
          <h3 className="line-clamp-2 text-balance font-semibold transition-colors group-hover:text-primary">
            {course.title[locale]}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-muted-foreground">{course.instructor}</p>
        {course.createdAt && (
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(course.createdAt).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        )}
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>
              {course.lessons} {lessonLabel}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration[locale]}</span>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="text-sm font-medium">{course.rating}</span>
          <span className="text-sm text-muted-foreground">(245)</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-2xl font-bold">
          {formatCurrency(course.price[locale === 'vi' ? 'vnd' : 'usd'])}
        </p>
        <Link href={`/courses/${course.slug}`}>
          <Button size="sm">{t('courseCard.enrollNow')}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
