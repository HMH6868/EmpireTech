"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CreditCard, Wallet, Building } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { products } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/hooks/use-language"

const checkoutItems = [
  {
    id: products[0].id,
    name: products[0].name,
    price: products[0].price,
    image: products[0].image,
    variant: products[0].variants?.[0]?.name,
  },
  {
    id: products[1].id,
    name: products[1].name,
    price: products[1].price,
    image: products[1].image,
    variant: products[1].variants?.[0]?.name,
  },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { language, currency, formatCurrency } = useLanguage()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    deliveryEmail: "",
    deliveryPassword: "",
  })

  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price[currency], 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const copy = {
    backToCart: { en: "Back to Cart", vi: "Quay lại giỏ hàng" },
    checkout: { en: "Checkout", vi: "Thanh toán" },
    contactInfo: { en: "Contact Information", vi: "Thông tin liên hệ" },
    fullName: { en: "Full Name *", vi: "Họ và tên *" },
    email: { en: "Email Address *", vi: "Email liên hệ *" },
    deliveryTitle: { en: "Delivery Details", vi: "Thông tin giao tài khoản" },
    deliveryEmail: { en: "Delivery Email *", vi: "Email nhận tài khoản *" },
    deliveryHint: {
      en: "Account credentials will be sent to this email",
      vi: "Thông tin tài khoản sẽ được gửi tới email này",
    },
    preferredPassword: { en: "Preferred Password (Optional)", vi: "Mật khẩu mong muốn (tùy chọn)" },
    preferredHint: {
      en: "If provided, we'll try to set this as your account password",
      vi: "Nếu cung cấp, chúng tôi sẽ cố gắng đặt mật khẩu này",
    },
    paymentMethodTitle: { en: "Payment Method", vi: "Phương thức thanh toán" },
    card: { en: "Credit / Debit Card", vi: "Thẻ tín dụng / ghi nợ" },
    cardDesc: { en: "Visa, Mastercard, American Express", vi: "Hỗ trợ Visa, Mastercard, American Express" },
    paypal: { en: "PayPal", vi: "PayPal" },
    paypalDesc: { en: "Pay with your PayPal account", vi: "Thanh toán bằng tài khoản PayPal" },
    bank: { en: "Bank Transfer", vi: "Chuyển khoản" },
    bankDesc: { en: "Direct bank transfer", vi: "Chuyển khoản trực tiếp" },
    summaryTitle: { en: "Order Summary", vi: "Tóm tắt đơn hàng" },
    subtotal: { en: "Subtotal", vi: "Tạm tính" },
    taxLabel: { en: "Tax (10%)", vi: "Thuế (10%)" },
    totalLabel: { en: "Total", vi: "Thành tiền" },
    placeOrder: { en: "Place Order", vi: "Đặt hàng" },
    requiredError: { en: "Please fill in all required fields.", vi: "Vui lòng điền đầy đủ thông tin bắt buộc." },
    successTitle: { en: "Order placed!", vi: "Đặt hàng thành công!" },
    successDesc: {
      en: "Your order has been successfully placed.",
      vi: "Đơn hàng của bạn đã được ghi nhận.",
    },
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.fullName || !formData.email || !formData.deliveryEmail) {
      toast({
        title: language === "vi" ? "Thiếu thông tin" : "Error",
        description: copy.requiredError[language],
        variant: "destructive",
      })
      return
    }

    toast({
      title: copy.successTitle[language],
      description: copy.successDesc[language],
    })

    router.push("/checkout/success")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {copy.backToCart[language]}
            </Link>
          </div>

          <h1 className="mb-8 text-3xl font-bold">{copy.checkout[language]}</h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{copy.contactInfo[language]}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">{copy.fullName[language]}</Label>
                      <Input
                        id="fullName"
                        placeholder={language === "vi" ? "Nguyễn Văn A" : "John Doe"}
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{copy.email[language]}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={language === "vi" ? "ban@example.com" : "john@example.com"}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{copy.deliveryTitle[language]}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="deliveryEmail">{copy.deliveryEmail[language]}</Label>
                      <Input
                        id="deliveryEmail"
                        type="email"
                        placeholder={language === "vi" ? "emailnhan@example.com" : "delivery@example.com"}
                        value={formData.deliveryEmail}
                        onChange={(e) => setFormData({ ...formData, deliveryEmail: e.target.value })}
                        required
                      />
                      <p className="mt-1 text-sm text-muted-foreground">{copy.deliveryHint[language]}</p>
                    </div>
                    <div>
                      <Label htmlFor="deliveryPassword">{copy.preferredPassword[language]}</Label>
                      <Input
                        id="deliveryPassword"
                        type="password"
                        placeholder={language === "vi" ? "Nhập mật khẩu mong muốn" : "Enter preferred password"}
                        value={formData.deliveryPassword}
                        onChange={(e) => setFormData({ ...formData, deliveryPassword: e.target.value })}
                      />
                      <p className="mt-1 text-sm text-muted-foreground">{copy.preferredHint[language]}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{copy.paymentMethodTitle[language]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex flex-1 cursor-pointer items-center gap-3">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{copy.card[language]}</p>
                            <p className="text-sm text-muted-foreground">{copy.cardDesc[language]}</p>
                          </div>
                        </Label>
                      </div>
                      <div className="mt-3 flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex flex-1 cursor-pointer items-center gap-3">
                          <Wallet className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{copy.paypal[language]}</p>
                            <p className="text-sm text-muted-foreground">{copy.paypalDesc[language]}</p>
                          </div>
                        </Label>
                      </div>
                      <div className="mt-3 flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="flex flex-1 cursor-pointer items-center gap-3">
                          <Building className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{copy.bank[language]}</p>
                            <p className="text-sm text-muted-foreground">{copy.bankDesc[language]}</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Button type="submit" size="lg" className="w-full">
                  {copy.placeOrder[language]} · {formatCurrency(total, { currency })}
                </Button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>{copy.summaryTitle[language]}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {checkoutItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name[language]}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium line-clamp-1">{item.name[language]}</p>
                          {item.variant && (
                            <p className="text-sm text-muted-foreground">{item.variant[language]}</p>
                          )}
                          <p className="text-sm font-semibold">
                            {formatCurrency(item.price[currency], { currency })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{copy.subtotal[language]}</span>
                      <span>{formatCurrency(subtotal, { currency })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{copy.taxLabel[language]}</span>
                      <span>{formatCurrency(tax, { currency })}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>{copy.totalLabel[language]}</span>
                    <span>{formatCurrency(total, { currency })}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
