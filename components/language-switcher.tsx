"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-locale"
import { cn } from "@/lib/utils"

interface LanguageSwitcherProps {
  variant?: "inline" | "pill"
  size?: "sm" | "md"
  className?: string
}

const languages = [
  { code: "en" as const, label: "EN" },
  { code: "vi" as const, label: "VI" },
]

export function LanguageSwitcher({ variant = "pill", size = "md", className }: LanguageSwitcherProps) {
  const { locale, switchLocale } = useLanguage()

  if (variant === "inline") {
    return (
      <div className={className}>
        {languages.map((lang, index) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => switchLocale(lang.code)}
            className={cn(
              "text-xs font-semibold uppercase transition-colors",
              locale === lang.code ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {lang.label}
            {index === 0 && <span className="px-1 text-muted-foreground">/</span>}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border border-border bg-background p-1",
        size === "sm" ? "text-[11px]" : "text-xs",
        className,
      )}
    >
      {languages.map((lang) => (
        <Button
          key={lang.code}
          type="button"
          variant={locale === lang.code ? "default" : "ghost"}
          size="sm"
          className={cn(
            "h-7 rounded-full px-3 uppercase",
            locale === lang.code ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground",
          )}
          onClick={() => switchLocale(lang.code)}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  )
}
