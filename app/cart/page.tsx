"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { products, categories, type LocalizedText } from "@/lib/mock-data"
import { useLanguage } from "@/hooks/use-language"

const getLocalizedString = (value: LocalizedText | string, lang: "en" | "vi") =>
  typeof value === "string" ? value : value[lang] ?? ""

interface CartItem {
  product: (typeof products)[0]
  quantity: number
}

export default function CartPage() {
  const { language, currency, formatCurrency } = useLanguage()
  // Mock cart data
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: products[0], quantity: 1 },
    { product: products[1], quantity: 2 },
    { product: products[2], quantity: 1 },
  ])

  const updateQuantity = (productId: string, change: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.max(1, item.quantity + change) } : item,
      ),
    )
  }

  const removeItem = (productId: string) => {
    setCartItems((items) => items.filter((item) => item.product.id !== productId))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price[currency] * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">
              {language === "vi" ? "Giỏ hàng của bạn đang trống" : "Your cart is empty"}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {language === "vi" ? "Hãy thêm sản phẩm để bắt đầu mua sắm" : "Add some products to get started"}
            </p>
            <Link href="/accounts" className="mt-6 inline-block">
              <Button size="lg" className="gap-2">
                {language === "vi" ? "Xem sản phẩm" : "Browse Products"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-border/40 bg-muted/30 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Shopping Cart</h1>
            <p className="mt-2 text-muted-foreground">
              {cartItems.length}{" "}
              {language === "vi"
                ? cartItems.length === 1
                  ? "sản phẩm trong giỏ"
                  : "sản phẩm trong giỏ"
                : cartItems.length === 1
                  ? "item in your cart"
                  : "items in your cart"}
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <Card key={item.product.id}>
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row">
                          {/* Product Image */}
                          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={item.product.image || "/placeholder.svg"}
                              alt={getLocalizedString(item.product.name, language)}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Product Info */}
                            <div className="flex flex-1 flex-col justify-between">
                              <div>
                                <Link
                                  href={`/accounts/${item.product.slug}`}
                                  className="font-semibold transition-colors hover:text-primary"
                                >
                                  {item.product.name[language]}
                                </Link>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {categories.find((cat) => cat.id === item.product.categoryId)?.name[language]}
                                </p>
                              </div>

                            <div className="mt-4 flex items-center justify-between">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 bg-transparent"
                                  onClick={() => updateQuantity(item.product.id, -1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 bg-transparent"
                                  onClick={() => updateQuantity(item.product.id, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Price and Remove */}
                              <div className="flex items-center gap-4">
                                <p className="text-lg font-bold">
                                  {formatCurrency(item.product.price[currency] * item.quantity, { currency })}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => removeItem(item.product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold">
                      {language === "vi" ? "Tổng đơn hàng" : "Order Summary"}
                    </h2>
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {language === "vi" ? "Tạm tính" : "Subtotal"}
                        </span>
                        <span className="font-medium">{formatCurrency(subtotal, { currency })}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {language === "vi" ? "Thuế (10%)" : "Tax (10%)"}
                        </span>
                        <span className="font-medium">{formatCurrency(tax, { currency })}</span>
                      </div>
                      <div className="border-t border-border pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">{language === "vi" ? "Thành tiền" : "Total"}</span>
                          <span className="text-2xl font-bold">{formatCurrency(total, { currency })}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="lg" className="mt-6 w-full gap-2">
                      {language === "vi" ? "Tiến hành thanh toán" : "Proceed to Checkout"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Link href="/accounts" className="mt-3 block">
                      <Button variant="outline" size="lg" className="w-full bg-transparent">
                        {language === "vi" ? "Tiếp tục mua sắm" : "Continue Shopping"}
                      </Button>
                    </Link>
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
