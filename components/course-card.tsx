import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-locale';
import { useTranslations } from '@/hooks/useTranslations';
import Image from 'next/image';
import Link from 'next/link';

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

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const { locale, formatCurrency, currency } = useLanguage();
  const t = useTranslations('products');

  const title = locale === 'vi' ? course.title_vi : course.title_en;
  const price = currency === 'vnd' ? course.price_vnd : course.price_usd;

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/${locale}/courses/${course.slug}`}>
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={course.thumbnail || '/placeholder.svg'}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/${locale}/courses/${course.slug}`}>
          <h3 className="line-clamp-2 text-balance font-semibold transition-colors group-hover:text-primary">
            {title}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-muted-foreground">{course.instructor}</p>
        {course.created_at && (
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(course.created_at).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-2xl font-bold">{formatCurrency(price, { currency })}</p>
        <Link href={`/${locale}/courses/${course.slug}`}>
          <Button size="sm">{t('courseCard.enrollNow')}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
