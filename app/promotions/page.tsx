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

const copy = {
  title: {
    en: "Special Promotions & Offers",
    vi: "Ưu đãi và khuyến mãi đặc biệt",
  },
  description: {
    en: "Save big with our exclusive discount codes and limited-time deals",
    vi: "Tiết kiệm lớn với mã giảm giá độc quyền và ưu đãi có thời hạn",
  },
  activeTitle: { en: "Active Promotions", vi: "Khuyến mãi đang diễn ra" },
  noActive: {
    en: "No active promotions at the moment. Check back soon!",
    vi: "Hiện chưa có khuyến mãi nào. Vui lòng quay lại sau!",
  },
  promoCodeLabel: { en: "PROMO CODE", vi: "MÃ KHUYẾN MÃI" },
  validLabel: { en: "Valid", vi: "Hiệu lực" },
  usageLabel: { en: "Usage", vi: "Lượt sử dụng" },
  copyButton: { en: "Copy Code & Shop Now", vi: "Sao chép mã & mua sắm" },
  toastTitle: { en: "Code copied!", vi: "Đã sao chép mã!" },
  toastMessage: {
    en: (code: string) => `Promo code "${code}" has been copied to clipboard.`,
    vi: (code: string) => `Mã "${code}" đã được sao chép vào clipboard.`,
  },
  upcomingTitle: { en: "Coming Soon", vi: "Sắp diễn ra" },
  upcomingSubtitle: {
    en: "Mark your calendar for these upcoming deals",
    vi: "Đừng bỏ lỡ những ưu đãi sắp tới",
  },
  howToTitle: { en: "How to Use Promo Codes", vi: "Cách sử dụng mã khuyến mãi" },
  steps: [
    {
      title: { en: "Copy Code", vi: "Sao chép mã" },
      description: {
        en: "Click on the promo code to copy it to your clipboard",
        vi: "Nhấn vào mã để sao chép nhanh vào clipboard",
      },
    },
    {
      title: { en: "Add to Cart", vi: "Thêm vào giỏ" },
      description: {
        en: "Browse products and add items to your shopping cart",
        vi: "Chọn sản phẩm yêu thích và thêm vào giỏ hàng",
      },
    },
    {
      title: { en: "Apply & Save", vi: "Áp dụng & tiết kiệm" },
      description: {
        en: "Paste the code at checkout and enjoy your discount",
        vi: "Nhập mã tại bước thanh toán để nhận ưu đãi",
      },
    },
  ],
}

export default function PromotionsPage() {
  const { toast } = useToast()
  const { language } = useLanguage()

  const activePromotions = promotions.filter((p) => p.status === "active")
  const upcomingPromotions = promotions.filter((p) => p.status === "scheduled")

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: copy.toastTitle[language],
      description: copy.toastMessage[language](code),
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="border-b border-border/40 bg-muted/30 py-5 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-balance text-xl font-bold tracking-tight sm:text-2xl">{copy.title[language]}</h1>
            <p className="mt-1 text-pretty text-base text-muted-foreground">{copy.description[language]}</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">{copy.activeTitle[language]}</h2>
            </div>

            {activePromotions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">{copy.noActive[language]}</p>
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
                      <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-4">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">{copy.promoCodeLabel[language]}</p>
                        <div className="flex items-center justify-between">
                          <code className="text-2xl font-bold tracking-wider">{promo.code}</code>
                          <Button size="sm" variant="ghost" onClick={() => handleCopyCode(promo.code)} className="ml-2">
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {copy.validLabel[language]}: {promo.startDate} → {promo.endDate}
                          </span>
                        </div>
                        {promo.usageLimit && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{copy.usageLabel[language]}:</span>
                            <span className="font-medium">
                              {promo.usedCount} / {promo.usageLimit}
                            </span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <Button className="w-full" onClick={() => handleCopyCode(promo.code)}>
                        {copy.copyButton[language]}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {upcomingPromotions.length > 0 && (
          <section className="border-t border-border/40 bg-muted/30 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold">{copy.upcomingTitle[language]}</h2>
                <p className="mt-2 text-muted-foreground">{copy.upcomingSubtitle[language]}</p>
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
                          <p className="text-sm text-muted-foreground">
                            {language === "vi" ? "Bắt đầu từ" : "Starts on"} {promo.startDate}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-border/40 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center text-2xl font-bold">{copy.howToTitle[language]}</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {copy.steps.map((step, index) => (
                  <Card key={step.title.en}>
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                        {index + 1}
                      </div>
                      <h3 className="mb-2 font-semibold">{step.title[language]}</h3>
                      <p className="text-sm text-muted-foreground">{step.description[language]}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
