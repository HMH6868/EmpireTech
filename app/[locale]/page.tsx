'use client';

import { ProductCard } from '@/components/account-card';
import { CourseCard } from '@/components/course-card';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
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

const heroSpotlightItems = [
  {
    key: 'steamWallet',
    slug: 'entertainment',
    imageUrl:
      'https://sf-static.upanhlaylink.com/img/image_202511217b2c03d927d932db2e5b0267618a06d1.jpg',
    imageUrlEn:
      'https://sf-static.upanhlaylink.com/img/image_2025112131545af5d5d8f1b9f8832f5acaeb26cc.jpg',
  },
  {
    key: 'designSuite',
    slug: 'design-tools',
    imageUrl:
      'https://sf-static.upanhlaylink.com/img/image_20251121c5bb00c6dfe7643337f2e036ede7f09a.jpg',
    imageUrlEn:
      'https://sf-static.upanhlaylink.com/img/image_20251121b4a328ad8e70986e2d62157ee08d976a.jpg',
  },
  {
    key: 'steamOffline',
    slug: 'entertainment',
    imageUrl:
      'https://sf-static.upanhlaylink.com/img/image_202511219d90e4a6cd153af35af6c4f1cd9568b5.jpg',
    imageUrlEn:
      'https://sf-static.upanhlaylink.com/img/image_202511211f1078b1a2278fe11f731df4f3e3393e.jpg',
  },
  {
    key: 'office',
    slug: 'productivity',
    imageUrl:
      'https://sf-static.upanhlaylink.com/img/image_20251121811e11d27229b79f2b950eaa44aa2a40.jpg',
    imageUrlEn:
      'https://sf-static.upanhlaylink.com/img/image_202511218539fcf91c8ee7a2e6c281220b1d299f.jpg',
  },
] as const;

const sideBannerItems = [
  {
    key: 'vpn',
    slug: 'vpn',
    imageUrl:
      'https://sf-static.upanhlaylink.com/img/image_20251121bd46607d24cfde13fdf6a4a213f21864.jpg',
    imageUrlEn:
      'https://sf-static.upanhlaylink.com/img/image_20251121a198af346a6b584500a82b1fd222bba9.jpg',
  },
  {
    key: 'ai-tools',
    slug: 'ai-tools',
    imageUrl:
      'https://sf-static.upanhlaylink.com/img/image_2025112181937ac8f1582015cccaeb573b7018a6.jpg',
    imageUrlEn:
      'https://sf-static.upanhlaylink.com/img/image_20251121ee3d3201cdacf93868611f49d52dc42e.jpg',
  },
] as const;

const leftBannerItem = {
  key: 'flash-sale',
  href: '#',
  imageUrl:
    'https://sf-static.upanhlaylink.com/img/image_2025112117dc8c56d2b41dc3b7262bdb2d60114e.jpg',
  imageUrlEn:
    'https://sf-static.upanhlaylink.com/img/image_20251121fb7fda45cd1ea834bdd345a836557064.jpg',
};

