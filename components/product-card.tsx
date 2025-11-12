import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/mock-data"
import { categories } from "@/lib/mock-data"
import { useLanguage } from "@/hooks/use-locale"
import { useTranslations } from "@/hooks/useTranslations"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { locale, formatCurrency } = useLanguage()
  const commonT = useTranslations("common")
  const productT = useTranslations("products")
  const categoryLabel = categories.find((category) => category.id === product.categoryId)?.name[locale]
  const statusKeyMap = {
    "in-stock": "status.inStock",
    "low-stock": "status.lowStock",
    "out-of-stock": "status.outOfStock",
  } as const

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/accounts/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name[locale]}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.inventoryStatus === "low-stock" && (
            <Badge className="absolute right-2 top-2" variant="destructive">
              {commonT(statusKeyMap["low-stock"])}
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/accounts/${product.slug}`}>
          <h3 className="line-clamp-2 text-balance font-semibold transition-colors group-hover:text-primary">
            {product.name[locale]}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">(128)</span>
        </div>
        {categoryLabel && <p className="mt-2 text-xs text-muted-foreground">{categoryLabel}</p>}
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div>
          <p className="text-2xl font-bold">{formatCurrency(product.price[locale === "vi" ? "vnd" : "usd"])}</p>
        </div>
        <Button size="sm" className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          {productT("productCard.addToCart")}
        </Button>
      </CardFooter>
    </Card>
  )
}
