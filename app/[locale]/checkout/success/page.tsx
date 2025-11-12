import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function OrderSuccessPage() {
  const orderNumber = "ET-" + Math.random().toString(36).substr(2, 9).toUpperCase()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardContent className="p-12 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                </div>
                <h1 className="mb-3 text-3xl font-bold">Order Successful!</h1>
                <p className="mb-6 text-lg text-muted-foreground">
                  Thank you for your purchase. Your order has been confirmed.
                </p>

                <div className="mb-8 rounded-lg bg-muted p-4">
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="text-2xl font-bold">{orderNumber}</p>
                </div>

                <div className="space-y-4 text-left">
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 font-semibold">What's Next?</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• You will receive an order confirmation email shortly</li>
                      <li>• Account credentials will be sent to your delivery email</li>
                      <li>• Check your orders page to track your purchase</li>
                      <li>• Contact support if you need any assistance</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link href="/user/orders">
                    <Button size="lg" className="w-full sm:w-auto">
                      View My Orders
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
