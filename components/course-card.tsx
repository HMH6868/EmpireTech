import { useLanguage } from '@/hooks/use-locale';
import { useTranslations } from '@/hooks/useTranslations';
import { User } from 'lucide-react';
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
    <Link
      href={`/${locale}/courses/${course.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted/20">
        <Image
          src={course.thumbnail || '/placeholder.svg'}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Optional: Add badges here if needed, e.g. "New" or "Bestseller" */}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 px-1 pb-1">
        <h3 className="line-clamp-1 text-base font-medium text-foreground group-hover:text-primary">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{course.instructor}</span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-bold text-foreground">
            {price > 0 ? formatCurrency(price, { currency }) : 'Free'}
          </span>
        </div>
      </div>
    </Link>
  );
}
