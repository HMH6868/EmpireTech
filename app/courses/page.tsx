"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CourseCard } from "@/components/course-card"
import { courses } from "@/lib/mock-data"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"

const copy = {
  title: { en: "Explore Courses", vi: "Khám phá khóa học" },
  subtitle: {
    en: "Upskill with expert-led lessons, practice projects, and lifetime access.",
    vi: "Nâng cấp kỹ năng với khóa học cùng chuyên gia, dự án thực hành và truy cập trọn đời.",
  },
  empty: { en: "No courses found.", vi: "Không tìm thấy khoá học." },
  filterAll: { en: "All", vi: "Tất cả" },
  published: { en: "Published", vi: "Đã phát hành" },
  draft: { en: "Draft", vi: "Bản nháp" },
}

export default function CoursesPage() {
  const { language } = useLanguage()
  const [statusFilter, setStatusFilter] = useState<"all" | "Published" | "Draft">("all")

  const filteredCourses =
    statusFilter === "all" ? courses : courses.filter((course) => course.status === statusFilter)

  const statusButtons: { id: "all" | "Published" | "Draft"; label: string }[] = [
    { id: "all", label: copy.filterAll[language] },
    { id: "Published", label: copy.published[language] },
    { id: "Draft", label: copy.draft[language] },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />


      <main className="flex-1">
        <section className="border-b border-border/40 bg-muted/30 py-5 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-balance text-xl font-bold tracking-tight sm:text-2xl">{copy.title[language]}</h1>
            <p className="mt-1 text-pretty text-base text-muted-foreground">{copy.subtitle[language]}</p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-wrap gap-2">
              {statusButtons.map((status) => (
                <Button
                  key={status.id}
                  variant={statusFilter === status.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status.id)}
                  className="transition-all"
                >
                  {status.label}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">{copy.empty[language]}</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
