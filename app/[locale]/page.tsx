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
  Bot,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Clock,
  Cloud,
  Gamepad2,
  Gift,
  GraduationCap,
  Laptop,
  Palette,
  Shield,
  ShieldCheck,
  Sparkles,
  Tv,
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

const HERO_SPOTLIGHT_CARD_HEIGHT = 150;
const HERO_SPOTLIGHT_GAP = 16; // matches gap-4 (1rem)

const heroCategoryItems = [
  { key: 'entertainment', label: { vi: 'Giải trí', en: 'Entertainment' }, slug: 'entertainment', Icon: Tv },
  { key: 'work', label: { vi: 'Làm việc', en: 'Work' }, slug: 'productivity', Icon: Briefcase },
  { key: 'learning', label: { vi: 'Học tập', en: 'Learning' }, slug: 'productivity', Icon: GraduationCap },
  { key: 'steam', label: { vi: 'Game Steam', en: 'Steam games' }, slug: 'entertainment', Icon: Gamepad2 },

] as const;

const heroSpotlightItems = [
  {
    key: 'steamWallet',
    badge: { vi: 'Steam', en: 'Steam' },
    title: { vi: 'Nạp thẻ Wallet', en: 'Wallet top-up' },
    subtitle: { vi: 'Siêu tiết kiệm', en: 'Super savings' },
    slug: 'entertainment',
    gradient: 'from-[#fef2ff] via-[#f4e8ff] to-white',
  },
  {
    key: 'designSuite',
    badge: { vi: 'Công cụ', en: 'Creative' },
    title: { vi: 'Thiết kế đa dạng', en: 'Design suite' },
    subtitle: { vi: 'Canva, Figma, Adobe', en: 'Canva, Figma, Adobe' },
    slug: 'design-tools',
    gradient: 'from-[#f2f7ff] via-[#fef3ff] to-white',
  },
  {
    key: 'steamOffline',
    badge: { vi: 'Steam', en: 'Steam' },
    title: { vi: 'Tài khoản offline', en: 'Offline accounts' },
    subtitle: { vi: 'Game bom tấn', en: 'Blockbusters' },
    slug: 'entertainment',
    gradient: 'from-[#fff8e4] via-[#fff2cc] to-white',
  },
  {
    key: 'office',
    badge: { vi: 'Office', en: 'Office' },
    title: { vi: 'Microsoft Office', en: 'Microsoft Office' },
    subtitle: { vi: 'Bản quyền chính chủ', en: 'Licensed access' },
    slug: 'productivity',
    gradient: 'from-[#f1f9ff] via-[#f4ecff] to-white',
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
  const resolveLabel = (label: { vi: string; en: string }) =>
    locale === 'vi' ? label.vi : label.en;
  const quickCategoryLinks = heroCategoryItems.map((item) => ({
    ...item,
    text: resolveLabel(item.label),
    href: `/${locale}/accounts?category=${item.slug}`,
  }));
  const heroBannerTargetHeight = HERO_SPOTLIGHT_CARD_HEIGHT * 2 + HERO_SPOTLIGHT_GAP;
  const heroSpotlightCards = heroSpotlightItems.map((item) => ({
    ...item,
    badgeText: resolveLabel(item.badge),
    titleText: resolveLabel(item.title),
    subtitleText: resolveLabel(item.subtitle),
    href: `/${locale}/accounts?category=${item.slug}`,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Banner Carousel */}
        <section className="relative bg-muted/20 py-8">
          <div className="container mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <aside className="lg:col-span-3">
                <Card className="h-full rounded-3xl border border-border/40 bg-background shadow-xl">
                  <div className="border-b border-border/60 px-6 py-5">
                    <p className="text-sm font-semibold text-muted-foreground">
                      {locale === 'vi' ? 'Danh mục nhanh' : 'Quick categories'}
                    </p>
                    <p className="text-lg font-bold text-foreground">{homeT('hero.browseAccounts')}</p>
                  </div>
                  <ul className="grid grid-cols-2 gap-2.5 px-4 py-3 lg:block lg:p-0">
                    {quickCategoryLinks.map(({ key, Icon, text, href }) => (
                      <li
                        key={key}
                        className="overflow-hidden rounded-2xl bg-muted/40 lg:rounded-none lg:bg-transparent lg:px-0 lg:py-0 lg:border-b lg:border-border/60 lg:first:border-t lg:last:border-b-0"
                      >
                        <Link
                          href={href}
                          className="group flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-foreground transition hover:bg-primary/10 lg:rounded-none lg:px-5 lg:py-3"
                        >
                          <span className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:scale-105 group-hover:bg-primary/20">
                              <Icon className="h-4 w-4" />
                            </span>
                            <span>{text}</span>
                          </span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Card>
              </aside>

              <div className="lg:col-span-6">
                <Card
                  className="relative h-full overflow-hidden rounded-3xl border-0 bg-slate-950 text-white shadow-2xl"
                  style={{ minHeight: heroBannerTargetHeight }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${activeBanner.gradient} transition-all duration-1000`}
                    style={{
                      backgroundImage: activeBanner.bgPattern,
                      backgroundBlendMode: 'overlay',
                    }}
                  />
                  <div className="relative z-10 flex h-full flex-col justify-between gap-6 px-7 py-8 lg:px-10">
                    <div className="space-y-3">
                      <Badge className="w-fit bg-white/10 px-5 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg backdrop-blur">
                        {homeT(`banners.${activeBanner.key}Tag`)}
                      </Badge>
                      <div className="space-y-3">
                        <p className="text-base uppercase tracking-[0.4em] text-white/70">
                          {locale === 'vi' ? 'Streaming ưu đãi' : 'Premium streaming deal'}
                        </p>
                        <h2 className="text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
                          {homeT(`banners.${activeBanner.key}Title`)}
                        </h2>
                        <p className="text-2xl font-semibold text-primary md:text-3xl">
                          {homeT(`banners.${activeBanner.key}Subtitle`)}
                        </p>
                        <p className="text-base text-white/80 md:text-lg">
                          {locale === 'vi'
                            ? 'Chỉ từ 19K/ngày · Nội dung không giới hạn'
                            : 'From $0.79/day · Unlimited content'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <Link href={`/${locale}/accounts`}>
                        <Button className="gap-2 rounded-full bg-primary px-8 py-5 text-base font-semibold shadow-lg transition hover:-translate-y-0.5 hover:bg-primary/90">
                          {homeT('hero.shopNow')}
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </Link>
                      <Link href={`/${locale}/accounts?category=${activeBanner.key}`}>
                        <Button
                          variant="outline"
                          className="gap-2 rounded-full border-white/40 bg-white/10 px-8 py-5 text-base text-white transition hover:bg-white/20"
                        >
                          {locale === 'vi' ? 'Xem ưu đãi khác' : 'See more deals'}
                          <ArrowRight className="h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-4">
                    <button
                      aria-label={homeT('hero.previous')}
                      onClick={() =>
                        setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
                      }
                      className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/20"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      aria-label={homeT('hero.next')}
                      onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                      className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-white transition hover:bg-white/20"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
                    {banners.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentBanner(index)}
                        className={`h-2 rounded-full transition-all ${
                          currentBanner === index ? 'w-10 bg-white' : 'w-3 bg-white/40 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 md:flex">
                    <div className="flex h-32 w-32 items-center justify-center rounded-3xl border border-white/10 bg-black/30 text-5xl font-black uppercase text-white shadow-2xl backdrop-blur">
                      {activeBanner.key.charAt(0)}
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:col-span-3 lg:grid-cols-1">
                <Link href={`/${locale}/accounts?category=vpn`}>
                  <Card
                    className="relative overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-[#f7ecff] via-[#f1e4ff] to-white p-6 shadow-xl transition hover:-translate-y-1"
                    style={{ minHeight: HERO_SPOTLIGHT_CARD_HEIGHT }}
                  >
                    <div className="flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <Badge className="w-fit bg-purple-500/90 px-4 text-white">
                          {homeT('sideBanners.vpnBadge')}
                        </Badge>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-purple-500">
                          {locale === 'vi' ? 'Ứng dụng' : 'Apps'}
                        </p>
                        <h3 className="text-2xl font-black text-slate-900">
                          {homeT('sideBanners.vpnTitle')}
                        </h3>
                        <p className="text-sm font-semibold text-purple-700">
                          {homeT('sideBanners.vpnSubtitle')}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Nord', 'HMA', 'Express', 'Hotspot'].map((brand) => (
                          <span
                            key={brand}
                            className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-purple-700 shadow-sm"
                          >
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="absolute right-6 top-6 h-6 w-6 text-purple-500" />
                  </Card>
                </Link>

                <Link href={`/${locale}/accounts?category=ai-tools`}>
                  <Card
                    className="relative overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-[#fff7dc] via-[#fff1d3] to-white p-6 shadow-xl transition hover:-translate-y-1"
                    style={{ minHeight: HERO_SPOTLIGHT_CARD_HEIGHT }}
                  >
                    <div className="flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <Badge className="w-fit bg-amber-500 px-4 text-white">
                          {homeT('sideBanners.aiBadge')}
                        </Badge>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
                          {locale === 'vi' ? 'Khám phá' : 'Explore'}
                        </p>
                        <h3 className="text-2xl font-black text-slate-900">{homeT('sideBanners.aiTitle')}</h3>
                        <p className="text-sm font-semibold text-amber-600">
                          {homeT('sideBanners.aiSubtitle')}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Perplexity', 'ChatGPT', 'Copilot'].map((brand) => (
                          <span
                            key={brand}
                            className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-amber-600 shadow-sm"
                          >
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="absolute right-6 top-6 h-6 w-6 text-amber-500" />
                  </Card>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {heroSpotlightCards.map(
                ({ key, badgeText, titleText, subtitleText, href, gradient }) => (
                  <Card
                    key={key}
                    className={`relative overflow-hidden rounded-3xl border-0 bg-gradient-to-br ${gradient} p-5 shadow-lg transition hover:-translate-y-1`}
                    style={{ minHeight: HERO_SPOTLIGHT_CARD_HEIGHT }}
                  >
                    <div className="space-y-2">
                      <Badge className="bg-white/80 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
                        {badgeText}
                      </Badge>
                      <h3 className="text-xl font-black text-slate-900">{titleText}</h3>
                      <p className="text-sm font-semibold text-slate-600">{subtitleText}</p>
                    </div>
                    <Link
                      href={href}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:gap-2"
                    >
                      {locale === 'vi' ? 'Mua ngay' : 'Shop now'}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Card>
                ),
              )}
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
