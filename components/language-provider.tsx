"use client"

import { LOCALE_COOKIE, defaultLocale, i18nConfig, type Locale } from "@/i18nConfig"
import { createContext, useContext, useMemo } from "react"
import type React from "react"
import { usePathname, useParams, useRouter, useSearchParams } from "next/navigation"

export type Currency = "usd" | "vnd"

interface LanguageContextValue {
  locale: Locale
  switchLocale: (locale: Locale) => void
  currency: Currency
  formatCurrency: (value: number, options?: { currency?: Currency; maximumFractionDigits?: number }) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const formatters: Record<Currency, Intl.NumberFormat> = {
  usd: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
  vnd: new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }),
}

const isLocale = (value: string | undefined): value is Locale =>
  Boolean(value && i18nConfig.locales.includes(value as Locale))

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const params = useParams<{ locale?: string }>()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const locale: Locale = isLocale(params?.locale) ? (params.locale as Locale) : defaultLocale

  const switchLocale = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      return
    }

    document.cookie = `${LOCALE_COOKIE}=${nextLocale}; path=/; max-age=${60 * 60 * 24 * 365}`
    document.documentElement.lang = nextLocale

    const currentPath = typeof window !== "undefined" && window.location?.pathname ? window.location.pathname : pathname

    if (!currentPath) {
      router.push(`/${nextLocale}`)
      return
    }

    const segments = currentPath.split("/").filter(Boolean)

    if (segments.length === 0) {
      router.push(`/${nextLocale}`)
      return
    }

    segments[0] = nextLocale
    const updatedPath = `/${segments.join("/")}`

    const query = searchParams?.toString()
    const nextPath = updatedPath || `/${nextLocale}`

    router.push(query ? `${nextPath}?${query}` : nextPath)
  }

  const currency: Currency = locale === "vi" ? "vnd" : "usd"

  const formatCurrency = (value: number, options?: { currency?: Currency; maximumFractionDigits?: number }) => {
    const currencyToUse = options?.currency ?? currency
    const formatter = formatters[currencyToUse]
    if (!formatter) return value.toString()

    const formatted = formatter.format(value)
    if (currencyToUse === "vnd") {
      return formatted.replace(/\s?₫/, "₫")
    }
    if (typeof options?.maximumFractionDigits === "number") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: options.maximumFractionDigits,
        minimumFractionDigits: options.maximumFractionDigits,
      }).format(value)
    }
    return formatted
  }

  const value = useMemo(
    () => ({
      locale,
      switchLocale,
      currency,
      formatCurrency,
    }),
    [locale, currency],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
