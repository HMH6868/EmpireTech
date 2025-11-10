"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CourseCard } from "@/components/course-card"
import { courses } from "@/lib/mock-data"
import { useLanguage } from "@/hooks/use-language"

export default function CoursesPage() {
  const { language } = useLanguage()

  const copy = {
    title: { en: "Online Courses", vi: "Khoá học trực tuyến" },
    description: {
      en: "Learn new skills with our expert-led courses and advance your career",
      vi: "Học kỹ năng mới cùng chuyên gia và thăng tiến sự nghiệp",
    },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-border/40 bg-muted/30 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{copy.title[language]}</h1>
            <p className="mt-3 text-pretty text-lg text-muted-foreground">{copy.description[language]}</p>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
