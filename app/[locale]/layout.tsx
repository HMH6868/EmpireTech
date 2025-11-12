import { LanguageProvider } from '@/components/language-provider';
import { i18nConfig, type Locale } from '@/i18nConfig';
import { getTranslations } from '@/lib/translations';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import type React from 'react';
import { metadataBase } from '../layout';

const inter = Inter({ subsets: ['latin'] });

const baseMetadata: Metadata = {
  title: 'Empire Tech - Premium Digital Accounts & Courses',
  description: 'Your trusted platform for premium digital accounts and online courses',
  icons: {
    icon: '/logo_fav.png',
  },
};

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
};

const isSupportedLocale = (locale: string): locale is Locale => i18nConfig.locales.includes(locale as Locale);

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Pick<LayoutProps, 'params'>): Promise<Metadata> {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const languages = Object.fromEntries(i18nConfig.locales.map((lng) => [lng, `/${lng}`]));
  const commonT = await getTranslations(locale, 'common');

  return {
    ...baseMetadata,
    title: commonT('seo.title'),
    description: commonT('seo.description'),
    metadataBase,
    alternates: {
      languages,
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        <LanguageProvider>
          {children}
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  );
}
