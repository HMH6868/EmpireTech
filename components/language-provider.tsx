"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Language = "en" | "vi"
export type Currency = "usd" | "vnd"

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  currency: Currency
  formatCurrency: (value: number, options?: { currency?: Currency; maximumFractionDigits?: number }) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)
const STORAGE_KEY = "empiretech-language"

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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    if (typeof window === "undefined") return
    const persisted = window.localStorage.getItem(STORAGE_KEY) as Language | null
    if (persisted === "en" || persisted === "vi") {
      setLanguageState(persisted)
      document.documentElement.lang = persisted
      return
    }

    const browserLang = window.navigator.language.toLowerCase()
    if (browserLang.startsWith("vi")) {
      setLanguageState("vi")
      document.documentElement.lang = "vi"
    }
  }, [])

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage)
      document.documentElement.lang = nextLanguage
    }
  }

  const currency: Currency = language === "vi" ? "vnd" : "usd"

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
      language,
      setLanguage,
      currency,
      formatCurrency,
    }),
    [language, currency],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguageContext() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguageContext must be used within a LanguageProvider")
  }
  return context
}
