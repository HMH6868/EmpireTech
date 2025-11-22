'use client';

import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-locale';
import { useTranslations } from '@/hooks/useTranslations';
import { ArrowRight, BookOpen, Minus, Plus, ShoppingBag, Trash2, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type CartItem = {
  id: string;
  cart_id: string;
  item_id: string;
  item_type: 'account' | 'course';
  variant_id?: string;
  quantity: number;
  price_usd: number;
  price_vnd: number;
  created_at: string;
};

type ItemDetails = {
  id: string;
  name_en?: string;
  name_vi?: string;
  title_en?: string;
  title_vi?: string;
  slug: string;
  image?: string;
  thumbnail?: string;
  category?: {
    name_en: string;
    name_vi: string;
  };
  variant?: {
    name_en: string;
    name_vi: string;
  };
};

type CartItemWithDetails = CartItem & {
  details?: ItemDetails;
};

export default function CartPage() {
  const { locale, currency, formatCurrency } = useLanguage();
  const t = useTranslations('cart');
  const [cartItems, setCartItems] = useState<CartItemWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/cart');

      if (response.status === 401) {
        setCartItems([]);
        return;
      }

      const data = await response.json();

      if (data.items) {
        // Fetch details for each item
        const itemsWithDetails = await Promise.all(
          data.items.map(async (item: CartItem) => {
            try {
              let details: ItemDetails | undefined;

              if (item.item_type === 'account') {
                const accountRes = await fetch('/api/accounts');
                const accountData = await accountRes.json();
                const account = accountData.accounts?.find((a: any) => a.id === item.item_id);

                if (account) {
                  const variant = account.variants?.find((v: any) => v.id === item.variant_id);
                  // Use variant image if available, otherwise use account image
                  const displayImage = variant?.image || account.image;

                  details = {
                    id: account.id,
                    name_en: account.name_en,
                    name_vi: account.name_vi,
                    slug: account.slug,
                    image: displayImage,
                    category: account.category,
                    variant: variant
                      ? {
                          name_en: variant.name_en,
                          name_vi: variant.name_vi,
                        }
                      : undefined,
                  };
                }
              } else if (item.item_type === 'course') {
                const courseRes = await fetch('/api/courses');
                const courseData = await courseRes.json();
                const course = courseData.items?.find((c: any) => c.id === item.item_id);

                if (course) {
                  details = {
                    id: course.id,
                    title_en: course.title_en,
                    title_vi: course.title_vi,
                    slug: course.slug,
                    thumbnail: course.thumbnail,
                  };
                }
              }

              return { ...item, details };
            } catch (error) {
              console.error('Error fetching item details:', error);
              return item;
            }
          })
        );

        setCartItems(itemsWithDetails);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error(locale === 'vi' ? 'Không thể tải giỏ hàng' : 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        setCartItems((items) =>
          items.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
        );
      } else {
        toast.error(locale === 'vi' ? 'Không thể cập nhật' : 'Failed to update');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error(locale === 'vi' ? 'Có lỗi xảy ra' : 'An error occurred');
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCartItems((items) => items.filter((item) => item.id !== itemId));
        toast.success(locale === 'vi' ? 'Đã xóa khỏi giỏ hàng' : 'Removed from cart');
      } else {
        toast.error(locale === 'vi' ? 'Không thể xóa' : 'Failed to remove');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error(locale === 'vi' ? 'Có lỗi xảy ra' : 'An error occurred');
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = currency === 'vnd' ? item.price_vnd : item.price_usd;
    return sum + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center py-12">
          <p className="text-muted-foreground">{locale === 'vi' ? 'Đang tải...' : 'Loading...'}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">{t('empty.title')}</h2>
            <p className="mt-2 text-muted-foreground">{t('empty.subtitle')}</p>
            <Link href={`/${locale}/accounts`} className="mt-6 inline-block">
              <Button size="lg" className="gap-2">
                {t('empty.cta')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="border-b border-border/40 bg-muted/30 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              {t('pageTitle')}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {cartItems.length}{' '}
              {cartItems.length === 1 ? t('itemsCount.single') : t('itemsCount.plural')}
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const itemName =
                      locale === 'vi'
                        ? item.details?.name_vi || item.details?.title_vi || 'Unknown'
                        : item.details?.name_en || item.details?.title_en || 'Unknown';
                    const variantName = item.details?.variant
                      ? locale === 'vi'
                        ? item.details.variant.name_vi
                        : item.details.variant.name_en
                      : null;
                    const categoryName = item.details?.category
                      ? locale === 'vi'
                        ? item.details.category.name_vi
                        : item.details.category.name_en
                      : null;
                    const itemImage =
                      item.details?.image || item.details?.thumbnail || '/placeholder.svg';
                    const itemLink =
                      item.item_type === 'account'
                        ? `/${locale}/accounts/${item.details?.slug}`
                        : `/${locale}/courses/${item.details?.slug}`;

                    return (
                      <Card key={item.id} className="relative">
                        <Badge
                          variant={item.item_type === 'account' ? 'default' : 'secondary'}
                          className="absolute right-4 top-4 gap-1"
                        >
                          {item.item_type === 'account' ? (
                            <>
                              <User className="h-3 w-3" />
                              {locale === 'vi' ? 'Tài khoản' : 'Account'}
                            </>
                          ) : (
                            <>
                              <BookOpen className="h-3 w-3" />
                              {locale === 'vi' ? 'Khóa học' : 'Course'}
                            </>
                          )}
                        </Badge>
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col gap-4 sm:flex-row">
                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                              <Image src={itemImage} alt={itemName} fill className="object-cover" />
                            </div>

                            <div className="flex flex-1 flex-col justify-between">
                              <div>
                                <Link
                                  href={itemLink}
                                  className="font-semibold transition-colors hover:text-primary"
                                >
                                  {itemName}
                                </Link>
                                {variantName && (
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {variantName}
                                  </p>
                                )}
                                {categoryName && (
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {categoryName}
                                  </p>
                                )}
                              </div>

                              <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 bg-transparent"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center text-sm font-medium">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 bg-transparent"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>

                                <div className="flex items-center gap-4">
                                  <p className="text-lg font-bold">
                                    {formatCurrency(
                                      (currency === 'vnd' ? item.price_vnd : item.price_usd) *
                                        item.quantity,
                                      { currency }
                                    )}
                                  </p>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    onClick={() => removeItem(item.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-1">
                <Card className="sticky top-20">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold">{t('summary.title')}</h2>
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('summary.subtotal')}</span>
                        <span className="font-medium">
                          {formatCurrency(subtotal, { currency })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('summary.tax')}</span>
                        <span className="font-medium">{formatCurrency(tax, { currency })}</span>
                      </div>
                      <div className="border-t border-border pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold">{t('summary.total')}</span>
                          <span className="text-2xl font-bold">
                            {formatCurrency(total, { currency })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="lg" className="mt-6 w-full gap-2">
                      {t('summary.checkout')}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Link href={`/${locale}/accounts`} className="mt-3 block">
                      <Button variant="outline" size="lg" className="w-full bg-transparent">
                        {t('summary.continue')}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
