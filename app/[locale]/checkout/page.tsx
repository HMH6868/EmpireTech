'use client';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-locale';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const { locale } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {locale === 'vi' ? 'Quay lại giỏ hàng' : 'Back to Cart'}
            </Link>
          </div>

          <h1 className="mb-8 text-3xl font-bold">{locale === 'vi' ? 'Thanh toán' : 'Checkout'}</h1>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <p className="mb-4 text-muted-foreground">
                {locale === 'vi' ? 'Giỏ hàng của bạn đang trống' : 'Your cart is empty'}
              </p>
              <Link href="/accounts">
                <Button>{locale === 'vi' ? 'Tiếp tục mua sắm' : 'Continue Shopping'}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
