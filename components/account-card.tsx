import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-locale';
import { useTranslations } from '@/hooks/useTranslations';
import { ShoppingCart } from 'lucide-react';
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
  }>;
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { locale, formatCurrency, currency } = useLanguage();
  const commonT = useTranslations('common');
  const productT = useTranslations('products');

  const productName = locale === 'vi' ? product.name_vi : product.name_en;
  const categoryLabel = product.category
    ? locale === 'vi'
      ? product.category.name_vi
      : product.category.name_en
    : null;

  // Lấy giá thấp nhất từ variants
  const minPrice =
    product.variants && product.variants.length > 0
      ? Math.min(...product.variants.map((v) => (currency === 'vnd' ? v.price_vnd : v.price_usd)))
      : 0;

  const statusKeyMap = {
    'in-stock': 'status.inStock',
    'low-stock': 'status.lowStock',
    'out-of-stock': 'status.outOfStock',
  } as const;

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/accounts/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image || '/placeholder.svg'}
            alt={productName}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.inventory_status === 'low-stock' && (
            <Badge className="absolute right-2 top-2" variant="destructive">
              {commonT(statusKeyMap['low-stock'])}
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/accounts/${product.slug}`}>
          <h3 className="line-clamp-2 text-balance font-semibold transition-colors group-hover:text-primary">
            {productName}
          </h3>
        </Link>
        {categoryLabel && <p className="mt-2 text-xs text-muted-foreground">{categoryLabel}</p>}
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div>
          <p className="text-2xl font-bold">
            {minPrice > 0 ? formatCurrency(minPrice, { currency }) : 'N/A'}
          </p>
        </div>
        <Button size="sm" className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          {productT('productCard.addToCart')}
        </Button>
      </CardFooter>
    </Card>
  );
}
