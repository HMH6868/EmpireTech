'use client';

import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/hooks/use-locale';
import { useTranslations } from '@/hooks/useTranslations';
import { Calendar, Copy, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Promotion = {
  id: string;
  code: string;
  name_en: string;
  name_vi: string;
  description_en?: string;
  description_vi?: string;
  discount_percent: number;
  max_discount_amount?: number;
  minimum_order_amount?: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'scheduled';
  usage_limit?: number;
  used_count: number;
  created_at: string;
};

export default function PromotionsPage() {
  const { locale } = useLanguage();
  const t = useTranslations('promotions');
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await fetch('/api/promotions');
      const data = await response.json();
      if (data.promotions) {
        setPromotions(data.promotions);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const activePromotions = promotions.filter((p) => p.status === 'active');
  const upcomingPromotions = promotions.filter((p) => p.status === 'scheduled');

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(t('toastCopied').replace('{code}', code));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">{t('loading')}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="border-b border-border/40 bg-muted/30 py-5 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-balance text-xl font-bold tracking-tight sm:text-2xl">
              {t('title')}
            </h1>
            <p className="mt-1 text-pretty text-base text-muted-foreground">{t('description')}</p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">{t('activeTitle')}</h2>
            </div>

            {activePromotions.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">{t('noActive')}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {activePromotions.map((promo) => (
                  <Card
                    key={promo.id}
                    className="group relative overflow-hidden transition-all hover:shadow-lg"
                  >
                    <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-primary/10" />
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Badge variant="default" className="mb-2">
                            {promo.discount_percent}% OFF
                          </Badge>
                          <CardTitle className="text-xl">
                            {locale === 'vi' ? promo.name_vi : promo.name_en}
                          </CardTitle>
                          {(locale === 'vi' ? promo.description_vi : promo.description_en) && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {locale === 'vi' ? promo.description_vi : promo.description_en}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-4">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                          {t('promoCodeLabel')}
                        </p>
                        <div className="flex items-center justify-between">
                          <code className="text-2xl font-bold tracking-wider">{promo.code}</code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCopyCode(promo.code)}
                            className="ml-2"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {t('validLabel')}: {formatDate(promo.start_date)} →{' '}
                            {formatDate(promo.end_date)}
                          </span>
                        </div>
                        {promo.max_discount_amount && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{t('maxDiscountLabel')}:</span>
                            <span className="font-medium">
                              {promo.max_discount_amount.toLocaleString()} VND
                            </span>
                          </div>
                        )}
                        {promo.minimum_order_amount && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{t('minOrderLabel')}:</span>
                            <span className="font-medium">
                              {promo.minimum_order_amount.toLocaleString()} VND
                            </span>
                          </div>
                        )}
                        {promo.usage_limit && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{t('usageLabel')}:</span>
                            <span className="font-medium">
                              {promo.used_count} / {promo.usage_limit}
                            </span>
                          </div>
                        )}
                      </div>

                      <Separator />

                      <Button className="w-full" onClick={() => handleCopyCode(promo.code)}>
                        {t('copyButton')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {upcomingPromotions.length > 0 && (
          <section className="border-t border-border/40 bg-muted/30 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold">{t('upcomingTitle')}</h2>
                <p className="mt-2 text-muted-foreground">{t('upcomingSubtitle')}</p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {upcomingPromotions.map((promo) => (
                  <Card key={promo.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted">
                          <Calendar className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <Badge variant="outline">{promo.discount_percent}% OFF</Badge>
                            <Badge variant="secondary">{t('upcomingBadge')}</Badge>
                          </div>
                          <h3 className="mb-1 font-semibold">
                            {locale === 'vi' ? promo.name_vi : promo.name_en}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t('startsOn')} {formatDate(promo.start_date)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-t border-border/40 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center text-2xl font-bold">{t('howToTitle')}</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {['copy', 'add', 'apply'].map((step, index) => (
                  <Card key={step}>
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                        {index + 1}
                      </div>
                      <h3 className="mb-2 font-semibold">{t(`steps.${step}Title`)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t(`steps.${step}Description`)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
