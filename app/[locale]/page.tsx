'use client';

import { ProductCard } from '@/components/account-card';
import { CourseCard } from '@/components/course-card';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/use-locale';
import { useTranslations } from '@/hooks/useTranslations';
import { courses, products } from '@/lib/mock-data';
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Clock,
  Gift,
  GraduationCap,
  Shield,
  Sparkles,
  TrendingUp,
  Tv,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const featureItems = [
  { key: 'instantDelivery', Icon: Zap, color: 'text-yellow-500' },
  { key: 'secure', Icon: Shield, color: 'text-green-500' },
  { key: 'support', Icon: Clock, color: 'text-blue-500' },
] as const;

export default function HomePage() {
  const { locale } = useLanguage();
  const homeT = useTranslations('home');
  const [currentBanner, setCurrentBanner] = useState(0);
  const popularProducts = products.slice(0, 12);
  const learningProducts = products.filter((p) => p.categoryId === 'productivity');
  const entertainmentProducts = products.filter((p) => p.categoryId === 'entertainment');
  const toolsProducts = products.filter((p) => ['ai-tools', 'design-tools'].includes(p.categoryId));
  const featuredCourses = courses.filter((c) => c.status === 'Published').slice(0, 3);

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
              {/* Main Banner */}
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
                          <Link href="/accounts">
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

                    {/* Carousel Controls */}
                    <div className="absolute inset-y-0 left-4 z-20 flex items-center">
                      <button
                        aria-label="Previous banner"
                        title={homeT('hero.previous')}
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
                        title={homeT('hero.next')}
                        onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
                        className="hidden group-hover:flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-transform shadow-lg"
                      >
                        <ChevronRight className="h-5 w-5 text-primary" />
                      </button>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Side Banners */}
              <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-4">
                <Link href="/accounts?category=vpn">
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

                <Link href="/accounts?category=ai-tools">
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

        {/* Popular Products with Tabs */}
        <section id="popular" className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <h2 className="text-3xl font-bold tracking-tight">
                    {homeT('sections.popularTitle')}
                  </h2>
                </div>
                <p className="text-muted-foreground">{homeT('sections.popularDescription')}</p>
              </div>
              <Link href="/accounts" className="hidden md:block">
                <Button
                  variant="ghost"
                  className="gap-2 bg-gradient-to-r from-primary/10 to-blue-500/10 hover:from-primary/20 hover:to-blue-500/20 border-primary/30"
                >
                  {homeT('sections.popularViewAll')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-8 bg-muted/50">
                <TabsTrigger value="all" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {homeT('tabs.all')}
                </TabsTrigger>
                <TabsTrigger value="learning">{homeT('tabs.learning')}</TabsTrigger>
                <TabsTrigger value="streaming">{homeT('tabs.streaming')}</TabsTrigger>
                <TabsTrigger value="tools">{homeT('tabs.tools')}</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {popularProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="learning" className="mt-0">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {popularProducts
                    .filter((p) => p.categoryId === 'productivity')
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="streaming" className="mt-0">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {popularProducts
                    .filter((p) => p.categoryId === 'entertainment')
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="tools" className="mt-0">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                  {popularProducts
                    .filter((p) => ['ai-tools', 'design-tools'].includes(p.categoryId))
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 text-center md:hidden">
              <Link href="/accounts">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  {homeT('sections.popularViewAll')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Learning & Productivity Section */}
        <section className="py-12 lg:py-16 bg-gradient-to-br from-blue-500/5 via-background to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  {homeT('sections.learningTitle')}
                </h2>
                <p className="text-muted-foreground">{homeT('sections.learningDescription')}</p>
              </div>
              <Link href="/accounts?category=productivity" className="hidden md:block">
                <Button
                  variant="ghost"
                  className="gap-2 bg-gradient-to-r from-primary/10 to-blue-500/10 hover:from-primary/20 hover:to-blue-500/20 border-primary/30"
                >
                  {homeT('sections.learningViewMore')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {learningProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Entertainment & Streaming Section */}
        <section className="py-12 lg:py-16 bg-gradient-to-br from-purple-500/5 via-background to-background border-y border-border/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
                  <Tv className="h-6 w-6 text-primary font-bold" />
                  {homeT('sections.entertainmentTitle')}
                </h2>
                <p className="text-muted-foreground">
                  {homeT('sections.entertainmentDescription')}
                </p>
              </div>
              <Link href="/accounts?category=entertainment" className="hidden md:block">
                <Button
                  variant="ghost"
                  className="gap-2 bg-gradient-to-r from-primary/10 to-blue-500/10 hover:from-primary/20 hover:to-blue-500/20 border-primary/30"
                >
                  {homeT('sections.entertainmentViewMore')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {entertainmentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Design & AI Tools Section */}
        <section className="py-12 lg:py-16 bg-gradient-to-br from-orange-500/5 via-background to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                  {homeT('sections.toolsTitle')}
                </h2>
                <p className="text-muted-foreground">{homeT('sections.toolsDescription')}</p>
              </div>
              <Link href="/accounts?category=tools" className="hidden md:block">
                <Button
                  variant="ghost"
                  className="gap-2 bg-gradient-to-r from-primary/10 to-blue-500/10 hover:from-primary/20 hover:to-blue-500/20 border-primary/30"
                >
                  {homeT('sections.toolsViewMore')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {toolsProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Online Courses Section */}
        <section className="py-12 lg:py-16 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center shadow-lg">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight">
                    {homeT('sections.coursesTitle')}
                  </h2>
                </div>
                <p className="text-muted-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {homeT('sections.coursesDescription')}
                </p>
              </div>
              <Link href="/courses" className="hidden md:block">
                <Button
                  variant="ghost"
                  className="gap-2 bg-gradient-to-r from-primary/10 to-blue-500/10 hover:from-primary/20 hover:to-blue-500/20 border-primary/30"
                >
                  {homeT('sections.coursesViewAll')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <div key={course.id} className="group">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-8 lg:p-12 text-center text-primary-foreground overflow-hidden">
              {/* Decorative elements */}
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
                  <Link href="/accounts">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="gap-2 px-8 hover:scale-105 transition-transform"
                    >
                      {homeT('hero.browseAccounts')}
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/promotions">
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
