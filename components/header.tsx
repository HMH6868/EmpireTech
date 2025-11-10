"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ShoppingCart, Menu, User, LogIn, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/hooks/use-language"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [cartCount] = useState(3) // Mock cart count
  const [isLoggedIn] = useState(false) // Mock auth state
  const { language } = useLanguage()

  const navLinks = [
    { href: "/", label: { en: "Home", vi: "Trang chủ" } },
    { href: "/accounts", label: { en: "Accounts", vi: "Tài khoản" } },
    { href: "/courses", label: { en: "Courses", vi: "Khóa học" } },
    { href: "/promotions", label: { en: "Promotions", vi: "Khuyến mãi" } },
    { href: "/policies", label: { en: "Policies & Contact", vi: "Chính sách & Liên hệ" } },
  ]

  const promoCopy = {
    en: "Special Offer: Get 20% off your first purchase! Use code WELCOME20",
    vi: "Ưu đãi: Giảm 20% cho đơn đầu tiên! Nhập mã WELCOME20",
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="bg-primary/10 py-2 text-center">
        <Link href="/promotions" className="text-sm font-medium hover:underline">
          <Gift className="mr-1 inline-block h-4 w-4" />
          {promoCopy[language]}
        </Link>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-9 w-9">
              <Image src="/logo.png" alt="Empire Tech logo" fill className="object-contain" priority />
            </div>
            <span className="text-xl font-bold tracking-tight">Empire Tech</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label[language]}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <LanguageSwitcher size="sm" />
            </div>
            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">{cartCount}</Badge>
                )}
              </Button>
            </Link>

            {/* Auth */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/user/profile">
                      <User className="mr-2 h-4 w-4" />
                      {language === "vi" ? "Hồ sơ" : "Profile"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user/orders">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {language === "vi" ? "Đơn hàng" : "My Orders"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user/courses">
                      <User className="mr-2 h-4 w-4" />
                      {language === "vi" ? "Khoá học của tôi" : "My Courses"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    {language === "vi" ? "Đăng xuất" : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="hidden sm:block">
                <Button variant="default" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  {language === "vi" ? "Đăng nhập" : "Login"}
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-4 pt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label[language]}
                    </Link>
                  ))}
                  <div className="mt-2">
                    <LanguageSwitcher className="w-fit" />
                  </div>
                  <div className="mt-4 border-t pt-4">
                    {!isLoggedIn && (
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button className="w-full gap-2">
                          <LogIn className="h-4 w-4" />
                          {language === "vi" ? "Đăng nhập" : "Login"}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
