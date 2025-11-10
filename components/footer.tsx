"use client"

import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"

export function Footer() {
  const { language } = useLanguage();
  const footerLinks = {
    products: [
      { label: { en: 'Accounts', vi: 'Tài khoản' }, href: '/accounts' },
      { label: { en: 'Courses', vi: 'Khóa học' }, href: '/courses' },
      { label: { en: 'Popular Items', vi: 'Sản phẩm nổi bật' }, href: '/#popular' },
    ],
    support: [
      { label: { en: 'Contact Us', vi: 'Liên hệ' }, href: '/policies#contact' },
      { label: { en: 'Terms of Service', vi: 'Điều khoản dịch vụ' }, href: '/policies#terms' },
      { label: { en: 'Privacy Policy', vi: 'Chính sách bảo mật' }, href: '/policies#privacy' },
      { label: { en: 'Refund Policy', vi: 'Chính sách hoàn tiền' }, href: '/policies#refund' },
    ],
    company: [
      { label: { en: 'About Us', vi: 'Về chúng tôi' }, href: '/about' },
      { label: { en: 'FAQ', vi: 'Câu hỏi thường gặp' }, href: '/faq' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-9 w-9">
                <Image src="/logo.png" alt="Empire Tech logo" fill className="object-contain" priority />
              </div>
              <span className="text-xl font-bold">Empire Tech</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {language === 'vi'
                ? 'Nền tảng uy tín cho tài khoản số và khóa học trực tuyến cao cấp.'
                : 'Your trusted platform for premium digital accounts and online courses.'}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{language === 'vi' ? 'Sản phẩm' : 'Products'}</h3>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label[language]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{language === 'vi' ? 'Hỗ trợ' : 'Support'}</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label[language]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">{language === 'vi' ? 'Công ty' : 'Company'}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label[language]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Empire Tech.{' '}
            {language === 'vi' ? 'Đã đăng ký bản quyền.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
