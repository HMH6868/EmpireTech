"use client"

import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { useTranslations } from "@/hooks/useTranslations"

export function Footer() {
  const t = useTranslations("common")

  const sections = [
    {
      title: t("footer.sectionsProducts"),
      links: [
        { href: "/accounts", label: t("footer.linksAccounts") },
        { href: "/courses", label: t("footer.linksCourses") },
        { href: "/#popular", label: t("footer.linksPopular") },
      ],
    },
    {
      title: t("footer.sectionsSupport"),
      links: [
        { href: "/policies#contact", label: t("footer.linksContact") },
        { href: "/policies#terms", label: t("footer.linksTerms") },
        { href: "/policies#privacy", label: t("footer.linksPrivacy") },
        { href: "/policies#refund", label: t("footer.linksRefund") },
      ],
    },
    {
      title: t("footer.sectionsCompany"),
      links: [
        { href: "/about", label: t("footer.linksAbout") },
        { href: "/faq", label: t("footer.linksFaq") },
      ],
    },
  ] as const

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
            <span className="text-xl font-bold">{t("brand")}</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("tagline")}
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

          {sections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border/40 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {t("brand")}. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
