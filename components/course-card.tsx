import Link from "next/link"
import Image from "next/image"
import { Star, BookOpen, Clock } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Course } from "@/lib/mock-data"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/courses/${course.slug}`}>
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={course.thumbnail || "/placeholder.svg"}
            alt={course.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/courses/${course.slug}`}>
          <h3 className="line-clamp-2 text-balance font-semibold transition-colors group-hover:text-primary">
            {course.title}
          </h3>
        </Link>
        <p className="mt-2 text-sm text-muted-foreground">{course.instructor}</p>
        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.lessons} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="text-sm font-medium">{course.rating}</span>
          <span className="text-sm text-muted-foreground">(245)</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-2xl font-bold">${course.price}</p>
        <Link href={`/courses/${course.slug}`}>
          <Button size="sm">Enroll Now</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
