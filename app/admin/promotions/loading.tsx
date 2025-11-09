import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminPromotionsLoading() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 bg-muted/30 p-8 md:ml-64">
        <div className="mb-8">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-2 h-5 w-96" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
