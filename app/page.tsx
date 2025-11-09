import Link from "next/link"
import { ArrowRight, Zap, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { CourseCard } from "@/components/course-card"
import { products, courses } from "@/lib/mock-data"

export default function HomePage() {
  const popularProducts = products.slice(0, 4)
  const featuredCourses = courses.slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Premium Digital Accounts <span className="text-primary">Made Simple</span>
              </h1>
              <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Access the world's best digital services at unbeatable prices. Instant delivery, lifetime support, and
                verified authenticity.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/accounts">
                  <Button size="lg" className="gap-2 px-8">
                    Buy Accounts Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="px-8 bg-transparent">
                    Browse Courses
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
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Instant Delivery</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Get your accounts within minutes of purchase with our automated system
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Verified & Secure</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  All accounts are verified and come with secure payment protection
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">24/7 Support</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our support team is always here to help you with any questions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Products */}
        <section id="popular" className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Popular Accounts</h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                Our best-selling digital accounts trusted by thousands
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/accounts">
                <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                  View All Accounts
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
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Featured Courses</h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                Learn new skills with our expert-led online courses
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link href="/courses">
                <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                  View All Courses
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
              <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Ready to Get Started?</h2>
              <p className="mt-4 text-pretty text-lg leading-relaxed opacity-90">
                Join thousands of satisfied customers and start accessing premium digital services today
              </p>
              <div className="mt-8">
                <Link href="/accounts">
                  <Button size="lg" variant="secondary" className="gap-2 px-8">
                    Browse Accounts
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
