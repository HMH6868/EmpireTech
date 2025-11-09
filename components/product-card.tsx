import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/mock-data"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/accounts/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.stock === "Low Stock" && (
            <Badge className="absolute right-2 top-2" variant="destructive">
              Low Stock
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/accounts/${product.slug}`}>
          <h3 className="line-clamp-2 text-balance font-semibold transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-1">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">(128)</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{product.category}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div>
          <p className="text-2xl font-bold">${product.price}</p>
        </div>
        <Button size="sm" className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          Add
        </Button>
      </CardFooter>
    </Card>
  )
}
