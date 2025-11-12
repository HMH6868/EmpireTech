import { LanguageProvider } from '@/components/language-provider';
import { i18nConfig, type Locale } from '@/i18nConfig';
import { getTranslations } from '@/lib/translations';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import type React from 'react';
import { Suspense } from 'react';
import { metadataBase } from '../layout';

const inter = Inter({ subsets: ['latin'] });

const baseMetadata: Metadata = {
  title: 'Empire Tech - Premium Digital Accounts & Courses',
  description: 'Your trusted platform for premium digital accounts and online courses',
  icons: {
    icon: '/logo_fav.png',
  },
};

type LayoutParams = {
  locale: string;
};

type LayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<LayoutParams>;
}>;

const isSupportedLocale = (locale: string): locale is Locale =>
  i18nConfig.locales.includes(locale as Locale);

const resolveParams = async (params: LayoutProps['params']) => params;

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await resolveParams(params);

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const languages = Object.fromEntries(i18nConfig.locales.map((lng) => [lng, `/${lng}`]));
  const commonTranslator = await getTranslations(locale, 'common');

  return {
    ...baseMetadata,
    title: commonTranslator('seo.title'),
    description: commonTranslator('seo.description'),
    metadataBase,
    alternates: {
      languages,
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await resolveParams(params);

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} font-sans antialiased`}>
        <Suspense fallback={null}>
          <LanguageProvider>
            {children}
            <Analytics />
          </LanguageProvider>
        </Suspense>
      </body>
    </html>
  );
}
