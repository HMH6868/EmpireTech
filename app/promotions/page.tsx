"use client"

import { Copy, Tag, Calendar, TrendingUp } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { promotions, type LocalizedText } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/hooks/use-language"

const getLocalizedString = (value: LocalizedText | string, lang: "en" | "vi") =>
  typeof value === "string" ? value : value[lang] ?? ""

export default function PromotionsPage() {
  const { toast } = useToast()
  const { language } = useLanguage()

  const activePromotions = promotions.filter((p) => p.status === "active")
  const upcomingPromotions = promotions.filter((p) => p.status === "scheduled")

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code copied!",
      description: `Promo code "${code}" has been copied to clipboard.`,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/20 via-primary/10 to-background py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                <Tag className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
                Special Promotions & Offers
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
                Save big with our exclusive discount codes and limited-time deals
              </p>
            </div>
          </div>
        </section>

        {/* Active Promotions */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Active Promotions</h2>
            </div>

            {activePromotions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No active promotions at the moment. Check back soon!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activePromotions.map((promo) => (
                  <Card key={promo.id} className="group relative overflow-hidden transition-all hover:shadow-lg">
                    <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-primary/10" />
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Badge variant="default" className="mb-2">
                            {promo.discountPercent}% OFF
                          </Badge>
                          <CardTitle className="text-xl">{getLocalizedString(promo.description, language)}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Promo Code */}
                      <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-4">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">PROMO CODE</p>
                        <div className="flex items-center justify-between">
                          <code className="text-2xl font-bold tracking-wider">{promo.code}</code>
                          <Button size="sm" variant="ghost" onClick={() => handleCopyCode(promo.code)} className="ml-2">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Valid: {promo.startDate} to {promo.endDate}
                          </span>
                        </div>
                        {promo.usageLimit && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Usage:</span>
                            <span className="font-medium">
                              {promo.usedCount} / {promo.usageLimit}
                            </span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <Button className="w-full" onClick={() => handleCopyCode(promo.code)}>
                        Copy Code & Shop Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Upcoming Promotions */}
        {upcomingPromotions.length > 0 && (
          <section className="border-t border-border/40 bg-muted/30 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold">Coming Soon</h2>
                <p className="mt-2 text-muted-foreground">Mark your calendar for these upcoming deals</p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {upcomingPromotions.map((promo) => (
                  <Card key={promo.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <Badge variant="outline">{promo.discountPercent}% OFF</Badge>
                            <Badge variant="secondary">Upcoming</Badge>
                          </div>
                          <h3 className="mb-1 font-semibold">{getLocalizedString(promo.description, language)}</h3>
                          <p className="text-sm text-muted-foreground">Starts on {promo.startDate}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How to Use */}
        <section className="border-t border-border/40 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center text-2xl font-bold">How to Use Promo Codes</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                      1
                    </div>
                    <h3 className="mb-2 font-semibold">Copy Code</h3>
                    <p className="text-sm text-muted-foreground">
                      Click on the promo code to copy it to your clipboard
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                      2
                    </div>
                    <h3 className="mb-2 font-semibold">Add to Cart</h3>
                    <p className="text-sm text-muted-foreground">Browse products and add items to your shopping cart</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                      3
                    </div>
                    <h3 className="mb-2 font-semibold">Apply & Save</h3>
                    <p className="text-sm text-muted-foreground">Paste the code at checkout and enjoy your discount</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
