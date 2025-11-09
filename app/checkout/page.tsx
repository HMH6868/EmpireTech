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
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    deliveryEmail: "",
    deliveryPassword: "",
  })

  // Mock cart items
  const cartItems = [
    {
      id: "1",
      name: "ChatGPT Plus Account",
      variant: "1 Month",
      price: 15.99,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: "2",
      name: "Canva Pro Account",
      price: 12.99,
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.fullName || !formData.email || !formData.deliveryEmail) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // Success
    toast({
      title: "Order placed!",
      description: "Your order has been successfully placed.",
    })

    // Redirect to success page
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
              Back to Cart
            </Link>
          </div>

          <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Delivery Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="deliveryEmail">Delivery Email *</Label>
                      <Input
                        id="deliveryEmail"
                        type="email"
                        placeholder="delivery@example.com"
                        value={formData.deliveryEmail}
                        onChange={(e) => setFormData({ ...formData, deliveryEmail: e.target.value })}
                        required
                      />
                      <p className="mt-1 text-sm text-muted-foreground">
                        Account credentials will be sent to this email
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="deliveryPassword">Preferred Password (Optional)</Label>
                      <Input
                        id="deliveryPassword"
                        type="password"
                        placeholder="Enter preferred password"
                        value={formData.deliveryPassword}
                        onChange={(e) => setFormData({ ...formData, deliveryPassword: e.target.value })}
                      />
                      <p className="mt-1 text-sm text-muted-foreground">
                        If provided, we'll try to set this as your account password
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex flex-1 cursor-pointer items-center gap-3">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Credit / Debit Card</p>
                            <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex flex-1 cursor-pointer items-center gap-3">
                          <Wallet className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">PayPal</p>
                            <p className="text-sm text-muted-foreground">Pay with your PayPal account</p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="flex flex-1 cursor-pointer items-center gap-3">
                          <Building className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Bank Transfer</p>
                            <p className="text-sm text-muted-foreground">Direct bank transfer</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Button type="submit" size="lg" className="w-full">
                  Place Order - ${total.toFixed(2)}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-muted">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium line-clamp-1">{item.name}</p>
                          {item.variant && <p className="text-sm text-muted-foreground">{item.variant}</p>}
                          <p className="text-sm font-semibold">${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
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
