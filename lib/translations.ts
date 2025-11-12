import { defaultLocale, type Locale } from '@/i18nConfig';

import commonEn from '@/locales/en/common.json';
import homeEn from '@/locales/en/home.json';
import productsEn from '@/locales/en/products.json';
import cartEn from '@/locales/en/cart.json';
import authEn from '@/locales/en/auth.json';
import errorsEn from '@/locales/en/errors.json';

import commonVi from '@/locales/vi/common.json';
import homeVi from '@/locales/vi/home.json';
import productsVi from '@/locales/vi/products.json';
import cartVi from '@/locales/vi/cart.json';
import authVi from '@/locales/vi/auth.json';
import errorsVi from '@/locales/vi/errors.json';

export type Namespace = 'common' | 'home' | 'products' | 'cart' | 'auth' | 'errors';

type TranslationValue = string | TranslationTree;
interface TranslationTree {
  [key: string]: TranslationValue;
}

const translationStore: Record<Locale, Record<Namespace, TranslationTree>> = {
  en: {
    common: commonEn,
    home: homeEn,
    products: productsEn,
    cart: cartEn,
    auth: authEn,
    errors: errorsEn,
  },
  vi: {
    common: commonVi,
    home: homeVi,
    products: productsVi,
    cart: cartVi,
    auth: authVi,
    errors: errorsVi,
  },
};

const FALLBACK_LOCALE = defaultLocale;

const getDictionary = (locale: Locale, namespace: Namespace): TranslationTree => {
  return translationStore[locale]?.[namespace] ?? translationStore[FALLBACK_LOCALE][namespace];
};

const resolvePath = (tree: TranslationTree, path: string): TranslationValue | undefined => {
  return path.split('.').reduce<TranslationValue | undefined>((acc, segment) => {
    if (acc === undefined || acc === null) {
      return undefined;
    }
    if (typeof acc === 'string') {
      return acc;
    }
    return acc[segment];
  }, tree);
};

export type Translator = (key: string, options?: { defaultValue?: string }) => string;

export const createTranslator = (tree: TranslationTree): Translator => {
  return (key, options) => {
    const value = resolvePath(tree, key);
    if (typeof value === 'string') {
      return value;
    }
    return options?.defaultValue ?? key;
  };
};

export const getTranslationDictionary = (locale: Locale, namespace: Namespace): TranslationTree =>
  getDictionary(locale, namespace);

export async function getTranslations(locale: Locale, namespace: Namespace): Promise<Translator> {
  return createTranslator(getDictionary(locale, namespace));
}
