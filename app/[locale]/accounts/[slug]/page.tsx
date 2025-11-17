'use client';

import { ProductCard } from '@/components/account-card';
import { CommentSection } from '@/components/comment-section';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { MarkdownRenderer } from '@/components/markdown-renderer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/use-locale';
import { Check, ChevronLeft, ChevronRight, Clock, Shield, ShoppingCart, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Account = {
  id: string;
  slug: string;
  name_en: string;
  name_vi: string;
  description_en?: string;
  description_vi?: string;
  image?: string;
  category_id?: string;
  inventory_status: 'in-stock' | 'low-stock' | 'out-of-stock';
  delivery_type_en?: string;
  delivery_type_vi?: string;
  category?: {
    id: string;
    name_en: string;
    name_vi: string;
    slug: string;
  };
  images?: Array<{
    id: string;
    image_url: string;
    order_index: number;
  }>;
  variants?: Array<{
    id: string;
    name_en: string;
    name_vi: string;
    price_usd: number;
    price_vnd: number;
    original_price_usd?: number;
    original_price_vnd?: number;
    sku: string;
    image?: string;
    stock: boolean;
    is_default: boolean;
  }>;
};

export default function ProductDetailPage() {
  const params = useParams();
  const { locale, currency, formatCurrency } = useLanguage();
  const [product, setProduct] = useState<Account | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  const defaultVariant = product?.variants?.find((v) => v.is_default) || product?.variants?.[0];
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);

  useEffect(() => {
    if (product?.variants) {
      const def = product.variants.find((v) => v.is_default) || product.variants[0];
      setSelectedVariant(def);
    }
  }, [product]);

  useEffect(() => {
    fetchProduct();
    fetchCurrentUser();
  }, [params.slug]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setCurrentUserId(data.profile?.id);
      }
    } catch (error) {
      // User not logged in
    }
  };

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedVariant]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/accounts');
      const data = await response.json();

      if (data.accounts) {
        const foundProduct = data.accounts.find((p: Account) => p.slug === params.slug);
        setProduct(foundProduct || null);

        if (foundProduct) {
          // Fetch related products
          const related = data.accounts
            .filter(
              (p: Account) =>
                p.category_id === foundProduct.category_id && p.slug !== foundProduct.slug
            )
            .slice(0, 4);
          setRelatedProducts(related);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{locale === 'vi' ? 'Đang tải...' : 'Loading...'}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">
              {locale === 'vi' ? 'Không tìm thấy sản phẩm' : 'Product not found'}
            </h1>
            <Link href="/accounts" className="mt-4 inline-block">
              <Button>{locale === 'vi' ? 'Quay lại danh sách' : 'Back to Accounts'}</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const productName = locale === 'vi' ? product.name_vi : product.name_en;
  const categoryLabel = product.category
    ? locale === 'vi'
      ? product.category.name_vi
      : product.category.name_en
    : '';

  const priceKey = currency;
  const currentPrice = selectedVariant
    ? priceKey === 'vnd'
      ? selectedVariant.price_vnd
      : selectedVariant.price_usd
    : 0;
  const currentOriginalPrice = selectedVariant
    ? priceKey === 'vnd'
      ? selectedVariant.original_price_vnd
      : selectedVariant.original_price_usd
    : undefined;
  const currentSku = selectedVariant?.sku ?? `SKU-${product.id.toUpperCase()}`;
  const currentStock = selectedVariant
    ? selectedVariant.stock
      ? 'in-stock'
      : 'out-of-stock'
    : product.inventory_status;

  // Xây dựng gallery: Nếu variant có ảnh, đặt ảnh variant lên đầu
  const variantImage = selectedVariant?.image;
  const productGalleryImages =
    product.images && product.images.length > 0
      ? product.images.sort((a, b) => a.order_index - b.order_index).map((img) => img.image_url)
      : product.image
      ? [product.image]
      : ['/placeholder.svg'];

  // Nếu variant có ảnh riêng, đặt lên đầu gallery
  const galleryImages = variantImage
    ? [variantImage, ...productGalleryImages.filter((img) => img !== variantImage)]
    : productGalleryImages;

  const descriptionContent =
    (locale === 'vi' ? product.description_vi : product.description_en) || '';

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error(locale === 'vi' ? 'Vui lòng chọn gói' : 'Please select a variant');
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_id: product.id,
          item_type: 'account',
          variant_id: selectedVariant.id,
          price_usd: selectedVariant.price_usd,
          price_vnd: selectedVariant.price_vnd,
          quantity: 1,
        }),
      });

      if (response.ok) {
        const variantName = locale === 'vi' ? selectedVariant.name_vi : selectedVariant.name_en;
        toast.success(
          locale === 'vi'
            ? `${productName} - ${variantName} đã được thêm vào giỏ hàng.`
            : `${productName} - ${variantName} has been added to your cart.`
        );
      } else {
        const error = await response.json();
        if (response.status === 401) {
          toast.error(
            locale === 'vi'
              ? 'Vui lòng đăng nhập để thêm vào giỏ hàng'
              : 'Please login to add to cart'
          );
        } else {
          toast.error(error.error || 'Failed to add to cart');
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(locale === 'vi' ? 'Có lỗi xảy ra' : 'An error occurred');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Product Image with Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={galleryImages[currentImageIndex] || '/placeholder.svg'}
                    alt={productName}
                    fill
                    className="object-cover"
                  />
                </div>
                {galleryImages.length > 1 && (
                  <div className="flex items-center gap-2">
                    <div className="grid flex-1 grid-cols-4 gap-2">
                      {galleryImages.slice(0, 3).map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                            currentImageIndex === idx ? 'border-primary' : 'border-transparent'
                          }`}
                        >
                          <Image
                            src={img || '/placeholder.svg'}
                            alt={`${productName} ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                      {galleryImages.length > 3 && (
                        <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                          <DialogTrigger asChild>
                            <button className="relative aspect-square overflow-hidden rounded-lg border-2 border-transparent bg-muted/50 transition-all hover:border-primary">
                              <div className="flex h-full items-center justify-center text-sm font-medium">
                                +{galleryImages.length - 3} {locale === 'vi' ? 'ảnh' : 'more'}
                              </div>
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>
                                {productName} - {locale === 'vi' ? 'Bộ sưu tập' : 'Gallery'}
                              </DialogTitle>
                              <DialogDescription>
                                {locale === 'vi'
                                  ? 'Xem toàn bộ hình ảnh sản phẩm'
                                  : 'View all product images'}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="relative">
                              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                                <Image
                                  src={galleryImages[currentImageIndex] || '/placeholder.svg'}
                                  alt={`${productName} ${currentImageIndex + 1}`}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <Button
                                variant="outline"
                                size="icon"
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                                onClick={prevImage}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                                onClick={nextImage}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-6 gap-2">
                              {galleryImages.map((img, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentImageIndex(idx)}
                                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                                    currentImageIndex === idx
                                      ? 'border-primary'
                                      : 'border-transparent'
                                  }`}
                                >
                                  <Image
                                    src={img || '/placeholder.svg'}
                                    alt={`${productName} ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <div>
                  {categoryLabel && (
                    <Badge variant="secondary" className="mb-3">
                      {categoryLabel}
                    </Badge>
                  )}
                  <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
                    {productName}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {locale === 'vi' ? 'Mã SKU' : 'SKU'}: {currentSku}
                  </p>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-baseline gap-3">
                    {currentOriginalPrice && (
                      <p className="text-xl text-muted-foreground line-through">
                        {formatCurrency(currentOriginalPrice, { currency })}
                      </p>
                    )}
                    <p className="text-4xl font-bold">
                      {formatCurrency(currentPrice, { currency })}
                    </p>
                    {currentOriginalPrice && (
                      <Badge variant="destructive" className="text-xs">
                        {Math.round(
                          ((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100
                        )}
                        %{locale === 'vi' ? ' GIẢM' : ' OFF'}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {currentStock === 'in-stock' && (
                      <Badge variant="outline" className="gap-1">
                        <Check className="h-3 w-3" />
                        {locale === 'vi' ? 'Còn hàng' : 'In Stock'}
                      </Badge>
                    )}
                    {currentStock === 'low-stock' && (
                      <Badge variant="destructive">
                        {locale === 'vi' ? 'Sắp hết' : 'Low Stock'}
                      </Badge>
                    )}
                    {currentStock === 'out-of-stock' && (
                      <Badge variant="secondary">
                        {locale === 'vi' ? 'Hết hàng' : 'Out of Stock'}
                      </Badge>
                    )}
                  </div>

                  {product.variants && product.variants.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-base">
                        {locale === 'vi' ? 'Chọn gói' : 'Select Variant'}
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((variant) => (
                          <Button
                            key={variant.id}
                            variant={selectedVariant?.id === variant.id ? 'default' : 'outline'}
                            className="h-auto flex-col items-start gap-1 px-4 py-3"
                            onClick={() => setSelectedVariant(variant)}
                            disabled={!variant.stock}
                          >
                            <span className="font-semibold">
                              {locale === 'vi' ? variant.name_vi : variant.name_en}
                            </span>
                            <span className="text-xs">
                              {formatCurrency(
                                priceKey === 'vnd' ? variant.price_vnd : variant.price_usd,
                                { currency }
                              )}
                            </span>
                            {!variant.stock && (
                              <span className="text-xs text-muted-foreground">
                                {locale === 'vi' ? '(Hết hàng)' : '(Out of stock)'}
                              </span>
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <Truck className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {locale === 'vi' ? 'Hình thức giao' : 'Delivery'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {locale === 'vi'
                                ? product.delivery_type_vi
                                : product.delivery_type_en}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {locale === 'vi' ? 'Cam kết chính chủ' : 'Verified & Secure'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {locale === 'vi' ? '100% chính hãng' : '100% Authentic'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {locale === 'vi' ? 'Hỗ trợ' : 'Support'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {locale === 'vi' ? 'Luôn sẵn sàng 24/7' : '24/7 Available'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      size="lg"
                      className="flex-1 gap-2"
                      onClick={handleAddToCart}
                      disabled={currentStock === 'out-of-stock'}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {currentStock === 'out-of-stock'
                        ? locale === 'vi'
                          ? 'Hết hàng'
                          : 'Out of Stock'
                        : locale === 'vi'
                        ? 'Thêm vào giỏ'
                        : 'Add to Cart'}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      disabled={currentStock === 'out-of-stock'}
                    >
                      {locale === 'vi' ? 'Mua ngay' : 'Buy Now'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 space-y-8">
              {/* Description */}
              {descriptionContent && (
                <Card>
                  <CardHeader>
                    <CardTitle>{locale === 'vi' ? 'Mô tả chi tiết' : 'Product Details'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MarkdownRenderer content={descriptionContent} />
                  </CardContent>
                </Card>
              )}

              {/* Comments Section */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {locale === 'vi' ? 'Câu hỏi & bình luận' : 'Questions & Comments'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CommentSection
                    itemId={product.id}
                    itemType="account"
                    currentUserId={currentUserId}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-border/40 bg-muted/30 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="mb-8 text-balance text-2xl font-bold tracking-tight sm:text-3xl">
                {locale === 'vi' ? 'Sản phẩm liên quan' : 'Related Products'}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
