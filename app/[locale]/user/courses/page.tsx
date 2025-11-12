"use client"
import Link from "next/link"
import Image from "next/image"
import { Play, BookOpen, Clock, Award } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { courses, type LocalizedText } from "@/lib/mock-data"
import { useLanguage } from "@/hooks/use-locale"

const getLocalizedString = (value: LocalizedText | string, lang: "en" | "vi") =>
  typeof value === "string" ? value : value[lang] ?? ""

export default function UserCoursesPage() {
  const { locale } = useLanguage()
  // Mock enrolled courses with progress
  const enrolledCourses = [
    {
      ...courses[0],
      progress: 45,
      enrolledDate: "2024-02-15",
      lastAccessed: "2024-02-20",
      completedLessons: 20,
    },
    {
      ...courses[1],
      progress: 12,
      enrolledDate: "2024-02-18",
      lastAccessed: "2024-02-19",
      completedLessons: 7,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="mt-2 text-muted-foreground">Continue your learning journey</p>
          </div>

          {enrolledCourses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No courses yet</h3>
                <p className="mb-4 text-muted-foreground">You haven't enrolled in any courses.</p>
                <Link href="/courses">
                  <Button>Browse Courses</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map((course) => (
                <Card key={course.id} className="group overflow-hidden transition-all hover:shadow-lg">
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={getLocalizedString(course.title, locale)}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button size="lg" className="gap-2">
                        <Play className="h-5 w-5" />
                        Continue Learning
                      </Button>
                    </div>
                    {course.progress === 100 && (
                      <Badge className="absolute right-2 top-2 gap-1" variant="default">
                        <Award className="h-3 w-3" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <Link href={`/courses/${course.slug}`}>
                      <h3 className="mb-2 line-clamp-2 text-balance font-semibold transition-colors group-hover:text-primary">
                        {getLocalizedString(course.title, locale)}
                      </h3>
                    </Link>
                    <p className="mb-3 text-sm text-muted-foreground">{course.instructor}</p>

                    {/* Progress */}
                    <div className="mb-3">
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>
                          {course.completedLessons}/{course.lessons} {locale === "vi" ? "bài học" : "lessons"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{getLocalizedString(course.duration, locale)}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Link href={`/courses/${course.slug}`}>
                        <Button variant="outline" className="w-full bg-transparent">
                          {course.progress === 100 ? "Review Course" : "Continue Learning"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
