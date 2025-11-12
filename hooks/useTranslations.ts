"use client"

import { useMemo } from "react"

import { useLanguage } from "@/hooks/use-locale"
import { createTranslator, getTranslationDictionary, type Namespace, type Translator } from "@/lib/translations"

export function useTranslations(namespace: Namespace): Translator {
  const { locale } = useLanguage()

  return useMemo(() => createTranslator(getTranslationDictionary(locale, namespace)), [locale, namespace])
}
