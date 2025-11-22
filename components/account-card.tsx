import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/use-locale';
import { useTranslations } from '@/hooks/useTranslations';
import Image from 'next/image';
import Link from 'next/link';

type Product = {
  id: string;
  slug: string;
  name_en: string;
  name_vi: string;
  image?: string;
  category_id?: string;
  inventory_status: 'in-stock' | 'low-stock' | 'out-of-stock';
  category?: {
    id: string;
    name_en: string;
    name_vi: string;
    slug: string;
  };
  variants?: Array<{
    id: string;
    price_usd: number;
    price_vnd: number;
    original_price_usd?: number;
    original_price_vnd?: number;
  }>;
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { locale, formatCurrency, currency } = useLanguage();
  const commonT = useTranslations('common');

  const productName = locale === 'vi' ? product.name_vi : product.name_en;
  const categoryLabel = product.category
    ? locale === 'vi'
      ? product.category.name_vi
      : product.category.name_en
    : null;

  // Find the variant with the lowest price to display "From X"
  const displayVariant =
    product.variants && product.variants.length > 0
      ? product.variants.reduce((prev, curr) => {
          const prevPrice = currency === 'vnd' ? prev.price_vnd : prev.price_usd;
          const currPrice = currency === 'vnd' ? curr.price_vnd : curr.price_usd;
          return prevPrice < currPrice ? prev : curr;
        })
      : null;

  const price = displayVariant
    ? currency === 'vnd'
      ? displayVariant.price_vnd
      : displayVariant.price_usd
    : 0;
  const originalPrice = displayVariant
    ? currency === 'vnd'
      ? displayVariant.original_price_vnd
      : displayVariant.original_price_usd
    : 0;

  // Calculate discount percentage
  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const statusKeyMap = {
    'in-stock': 'status.inStock',
    'low-stock': 'status.lowStock',
    'out-of-stock': 'status.outOfStock',
  } as const;

  const isOutOfStock = product.inventory_status === 'out-of-stock';

  return (
    <Link
      href={`/accounts/${product.slug}`}
      className={`group relative flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-3 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${
        isOutOfStock ? 'opacity-70' : ''
      }`}
    >
      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div className="absolute inset-0 z-10 rounded-xl bg-background/40 backdrop-blur-[1px]" />
      )}

      {/* Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted/20">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={productName}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badges */}
        <div className="absolute left-2 top-2 z-20 flex flex-col gap-1.5">
          {product.inventory_status !== 'in-stock' && (
            <Badge
              variant={product.inventory_status === 'out-of-stock' ? 'destructive' : 'secondary'}
              className="w-fit shadow-sm backdrop-blur-md"
            >
              {commonT(statusKeyMap[product.inventory_status])}
            </Badge>
          )}
          {categoryLabel && (
            <Badge
              variant="secondary"
              className="w-fit border-white/50 bg-blue-500/50 backdrop-blur-md hover:bg-blue-500/80 text-white"
            >
              {categoryLabel}
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5 px-1 pb-1">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
          {productName}
        </h3>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-lg font-bold text-foreground">
            {price > 0
              ? formatCurrency(price, { currency })
              : locale === 'vi'
              ? 'Liên hệ'
              : 'Contact'}
          </span>

          {!!originalPrice && originalPrice > price && (
            <>
              <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/70">
                {formatCurrency(originalPrice, { currency })}
              </span>
              <span className="rounded bg-[#E91E63] px-1.5 py-0.5 text-xs font-bold text-white">
                -{discountPercent}%
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
