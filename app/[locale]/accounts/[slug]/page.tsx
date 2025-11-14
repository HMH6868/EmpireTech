'use client';

import type React from 'react';

import { ProductCard } from '@/components/account-card';
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
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/use-locale';
import { useToast } from '@/hooks/use-toast';
import { categories, comments, products } from '@/lib/mock-data';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageCircle,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function ProductDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const { locale, currency, formatCurrency } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [newComment, setNewComment] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const product = products.find((p) => p.slug === params.slug);
  const defaultVariant = product?.variants?.find((v) => v.isDefault) || product?.variants?.[0];
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const categoryLabel = product
    ? categories.find((cat) => cat.id === product.categoryId)?.name[locale]
    : '';

  const productReviews = reviews.filter(
    (r) => r.itemId === product?.id && r.itemType === 'product' && r.status === 'approved'
  );

  const productComments = comments.filter(
    (c) => c.itemId === product?.id && c.itemType === 'product' && c.status === 'approved'
  );

  const relatedProducts = products
    .filter((p) => p.categoryId === product?.categoryId && p.slug !== product?.slug)
    .slice(0, 4);

  const averageRating =
    productReviews.length > 0
      ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
      : '0.0';

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

  const priceKey = currency;
  const currentPrice = selectedVariant ? selectedVariant.price[priceKey] : product.price[priceKey];
  const currentOriginalPrice = selectedVariant?.originalPrice?.[priceKey];
  const currentSku = selectedVariant?.sku ?? `SKU-${product.id.toUpperCase()}`;
  const currentImage = selectedVariant?.image ?? product.image;
  const currentStock = selectedVariant
    ? selectedVariant.stock
      ? 'in-stock'
      : 'out-of-stock'
    : product.inventoryStatus;

  const galleryImages = product.images || [currentImage];

  const descriptionContent = product?.description[locale] ?? '';
  const markdownDescription = descriptionContent.includes('#')
    ? descriptionContent
    : `## ${locale === 'vi' ? 'Tài khoản chất lượng cao' : 'Premium Quality Account'}

${descriptionContent}

### ${locale === 'vi' ? 'Tính năng nổi bật' : 'Features'}:
- **${locale === 'vi' ? 'Giao ngay' : 'Instant Delivery'}**: ${
        locale === 'vi'
          ? 'Nhận thông tin đăng nhập ngay sau khi thanh toán'
          : 'Get your account credentials immediately after purchase'
      }
- **${locale === 'vi' ? 'Đã xác thực' : 'Verified Accounts'}**: ${
        locale === 'vi'
          ? 'Mọi tài khoản đều được kiểm tra kỹ trước khi giao'
          : 'All accounts are tested and verified before delivery'
      }
- **${locale === 'vi' ? 'Hỗ trợ 24/7' : '24/7 Support'}**: ${
        locale === 'vi'
          ? 'Đội ngũ hỗ trợ luôn sẵn sàng giải đáp'
          : 'Our support team is always available to help you'
      }
- **${locale === 'vi' ? 'Thanh toán an toàn' : 'Secure Payment'}**: ${
        locale === 'vi'
          ? 'Bảo mật chuẩn quốc tế cho mọi giao dịch'
          : 'We use industry-standard encryption for all transactions'
      }

### ${locale === 'vi' ? 'Vì sao chọn chúng tôi?' : 'Why Choose Us?'}

${
  locale === 'vi'
    ? 'Chúng tôi cung cấp tài khoản chính chủ với mức giá cạnh tranh cùng cam kết bảo hành rõ ràng.'
    : 'We provide the best quality digital accounts at competitive prices with a clear warranty policy.'
}

> *${
        locale === 'vi'
          ? 'Chất lượng đáng tin, dịch vụ tận tâm.'
          : '"Quality you can trust, service you can count on."'
      }`;

  const handleAddToCart = () => {
    const variantName = selectedVariant ? ` - ${selectedVariant.name[locale]}` : '';
    toast({
      title: locale === 'vi' ? 'Đã thêm vào giỏ' : 'Added to cart',
      description:
        locale === 'vi'
          ? `${product.name[locale]}${variantName} đã được thêm vào giỏ hàng.`
          : `${product.name[locale]}${variantName} has been added to your cart.`,
    });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: locale === 'vi' ? 'Đã gửi đánh giá!' : 'Review submitted!',
      description:
        locale === 'vi'
          ? 'Đánh giá của bạn đã được gửi và đang chờ duyệt.'
          : 'Your review has been submitted and is pending approval.',
    });
    setNewReview({ rating: 5, comment: '' });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: locale === 'vi' ? 'Đã gửi bình luận!' : 'Comment posted!',
      description:
        locale === 'vi'
          ? 'Bình luận của bạn đã được gửi và đang chờ duyệt.'
          : 'Your comment has been submitted and is pending approval.',
    });
    setNewComment('');
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
        {/* Product Details */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Product Image with Gallery */}
              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
                  <Image
                    src={currentImage || '/placeholder.svg'}
                    alt={product.name[locale]}
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
                            alt={`${product.name[locale]} ${idx + 1}`}
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
                                {product.name[locale]} -{' '}
                                {locale === 'vi' ? 'Bộ sưu tập' : 'Gallery'}
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
                                  alt={`${product.name[locale]} ${currentImageIndex + 1}`}
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
                                    alt={`${product.name[locale]} ${idx + 1}`}
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
                    {product.name[locale]}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {locale === 'vi' ? 'Mã SKU' : 'SKU'}: {currentSku}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span className="text-lg font-semibold">{averageRating}</span>
                    </div>
                    <span className="text-muted-foreground">
                      ({productReviews.length} {locale === 'vi' ? 'đánh giá' : 'reviews'})
                    </span>
                  </div>
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
                            <span className="font-semibold">{variant.name[locale]}</span>
                            <span className="text-xs">
                              {formatCurrency(variant.price[priceKey], { currency })}
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

                  {product.variants && product.variants.length > 1 && selectedVariant && (
                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <p className="mb-2 text-sm font-medium">
                          {locale === 'vi' ? 'Các gói khác:' : 'Other available variants:'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {product.variants
                            .filter((v) => v.id !== selectedVariant.id)
                            .map((variant) => (
                              <Badge
                                key={variant.id}
                                variant="secondary"
                                className="cursor-pointer"
                                onClick={() => setSelectedVariant(variant)}
                              >
                                {variant.name[locale]} -{' '}
                                {formatCurrency(variant.price[priceKey], { currency })}
                              </Badge>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
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
                              {product.deliveryType[locale]}
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
              <Card>
                <CardHeader>
                  <CardTitle>{locale === 'vi' ? 'Mô tả chi tiết' : 'Product Details'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarkdownRenderer content={markdownDescription} />
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {locale === 'vi' ? 'Đánh giá từ khách hàng' : 'Customer Reviews'} (
                      {productReviews.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-4xl font-bold">{averageRating}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-5 w-5 ${
                                    star <= Math.round(Number(averageRating))
                                      ? 'fill-primary text-primary'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {locale === 'vi'
                              ? `Dựa trên ${productReviews.length} đánh giá`
                              : `Based on ${productReviews.length} reviews`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <h3 className="mb-4 text-lg font-semibold">
                        {locale === 'vi' ? 'Viết đánh giá' : 'Write a Review'}
                      </h3>
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <Label>{locale === 'vi' ? 'Đánh giá' : 'Rating'}</Label>
                          <div className="mt-2 flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                className="transition-transform hover:scale-110"
                              >
                                <Star
                                  className={`h-6 w-6 ${
                                    star <= newReview.rating
                                      ? 'fill-primary text-primary'
                                      : 'text-muted-foreground'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="comment">
                            {locale === 'vi' ? 'Nội dung đánh giá' : 'Your Review'}
                          </Label>
                          <Textarea
                            id="comment"
                            placeholder={
                              locale === 'vi'
                                ? 'Chia sẻ trải nghiệm của bạn với sản phẩm này...'
                                : 'Share your experience with this product...'
                            }
                            value={newReview.comment}
                            onChange={(e) =>
                              setNewReview({ ...newReview, comment: e.target.value })
                            }
                            className="mt-2 min-h-[100px]"
                            required
                          />
                        </div>
                        <Button type="submit">
                          {locale === 'vi' ? 'Gửi đánh giá' : 'Submit Review'}
                        </Button>
                      </form>
                    </div>

                    <div className="space-y-4">
                      {productReviews.map((review) => (
                        <div key={review.id} className="rounded-lg border p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                                {review.userName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">{review.userName}</p>
                                <div className="mt-1 flex items-center gap-2">
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-4 w-4 ${
                                          star <= review.rating
                                            ? 'fill-primary text-primary'
                                            : 'text-muted-foreground'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {review.createdAt}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="mt-3 leading-relaxed text-muted-foreground">
                            {review.comment[locale]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {locale === 'vi' ? 'Câu hỏi & bình luận' : 'Questions & Comments'} (
                      {productComments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg border p-4">
                      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                        <MessageCircle className="h-5 w-5" />
                        {locale === 'vi' ? 'Đặt câu hỏi hoặc bình luận' : 'Post a Comment'}
                      </h3>
                      <form onSubmit={handleSubmitComment} className="space-y-4">
                        <Textarea
                          placeholder={
                            locale === 'vi'
                              ? 'Đặt câu hỏi hoặc chia sẻ cảm nhận của bạn...'
                              : 'Ask a question or share your thoughts...'
                          }
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="min-h-[100px]"
                          required
                        />
                        <Button type="submit">
                          {locale === 'vi' ? 'Gửi bình luận' : 'Post Comment'}
                        </Button>
                      </form>
                    </div>

                    <div className="space-y-4">
                      {productComments.map((comment) => (
                        <div key={comment.id} className="rounded-lg border p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                              {comment.userName.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{comment.userName}</p>
                                <span className="text-sm text-muted-foreground">
                                  {comment.createdAt}
                                </span>
                              </div>
                              <p className="mt-2 leading-relaxed text-muted-foreground">
                                {comment.comment[locale]}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
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
