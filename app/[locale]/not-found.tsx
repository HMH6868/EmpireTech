'use client';

import Link from 'next/link';

import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/useTranslations';

export default function NotFound() {
  const t = useTranslations('errors');

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">404</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('notFound.title')}</h1>
          <p className="text-muted-foreground max-w-md">{t('notFound.description')}</p>
          <div className="flex justify-center">
            <Link href="/">
              <Button className="mt-4">{t('notFound.cta')}</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
