'use client';

import { ProductCard } from '@/components/account-card';
import { CourseCard } from '@/components/course-card';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-locale';
import { useTranslations } from '@/hooks/useTranslations';
import {
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Gift,
  GraduationCap,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Account = {
  id: string;
  slug: string;
  name_en: string;
  name_vi: string;
  image?: string;
  category_id?: string;
  inventory_status: 'in-stock' | 'low-stock' | 'out-of-stock';
  category?: {
    id: string;
    name_en: string;
    name_vi: string;
    slug: string;
  };
  variants?: Array<{
    id: string;
    price_usd: number;
    price_vnd: number;
    original_price_usd?: number;
    original_price_vnd?: number;
    stock: boolean;
    is_default: boolean;
  }>;
};

type Course = {
  id: string;
  slug: string;
  title_en: string;
  title_vi: string;
  thumbnail?: string;
  instructor: string;
  price_usd: number;
  price_vnd: number;
  created_at?: string;
};

type Category = {
  id: string;
  name_en: string;
  name_vi: string;
  slug: string;
};

type CategoryWithProducts = Category & {
  products: Account[];
};

const featureItems = [
  { key: 'instantDelivery', Icon: Zap, color: 'text-yellow-500' },
  { key: 'secure', Icon: Shield, color: 'text-green-500' },
  { key: 'support', Icon: Clock, color: 'text-blue-500' },
] as const;

export default function HomePage() {
  const { locale } = useLanguage();
  const homeT = useTranslations('home');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<CategoryWithProducts[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [accountsRes, coursesRes, categoriesRes] = await Promise.all([
          fetch('/api/accounts'),
          fetch('/api/courses'),
          fetch('/api/categories'),
        ]);

        const accountsData = await accountsRes.json();
        const coursesData = await coursesRes.json();
        const categoriesData = await categoriesRes.json();

        if (accountsData.accounts && categoriesData.categories) {
          const accounts: Account[] = accountsData.accounts;
          const categories: Category[] = categoriesData.categories;

          const categoriesWithProds = categories
            .map((category) => ({
              ...category,
              products: accounts
                .filter((account) => account.category_id === category.id)
                .slice(0, 6),
            }))
            .filter((cat) => cat.products.length > 0);

          setCategoriesWithProducts(categoriesWithProds);
        }

        // API returns 'items' not 'courses'
        if (coursesData.items) {
          setCourses(coursesData.items.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const banners = [
    {
      key: 'steam',
      gradient: 'from-green-600/30 via-green-500/20 to-green-400/10',
      bgPattern: 'radial-gradient(circle at 30% 50%, rgba(34, 197, 94, 0.2), transparent 50%)',
    },
    {
      key: 'premium',
      gradient: 'from-blue-600/30 via-blue-500/20 to-blue-400/10',
      bgPattern: 'radial-gradient(circle at 70% 50%, rgba(59, 130, 246, 0.2), transparent 50%)',
    },
    {
      key: 'office',
      gradient: 'from-orange-600/30 via-orange-500/20 to-orange-400/10',
      bgPattern: 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.2), transparent 50%)',
    },
  ] as const;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const activeBanner = banners[currentBanner];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Banner Carousel */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-9">
                <div className="h-[400px] lg:h-[500px]">
                  <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200/50 hover:shadow-xl transition-all cursor-pointer group h-full">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${activeBanner.gradient} transition-all duration-1000`}
                      style={{
                        backgroundImage: activeBanner.bgPattern,
                        backgroundBlendMode: 'overlay',
                      }}
                    >
                      <div className="relative h-full flex flex-col justify-center px-8 lg:px-16">
                        <Badge className="w-fit mb-4 bg-red-500 hover:bg-red-600 text-white border-0 px-6 py-2 text-base font-bold animate-pulse shadow-lg">
                          {homeT(`banners.${activeBanner.key}Tag`)}
                        </Badge>
                        <h2 className="text-5xl lg:text-7xl font-black mb-4 text-foreground drop-shadow-2xl leading-tight">
                          {homeT(`banners.${activeBanner.key}Title`)}
                        </h2>
                        <p className="text-3xl lg:text-5xl font-bold text-primary mb-8 drop-shadow-lg">
                          {homeT(`banners.${activeBanner.key}Subtitle`)}
                        </p>
                        <div className="flex gap-4">
                          <Link href={`/${locale}/accounts`}>
                            <Button
                              size="lg"
                              className="gap-2 px-10 py-6 text-lg bg-primary hover:bg-primary/90 shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105"
                            >
                              {homeT('hero.shopNow')}
                              <ArrowRight className="h-6 w-6" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-y-0 left-4 z-20 flex items-center">
                      <button
                        aria-label="Previous banner"
                        onClick={() =>
                          setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
                        }
                        className="hidden group-hover:flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-transform shadow-lg"
                      >
                        <ChevronLeft className="h-5 w-5 text-primary" />
                      </button>
                    </div>
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
                      {banners.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentBanner(index)}
                          className={`h-2.5 rounded-full transition-all ${
                            currentBanner === index
                              ? 'w-10 bg-primary shadow-lg'
                              : 'w-2.5 bg-primary/40 hover:bg-primary/60'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="absolute inset-y-0 right-4 z-20 flex items-center">
                      <button
                        aria-label="Next banner"
                        onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                        className="hidden group-hover:flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-transform shadow-lg"
                      >
                        <ChevronRight className="h-5 w-5 text-primary" />
                      </button>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-4">
                <Link href={`/${locale}/accounts?category=vpn`}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200/50 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group h-full">
                    <div className="p-6 h-full flex flex-col justify-between">
                      <div>
                        <Badge className="mb-3 bg-purple-500 hover:bg-purple-600 border-0 shadow-lg">
                          {homeT('sideBanners.vpnBadge')}
                        </Badge>
                        <h3 className="text-2xl font-black mb-2">
                          {homeT('sideBanners.vpnTitle')}
                        </h3>
                        <p className="text-sm text-muted-foreground font-semibold">
                          {homeT('sideBanners.vpnSubtitle')}
                        </p>
                      </div>
                      <ChevronRight className="h-6 w-6 text-primary group-hover:translate-x-2 transition-transform" />
                    </div>
                  </Card>
                </Link>

                <Link href={`/${locale}/accounts?category=ai-tools`}>
                  <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200/50 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group h-full">
                    <div className="p-6 h-full flex flex-col justify-between">
                      <div>
                        <Badge className="mb-3 bg-blue-500 hover:bg-blue-600 border-0 shadow-lg">
                          {homeT('sideBanners.aiBadge')}
                        </Badge>
                        <h3 className="text-2xl font-black mb-2">{homeT('sideBanners.aiTitle')}</h3>
                        <p className="text-sm text-muted-foreground font-semibold">
                          {homeT('sideBanners.aiSubtitle')}
                        </p>
                      </div>
                      <ChevronRight className="h-6 w-6 text-primary group-hover:translate-x-2 transition-transform" />
                    </div>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-border/40 bg-gradient-to-r from-primary/5 via-background to-primary/5 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {featureItems.map(({ key, Icon, color }) => (
                <div
                  key={key}
                  className="flex items-center gap-4 p-4 rounded-lg bg-card/50 hover:bg-card transition-all hover:shadow-md group"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ${color} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">
                      {homeT(`features.${key}Title`)}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {homeT(`features.${key}Description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {loading ? (
          <section className="py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  {locale === 'vi' ? 'Đang tải...' : 'Loading...'}
                </p>
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Featured Products Section */}
            <section id="featured" className="py-12 lg:py-16 bg-background">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles className="h-6 w-6 text-primary" />
                      <h2 className="text-3xl font-bold tracking-tight">
                        {locale === 'vi' ? 'Sản phẩm nổi bật' : 'Featured Products'}
                      </h2>
                    </div>
                    <p className="text-muted-foreground">
                      {locale === 'vi'
                        ? 'Hàng ngàn khách hàng đã tin chọn - Uy tín được đảm bảo'
                        : 'Thousands of customers trust us - Quality guaranteed'}
                    </p>
                  </div>
                  <Link href={`/${locale}/accounts`} className="hidden md:block">
                    <Button
                      variant="ghost"
                      className="gap-2 bg-gradient-to-r from-primary/10 to-blue-500/10 hover:from-primary/20 hover:to-blue-500/20 border-primary/30"
                    >
                      {locale === 'vi' ? 'Xem tất cả' : 'View All'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {categoriesWithProducts
                    .flatMap((cat) => cat.products)
                    .slice(0, 6)
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                  <Link href={`/${locale}/accounts`}>
                    <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                      {locale === 'vi' ? 'Xem tất cả' : 'View All'}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>

            {/* Category Sections */}
            {categoriesWithProducts.map((category, index) => (
              <section
                key={category.id}
                className={`py-12 lg:py-16 ${
                  index % 2 === 0
                    ? 'bg-background'
                    : 'bg-gradient-to-br from-primary/5 via-background to-background'
                }`}
              >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <h2 className="text-3xl font-bold tracking-tight">
                          {locale === 'vi' ? category.name_vi : category.name_en}
                        </h2>
                      </div>
                      <p className="text-muted-foreground">
                        {locale === 'vi'
                          ? `Khám phá ${category.name_vi.toLowerCase()}`
                          : `Explore ${category.name_en.toLowerCase()}`}
                      </p>
                    </div>
                    <Link
                      href={`/${locale}/accounts?category=${category.slug}`}
                      className="hidden md:block"
                    >
                      <Button
                        variant="ghost"
                        className="gap-2 bg-gradient-to-r from-primary/10 to-blue-500/10 hover:from-primary/20 hover:to-blue-500/20 border-primary/30"
                      >
                        {locale === 'vi' ? 'Xem thêm' : 'View More'}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {category.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  <div className="mt-8 text-center md:hidden">
                    <Link href={`/${locale}/accounts?category=${category.slug}`}>
                      <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                        {locale === 'vi' ? 'Xem thêm' : 'View More'}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>
            ))}

            {/* Online Courses Section */}
            {courses.length > 0 && (
              <section className="py-12 lg:py-16 bg-gradient-to-b from-background via-primary/5 to-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-lg">
                          <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">
                          {locale === 'vi' ? 'Khóa học trực tuyến' : 'Online Courses'}
                        </h2>
                      </div>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {locale === 'vi'
                          ? 'Nâng cấp kỹ năng với giảng viên chuyên nghiệp'
                          : 'Upskill with expert instructors'}
                      </p>
                    </div>
                    <Link href={`/${locale}/courses`} className="hidden md:block">
                      <Button
                        variant="ghost"
                        className="gap-2 bg-gradient-to-r from-primary/10 to-blue-500/10 hover:from-primary/20 hover:to-blue-500/20 border-primary/30"
                      >
                        {locale === 'vi' ? 'Xem tất cả khóa học' : 'View All Courses'}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                      <div key={course.id} className="group">
                        <CourseCard course={course} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {/* CTA Section */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-8 lg:p-12 text-center text-primary-foreground overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <h2 className="text-2xl lg:text-4xl font-bold mb-3 max-w-2xl mx-auto">
                  {homeT('hero.readyTitle')}
                </h2>
                <p className="text-base lg:text-lg mb-6 opacity-90 max-w-xl mx-auto">
                  {homeT('hero.readyDescription')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href={`/${locale}/accounts`}>
                    <Button
                      size="lg"
                      variant="secondary"
                      className="gap-2 px-8 hover:scale-105 transition-transform"
                    >
                      {homeT('hero.browseAccounts')}
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href={`/${locale}/promotions`}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2 px-8 bg-white/10 border-white/30 hover:bg-white/20 text-white hover:text-white"
                    >
                      {homeT('hero.viewPromotions')}
                      <Gift className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