const banners = [
  {
    key: 'netflix',
    href: '/accounts/netflix',
    imageUrl:
      'https://sf-static.upanhlaylink.com/img/image_20251121a3624400c665a609c4d7b6cef57e9d24.jpg',
    imageUrlEn:
      'https://sf-static.upanhlaylink.com/img/image_20251121282155ab4dda5151e90c116239ddf7eb.jpg',
  },
  {
    key: 'group',
    href: 'https://i.imgur.com/yDOGrcq.jpeg',
    imageUrl:
      'https://sf-static.upanhlaylink.com/img/image_20251121fd1db5588dd76b825a8c35e525f0edbe.jpg',
    imageUrlEn:
      'https://sf-static.upanhlaylink.com/img/image_20251121e22c4b4d6eca02d1b44c271dcdd355d6.jpg',
  },
  {
    key: 'youtube',
    href: '/accounts/youtube',
    imageUrl:
      'https://sf-static.upanhlaylink.com/img/image_20251121b26651305e0596c99d67472765b5d76e.jpg',
    imageUrlEn:
      'https://sf-static.upanhlaylink.com/img/image_20251121d8dff4472ab613644fb2da6c53d8aeac.jpg',
  },
  {
    key: 'virus',
    href: '/accounts/virus',
    imageUrl:
      'https://sf-static.upanhlaylink.com/img/image_20251121d2d4abebd79c4fbed47daa49ea64da49.jpg',
    imageUrlEn:
      'https://sf-static.upanhlaylink.com/img/image_202511214d5914330218c88640d205ff1618b4bc.jpg',
  },
  {
    key: 'capcut',
    href: '/accounts/capcut',
    imageUrl:
      'https://sf-static.upanhlaylink.com/img/image_20251121c1cdc896678cf6ca38c35057dfdcc4f4.jpg',
    imageUrlEn:
      'https://sf-static.upanhlaylink.com/img/image_202511216db8ab0363e2c275f9f43deff344c01f.jpg',
  },
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const activeBanner = banners[currentBanner];

  const resolveImage = (item: { imageUrl: string; imageUrlEn?: string }) => {
    return locale === 'en' && item.imageUrlEn ? item.imageUrlEn : item.imageUrl;
  };

  const heroSpotlightCards = heroSpotlightItems.map((item) => ({
    ...item,
    href: `/${locale}/accounts?category=${item.slug}`,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Banner Carousel */}
        <section className="relative bg-muted/20 py-4 lg:py-8">
          <div className="container mx-auto space-y-4 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-12">
              {/* Left Column - New Card */}
              <div className="hidden lg:block lg:col-span-3">
                <Link href={`/${locale}${leftBannerItem.href}`}>
                  <Card
                    className="group relative h-full overflow-hidden rounded-2xl border-0 shadow-2xl cursor-pointer transition hover:-translate-y-1 hover:shadow-2xl "
                    style={{
                      backgroundImage: `url(${resolveImage(leftBannerItem)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </Link>
              </div>

              {/* Center Column - Main Banner */}
              <div className="lg:col-span-6">
                <Link
                  href={
                    activeBanner.href.startsWith('http')
                      ? activeBanner.href
                      : `/${locale}${activeBanner.href}`
                  }
                  target={activeBanner.href.startsWith('http') ? '_blank' : undefined}
                  rel={activeBanner.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <Card
                    className="group relative h-full overflow-hidden rounded-2xl border-0 shadow-2xl cursor-pointer"
                    style={{
                      aspectRatio: '16/9',
                      backgroundImage: `url(${resolveImage(activeBanner)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-2 opacity-100 transition-opacity duration-300 lg:opacity-0 lg:px-4 lg:group-hover:opacity-100">
                      <button
                        aria-label={homeT('hero.previous')}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
                        }}
                        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/30 lg:h-14 lg:w-14"
                      >
                        <ChevronLeft className="h-5 w-5 lg:h-7 lg:w-7" />
                      </button>
                      <button
                        aria-label={homeT('hero.next')}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentBanner((prev) => (prev + 1) % banners.length);
                        }}
                        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/30 lg:h-14 lg:w-14"
                      >
                        <ChevronRight className="h-5 w-5 lg:h-7 lg:w-7" />
                      </button>
                    </div>

                    <div className="absolute bottom-4 lg:bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1.5 lg:gap-2">
                      {banners.map((_, index) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentBanner(index);
                          }}
                          className={`h-1.5 lg:h-2 rounded-full transition-all ${
                            currentBanner === index
                              ? 'w-6 lg:w-10 bg-white'
                              : 'w-2 lg:w-3 bg-white/40 hover:bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  </Card>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:col-span-3 lg:grid-cols-1">
                {sideBannerItems.map((item) => (
                  <Link key={item.key} href={`/${locale}/accounts?category=${item.slug}`}>
                    <Card
                      className="relative overflow-hidden rounded-2xl border-0 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl cursor-pointer w-full"
                      style={{
                        aspectRatio: '16/9',
                        backgroundImage: `url(${resolveImage(item)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {heroSpotlightCards.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={item.key === 'steamOffline' ? 'order-last lg:order-none' : undefined}
                >
                  <Card
                    className="relative overflow-hidden rounded-2xl border-0 shadow-lg transition hover:-translate-y-1 hover:shadow-xl cursor-pointer w-full"
                    style={{
                      aspectRatio: '16/9',
                      backgroundImage: `url(${resolveImage(item)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                </Link>
              ))}
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

                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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

                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
