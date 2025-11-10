"use client"

import Link from "next/link"
import { ArrowRight, Zap, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { CourseCard } from "@/components/course-card"
import { products, courses } from "@/lib/mock-data"
import { useLanguage } from "@/hooks/use-language"

export default function HomePage() {
  const { language } = useLanguage()
  const popularProducts = products.slice(0, 4)
  const featuredCourses = courses.slice(0, 3)
  const copy = {
    heroTitle: {
      en: "Premium Digital Accounts",
      vi: "Tài khoản số cao cấp",
    },
    heroHighlight: {
      en: "Made Simple",
      vi: "dễ dàng hơn bao giờ hết",
    },
    heroDescription: {
      en: "Access the world's best digital services at unbeatable prices. Instant delivery, lifetime support, and verified authenticity.",
      vi: "Tiếp cận những dịch vụ số tốt nhất với mức giá cạnh tranh. Giao hàng tức thì, bảo hành trọn đời và cam kết chính chủ.",
    },
    ctaAccounts: { en: "Buy Accounts Now", vi: "Mua tài khoản ngay" },
    ctaCourses: { en: "Browse Courses", vi: "Xem khóa học" },
    features: [
      {
        title: { en: "Instant Delivery", vi: "Giao ngay" },
        description: {
          en: "Get your accounts within minutes of purchase with our automated system",
          vi: "Nhận tài khoản trong vài phút nhờ hệ thống tự động",
        },
      },
      {
        title: { en: "Verified & Secure", vi: "Chính chủ & an toàn" },
        description: {
          en: "All accounts are verified and come with secure payment protection",
          vi: "Mọi tài khoản đều được xác thực và bảo vệ thanh toán",
        },
      },
      {
        title: { en: "24/7 Support", vi: "Hỗ trợ 24/7" },
        description: {
          en: "Our support team is always here to help you with any questions",
          vi: "Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc",
        },
      },
    ],
    popularHeading: { en: "Popular Accounts", vi: "Tài khoản nổi bật" },
    popularDescription: {
      en: "Our best-selling digital accounts trusted by thousands",
      vi: "Những tài khoản bán chạy được hàng nghìn khách hàng tin dùng",
    },
    viewAllAccounts: { en: "View All Accounts", vi: "Xem tất cả tài khoản" },
    coursesHeading: { en: "Featured Courses", vi: "Khoá học tiêu biểu" },
    coursesDescription: {
      en: "Learn new skills with our expert-led online courses",
      vi: "Nâng cấp kỹ năng cùng các khóa học chuyên sâu",
    },
    viewAllCourses: { en: "View All Courses", vi: "Xem tất cả khóa học" },
    readyTitle: { en: "Ready to Get Started?", vi: "Sẵn sàng bắt đầu chưa?" },
    readyDescription: {
      en: "Join thousands of satisfied customers and start accessing premium digital services today",
      vi: "Gia nhập cộng đồng khách hàng hài lòng và trải nghiệm dịch vụ số cao cấp ngay hôm nay",
    },
    browseAccounts: { en: "Browse Accounts", vi: "Khám phá tài khoản" },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {copy.heroTitle[language]} <span className="text-primary">{copy.heroHighlight[language]}</span>
              </h1>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {copy.heroDescription[language]}
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/accounts">
                  <Button size="lg" className="gap-2 px-8">
                    {copy.ctaAccounts[language]}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="px-8 bg-transparent">
                    {copy.ctaCourses[language]}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-y border-border/40 bg-muted/30 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {[Zap, Shield, Clock].map((Icon, index) => (
                  <div key={Icon.displayName ?? index} className="flex flex-col items-center gap-3 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{copy.features[index].title[language]}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {copy.features[index].description[language]}
                    </p>
                  </div>
                ))}
              </div>
          </div>
        </section>

        {/* Popular Products */}
        <section id="popular" className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {copy.popularHeading[language]}
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">{copy.popularDescription[language]}</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/accounts">
                <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                  {copy.viewAllAccounts[language]}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="bg-muted/30 py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                {copy.coursesHeading[language]}
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">{copy.coursesDescription[language]}</p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/courses">
                <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                  {copy.viewAllCourses[language]}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-primary p-8 text-center text-primary-foreground lg:p-12">
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{copy.readyTitle[language]}</h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed opacity-90">{copy.readyDescription[language]}</p>
              <div className="mt-8">
                <Link href="/accounts">
                  <Button size="lg" variant="secondary" className="gap-2 px-8">
                    {copy.browseAccounts[language]}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
