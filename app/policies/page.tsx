"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export default function PoliciesPage() {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Mock form submission
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible.",
      })
      setName("")
      setEmail("")
      setMessage("")
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-border/40 bg-muted/30 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">Policies & Contact</h1>
            <p className="mt-3 text-pretty text-lg text-muted-foreground">Important information and how to reach us</p>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Policies Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Terms of Service */}
              <section id="terms">
                <h2 className="text-2xl font-bold">Terms of Service</h2>
                <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Welcome to Empire Tech. By accessing or using our platform, you agree to be bound by these Terms of
                    Service and all applicable laws and regulations.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground">Account Usage</h3>
                  <p>
                    All digital accounts sold on our platform are for personal use only. You agree not to share, resell,
                    or redistribute any purchased accounts. We reserve the right to terminate access to accounts that
                    violate these terms.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground">Intellectual Property</h3>
                  <p>
                    All content on Empire Tech, including text, graphics, logos, and software, is the property of Empire
                    Tech or its content suppliers and is protected by international copyright laws.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground">Limitation of Liability</h3>
                  <p>
                    Empire Tech shall not be liable for any indirect, incidental, special, consequential, or punitive
                    damages resulting from your use of or inability to use the service.
                  </p>
                </div>
              </section>

              {/* Privacy Policy */}
              <section id="privacy">
                <h2 className="text-2xl font-bold">Privacy Policy</h2>
                <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    At Empire Tech, we take your privacy seriously. This Privacy Policy explains how we collect, use,
                    disclose, and safeguard your information.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground">Information We Collect</h3>
                  <p>
                    We collect information that you provide directly to us, including your name, email address, payment
                    information, and any other information you choose to provide when using our services.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground">How We Use Your Information</h3>
                  <p>
                    We use the information we collect to provide, maintain, and improve our services, process
                    transactions, send you technical notices and support messages, and respond to your comments and
                    questions.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground">Data Security</h3>
                  <p>
                    We implement appropriate technical and organizational measures to protect the security of your
                    personal information. However, no electronic transmission over the internet is 100% secure.
                  </p>
                </div>
              </section>

              {/* Refund Policy */}
              <section id="refund">
                <h2 className="text-2xl font-bold">Refund Policy</h2>
                <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    We want you to be completely satisfied with your purchase. If you encounter any issues with your
                    digital account, please contact us immediately.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground">Refund Eligibility</h3>
                  <p>
                    Refunds are available within 24 hours of purchase if the account is not working as described. To be
                    eligible for a refund, you must provide proof of the issue and not have changed any account
                    credentials.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground">Refund Process</h3>
                  <p>
                    To request a refund, contact our support team with your order number and a description of the issue.
                    Approved refunds will be processed within 5-7 business days to your original payment method.
                  </p>
                  <h3 className="text-lg font-semibold text-foreground">Non-Refundable Items</h3>
                  <p>
                    Course enrollments and accounts that have been successfully accessed and used are not eligible for
                    refunds unless there is a verified technical issue on our end.
                  </p>
                </div>
              </section>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                <Card id="contact">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold">Contact Us</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Have questions? We're here to help</p>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="How can we help?"
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold">Get in Touch</h3>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">support@empiretech.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Address</p>
                          <p className="text-sm text-muted-foreground">123 Tech Street, Digital City</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
