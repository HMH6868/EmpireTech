'use client';

import { CourseCard } from '@/components/course-card';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ProductCard } from '@/components/product-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/hooks/use-language';
import { courses, products } from '@/lib/mock-data';
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Clock,
  Gift,
  GraduationCap,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { language } = useLanguage();
  const [currentBanner, setCurrentBanner] = useState(0);
  const popularProducts = products.slice(0, 12);
  const learningProducts = products.filter((p) => p.categoryId === 'productivity');
  const entertainmentProducts = products.filter((p) => p.categoryId === 'entertainment');
  const toolsProducts = products.filter((p) => ['ai-tools', 'design-tools'].includes(p.categoryId));
  const featuredCourses = courses.filter((c) => c.status === 'Published').slice(0, 3);

  const banners = [
    {
      title: { en: 'Steam Accounts', vi: 'TÀI KHOẢN STEAM' },
      subtitle: { en: 'OFFLINE GAME PACK', vi: 'GAME BOM TẤN' },
      tag: { en: 'BEST SELLER', vi: 'SIÊU TIẾT KIỆM' },
      gradient: 'from-green-600/30 via-green-500/20 to-green-400/10',
      bgPattern: 'radial-gradient(circle at 30% 50%, rgba(34, 197, 94, 0.2), transparent 50%)',
    },
    {
      title: { en: 'Premium Services', vi: 'DỊCH VỤ CAO CẤP' },
      subtitle: { en: 'UP TO 51% OFF', vi: 'GIẢM GIÁ ĐẾN 51%' },
      tag: { en: 'HOT DEAL', vi: 'ƯU ĐÃI SỐC' },
      gradient: 'from-blue-600/30 via-blue-500/20 to-blue-400/10',
      bgPattern: 'radial-gradient(circle at 70% 50%, rgba(59, 130, 246, 0.2), transparent 50%)',
    },
    {
      title: { en: 'Microsoft Office', vi: 'MICROSOFT OFFICE' },
      subtitle: { en: 'EXCLUSIVE OFFER', vi: 'BẢN QUYỀN' },
      tag: { en: 'PREMIUM', vi: 'CAO CẤP' },
      gradient: 'from-orange-600/30 via-orange-500/20 to-orange-400/10',
      bgPattern: 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.2), transparent 50%)',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const copy = {
    heroTitle: {
      en: 'Premium Digital Accounts',
      vi: 'Tài khoản số cao cấp',
    },
    heroHighlight: {
      en: 'Made Simple',
      vi: 'dễ dàng hơn bao giờ hết',
    },
    heroDescription: {
      en: "Access the world's best digital services at unbeatable prices. Instant delivery, lifetime support, and verified authenticity.",
      vi: 'Tiếp cận những dịch vụ số tốt nhất với mức giá cạnh tranh. Giao hàng tức thì, bảo hành trọn đời và cam kết chính chủ.',
    },
    ctaAccounts: { en: 'Buy Accounts Now', vi: 'Mua tài khoản ngay' },
    ctaCourses: { en: 'Browse Courses', vi: 'Xem khóa học' },
    features: [
      {
        title: { en: 'Instant Delivery', vi: 'Giao hàng ngay' },
        description: {
          en: 'Get your accounts within minutes of purchase with our automated system',
          vi: 'Nhận tài khoản trong vài phút nhờ hệ thống tự động',
        },
      },
      {
        title: { en: 'Verified & Secure', vi: 'Chính chủ & an toàn' },
        description: {
          en: 'All accounts are verified and come with secure payment protection',
          vi: 'Mọi tài khoản đều được xác thực và bảo vệ thanh toán',
        },
      },
      {
        title: { en: '24/7 Support', vi: 'Hỗ trợ 24/7' },
        description: {
          en: 'Our support team is always here to help you with any questions',
          vi: 'Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc',
        },
      },
    ],
    popularHeading: { en: 'Hot Deals Today', vi: 'Sản phẩm nổi bật' },
    popularDescription: {
      en: 'Our best-selling digital accounts trusted by thousands',
      vi: 'Hàng ngàn khách hàng đã tin chọn - Uy tín được đảm bảo',
    },
    viewAllAccounts: { en: 'View All Products', vi: 'Xem tất cả' },
    learningHeading: { en: '📚 Learning & Productivity', vi: '📚 Học tập & Năng suất' },
    learningDescription: {
      en: 'Premium tools to boost your productivity and learning',
      vi: 'Công cụ cao cấp giúp tăng năng suất học tập và làm việc',
    },
    entertainmentHeading: { en: '🎬 Entertainment & Streaming', vi: '🎬 Giải trí & Streaming' },
    entertainmentDescription: {
      en: 'Unlimited access to movies, music, and entertainment',
      vi: 'Truy cập không giới hạn phim ảnh, âm nhạc và giải trí',
    },
    toolsHeading: { en: '🛠️ Design & AI Tools', vi: '🛠️ Công cụ thiết kế & AI' },
    toolsDescription: {
      en: 'Professional design and AI tools for creators',
      vi: 'Công cụ thiết kế và AI chuyên nghiệp cho nhà sáng tạo',
    },
    coursesHeading: { en: 'Online Courses', vi: 'Khóa học trực tuyến' },
    coursesDescription: {
      en: 'Level up your skills with expert instructors',
      vi: 'Nâng cấp kỹ năng với giảng viên chuyên nghiệp',
    },
    viewAllCourses: { en: 'View All Courses', vi: 'Xem tất cả khóa học' },
    readyTitle: { en: 'Ready to Get Started?', vi: 'Sẵn sàng bắt đầu chưa?' },
    readyDescription: {
      en: 'Join thousands of satisfied customers and start accessing premium digital services today',
      vi: 'Gia nhập cộng đồng khách hàng hài lòng và trải nghiệm dịch vụ số cao cấp ngay hôm nay',
    },
    browseAccounts: { en: 'Browse Accounts', vi: 'Khám phá tài khoản' },
    categories: {
      all: { en: 'All Products', vi: 'Tất cả' },
      learning: { en: 'Learning', vi: 'Học tập' },
      streaming: { en: 'Streaming', vi: 'Giải trí' },
      tools: { en: 'Tools', vi: 'Công cụ' },
    },
  };

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
                <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden group shadow-2xl">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${banners[currentBanner].gradient} transition-all duration-1000`}
                    style={{
                      backgroundImage: banners[currentBanner].bgPattern,
                      backgroundBlendMode: 'overlay',
                    }}
                  >
                    <div className="relative h-full flex flex-col justify-center px-8 lg:px-16">
                      <Badge className="w-fit mb-4 bg-red-500 hover:bg-red-600 text-white border-0 px-6 py-2 text-base font-bold animate-pulse shadow-lg">
                        {banners[currentBanner].tag[language]}
                      </Badge>
                      <h2 className="text-5xl lg:text-7xl font-black mb-4 text-foreground drop-shadow-2xl leading-tight">
                        {banners[currentBanner].title[language]}
                      </h2>
                      <p className="text-3xl lg:text-5xl font-bold text-primary mb-8 drop-shadow-lg">
                        {banners[currentBanner].subtitle[language]}
                      </p>
                      <div className="flex gap-4">
                        <Link href="/accounts">
                          <Button
                            size="lg"
                            className="gap-2 px-10 py-6 text-lg bg-primary hover:bg-primary/90 shadow-2xl hover:shadow-primary/50 transition-all hover:scale-105"
                          >
                            {language === 'vi' ? 'Mua ngay' : 'Shop Now'}
                            <ArrowRight className="h-6 w-6" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Carousel Indicators */}
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
                </div>
              </div>

              {/* Side Banners */}
              <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-4">
                <Link href="/accounts?category=vpn">
                  <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200/50 hover:shadow-xl hover:scale-105 transition-all cursor-pointer group h-full">
                    <div className="p-6 h-full flex flex-col justify-between">
                      <div>
                        <Badge className="mb-3 bg-purple-500 hover:bg-purple-600 border-0 shadow-lg">
                          {language === 'vi' ? '🔥 ƯU ĐÃI' : '🔥 PROMO'}
                        </Badge>
                        <h3 className="text-2xl font-black mb-2">VPN</h3>
                        <p className="text-sm text-muted-foreground font-semibold">
                          {language === 'vi' ? 'BẢO MẬT' : 'SECURE'}
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
                          {language === 'vi' ? '⚡ MỚI' : '⚡ NEW'}
                        </Badge>
                        <h3 className="text-2xl font-black mb-2">AI Tools</h3>
                        <p className="text-sm text-muted-foreground font-semibold">
                          {language === 'vi' ? 'CHATGPT+' : 'PREMIUM'}
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
              {[
                { Icon: Zap, color: 'text-yellow-500' },
                { Icon: Shield, color: 'text-green-500' },
                { Icon: Clock, color: 'text-blue-500' },
              ].map(({ Icon, color }, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg bg-card/50 hover:bg-card transition-all hover:shadow-md group"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ${color} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">
                      {copy.features[index].title[language]}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {copy.features[index].description[language]}
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
                    {copy.popularHeading[language]}
                  </h2>
                </div>
                <p className="text-muted-foreground">{copy.popularDescription[language]}</p>
              </div>
              <Link href="/accounts" className="hidden md:block">
                <Button variant="ghost" className="gap-2 hover:gap-3 transition-all">
                  {copy.viewAllAccounts[language]}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-8 bg-muted/50">
                <TabsTrigger value="all" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  {copy.categories.all[language]}
                </TabsTrigger>
                <TabsTrigger value="learning">{copy.categories.learning[language]}</TabsTrigger>
                <TabsTrigger value="streaming">{copy.categories.streaming[language]}</TabsTrigger>
                <TabsTrigger value="tools">{copy.categories.tools[language]}</TabsTrigger>
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
                  {copy.viewAllAccounts[language]}
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
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                  {copy.learningHeading[language]}
                </h2>
                <p className="text-muted-foreground">{copy.learningDescription[language]}</p>
              </div>
              <Link href="/accounts?category=productivity" className="hidden md:block">
                <Button variant="ghost" className="gap-2 hover:gap-3 transition-all">
                  {language === 'vi' ? 'Xem thêm' : 'View More'}
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
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                  {copy.entertainmentHeading[language]}
                </h2>
                <p className="text-muted-foreground">{copy.entertainmentDescription[language]}</p>
              </div>
              <Link href="/accounts?category=entertainment" className="hidden md:block">
                <Button variant="ghost" className="gap-2 hover:gap-3 transition-all">
                  {language === 'vi' ? 'Xem thêm' : 'View More'}
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
                <h2 className="text-3xl font-bold tracking-tight mb-2">
                  {copy.toolsHeading[language]}
                </h2>
                <p className="text-muted-foreground">{copy.toolsDescription[language]}</p>
              </div>
              <Link href="/accounts?category=tools" className="hidden md:block">
                <Button variant="ghost" className="gap-2 hover:gap-3 transition-all">
                  {language === 'vi' ? 'Xem thêm' : 'View More'}
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
                    {copy.coursesHeading[language]}
                  </h2>
                </div>
                <p className="text-muted-foreground flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {copy.coursesDescription[language]}
                </p>
              </div>
              <Link href="/courses" className="hidden md:block">
                <Button variant="ghost" className="gap-2 hover:gap-3 transition-all">
                  {copy.viewAllCourses[language]}
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

            <div className="mt-10 text-center">
              <Link href="/courses">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-gradient-to-r from-primary/10 to-blue-500/10 hover:from-primary/20 hover:to-blue-500/20 border-primary/30"
                >
                  {copy.viewAllCourses[language]}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
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
                  {copy.readyTitle[language]}
                </h2>
                <p className="text-base lg:text-lg mb-6 opacity-90 max-w-xl mx-auto">
                  {copy.readyDescription[language]}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/accounts">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="gap-2 px-8 hover:scale-105 transition-transform"
                    >
                      {copy.browseAccounts[language]}
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/promotions">
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2 px-8 bg-white/10 border-white/30 hover:bg-white/20 text-white hover:text-white"
                    >
                      {language === 'vi' ? 'Xem ưu đãi' : 'View Promotions'}
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
