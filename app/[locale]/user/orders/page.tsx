'use client';

import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-locale';
import { Package } from 'lucide-react';
import Link from 'next/link';

export default function UserOrdersPage() {
  const { locale } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              {locale === 'vi' ? 'Đơn hàng của tôi' : 'My Orders'}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {locale === 'vi'
                ? 'Theo dõi lịch sử mua hàng của bạn'
                : 'View and manage your purchase history'}
            </p>
          </div>

          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                {locale === 'vi' ? 'Không có đơn hàng' : 'No orders found'}
              </h3>
              <p className="mb-4 text-muted-foreground">
                {locale === 'vi'
                  ? 'Bạn chưa có đơn hàng nào.'
                  : "You haven't placed any orders yet."}
              </p>
              <Link href="/accounts">
                <Button>{locale === 'vi' ? 'Bắt đầu mua sắm' : 'Start Shopping'}</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
