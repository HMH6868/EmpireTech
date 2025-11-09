"use client"

import type React from "react"

import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingCart, Check, Truck, Shield, Clock, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { products, reviews, comments } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ProductDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })
  const [newComment, setNewComment] = useState("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const product = products.find((p) => p.slug === params.slug)
  const defaultVariant = product?.variants?.find((v) => v.isDefault) || product?.variants?.[0]
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant)

  const productReviews = reviews.filter(
    (r) => r.itemId === product?.id && r.itemType === "product" && r.status === "approved",
  )

  const productComments = comments.filter(
    (c) => c.itemId === product?.id && c.itemType === "product" && c.status === "approved",
  )

  const relatedProducts = products
    .filter((p) => p.category === product?.category && p.slug !== product?.slug)
    .slice(0, 4)

  const averageRating =
    productReviews.length > 0
      ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
      : "0.0"

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Product not found</h1>
            <Link href="/accounts" className="mt-4 inline-block">
              <Button>Back to Accounts</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const currentPrice = selectedVariant?.price ?? product.price
  const currentOriginalPrice = selectedVariant?.originalPrice
  const currentSku = selectedVariant?.sku ?? `SKU-${product.id.toUpperCase()}`
  const currentImage = selectedVariant?.image ?? product.image
  const currentStock = selectedVariant ? (selectedVariant.stock ? "In Stock" : "Out of Stock") : product.stock

  const galleryImages = product.images || [currentImage]

  const markdownDescription = product.description.includes("#")
    ? product.description
    : `## Premium Quality Account

${product.description}

### Features:
- **Instant Delivery**: Get your account credentials immediately after purchase
- **Verified Accounts**: All accounts are tested and verified before delivery
- **24/7 Support**: Our support team is always available to help you
- **Secure Payment**: We use industry-standard encryption for all transactions

### Why Choose Us?

We provide the best quality digital accounts at competitive prices. Our accounts are sourced from trusted providers and come with a satisfaction guarantee.

> *"Quality you can trust, service you can count on."`

  const handleAddToCart = () => {
    const variantName = selectedVariant ? ` - ${selectedVariant.name}` : ""
    toast({
      title: "Added to cart",
      description: `${product.name}${variantName} has been added to your cart.`,
    })
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Review submitted!",
      description: "Your review has been submitted and is pending approval.",
    })
    setNewReview({ rating: 5, comment: "" })
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Comment posted!",
      description: "Your comment has been submitted and is pending approval.",
    })
    setNewComment("")
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

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
                  <Image src={currentImage || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
                {galleryImages.length > 1 && (
                  <div className="flex items-center gap-2">
                    <div className="grid flex-1 grid-cols-4 gap-2">
                      {galleryImages.slice(0, 3).map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                            currentImageIndex === idx ? "border-primary" : "border-transparent"
                          }`}
                        >
                          <Image
                            src={img || "/placeholder.svg"}
                            alt={`${product.name} ${idx + 1}`}
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
                                +{galleryImages.length - 3} more
                              </div>
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>{product.name} - Gallery</DialogTitle>
                              <DialogDescription>View all product images</DialogDescription>
                            </DialogHeader>
                            <div className="relative">
                              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                                <Image
                                  src={galleryImages[currentImageIndex] || "/placeholder.svg"}
                                  alt={`${product.name} ${currentImageIndex + 1}`}
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
                                    currentImageIndex === idx ? "border-primary" : "border-transparent"
                                  }`}
                                >
                                  <Image
                                    src={img || "/placeholder.svg"}
                                    alt={`${product.name} ${idx + 1}`}
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
                  <Badge variant="secondary" className="mb-3">
                    {product.category}
                  </Badge>
                  <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
                  <p className="mt-2 text-sm text-muted-foreground">SKU: {currentSku}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span className="text-lg font-semibold">{averageRating}</span>
                    </div>
                    <span className="text-muted-foreground">({productReviews.length} reviews)</span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-baseline gap-3">
                    {currentOriginalPrice && (
                      <p className="text-xl text-muted-foreground line-through">
                        ${currentOriginalPrice.toLocaleString()}
                      </p>
                    )}
                    <p className="text-4xl font-bold">${currentPrice.toLocaleString()}</p>
                    {currentOriginalPrice && (
                      <Badge variant="destructive" className="text-xs">
                        {Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {currentStock === "In Stock" && (
                      <Badge variant="outline" className="gap-1">
                        <Check className="h-3 w-3" />
                        In Stock
                      </Badge>
                    )}
                    {currentStock === "Low Stock" && <Badge variant="destructive">Low Stock</Badge>}
                    {currentStock === "Out of Stock" && <Badge variant="secondary">Out of Stock</Badge>}
                  </div>

                  {product.variants && product.variants.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-base">Select Variant:</Label>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((variant) => (
                          <Button
                            key={variant.id}
                            variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                            className="h-auto flex-col items-start gap-1 px-4 py-3"
                            onClick={() => setSelectedVariant(variant)}
                            disabled={!variant.stock}
                          >
                            <span className="font-semibold">{variant.name}</span>
                            <span className="text-xs">${variant.price.toLocaleString()}</span>
                            {!variant.stock && <span className="text-xs text-muted-foreground">(Out of stock)</span>}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.variants && product.variants.length > 1 && selectedVariant && (
                    <Card className="bg-muted/30">
                      <CardContent className="p-4">
                        <p className="mb-2 text-sm font-medium">Other available variants:</p>
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
                                {variant.name} - ${variant.price.toLocaleString()}
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
                            <p className="text-sm font-medium">Delivery</p>
                            <p className="text-sm text-muted-foreground">{product.deliveryType}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Verified & Secure</p>
                            <p className="text-sm text-muted-foreground">100% Authentic</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Support</p>
                            <p className="text-sm text-muted-foreground">24/7 Available</p>
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
                      disabled={currentStock === "Out of Stock"}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      {currentStock === "Out of Stock" ? "Out of Stock" : "Add to Cart"}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      disabled={currentStock === "Out of Stock"}
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full max-w-lg grid-cols-3">
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({productReviews.length})</TabsTrigger>
                  <TabsTrigger value="comments">Comments ({productComments.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-6">
                  <Card>
                    <CardContent className="p-6">
                      <MarkdownRenderer content={markdownDescription} />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="reviews" className="mt-6">
                  <div className="space-y-6">
                    {/* Rating Summary */}
                    <Card>
                      <CardContent className="p-6">
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
                                        ? "fill-primary text-primary"
                                        : "text-muted-foreground"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Based on {productReviews.length} reviews
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Review Form */}
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="mb-4 text-lg font-semibold">Write a Review</h3>
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                          <div>
                            <Label>Rating</Label>
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
                                      star <= newReview.rating ? "fill-primary text-primary" : "text-muted-foreground"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="comment">Your Review</Label>
                            <Textarea
                              id="comment"
                              placeholder="Share your experience with this product..."
                              value={newReview.comment}
                              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                              className="mt-2 min-h-[100px]"
                              required
                            />
                          </div>
                          <Button type="submit">Submit Review</Button>
                        </form>
                      </CardContent>
                    </Card>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {productReviews.map((review) => (
                        <Card key={review.id}>
                          <CardContent className="p-6">
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
                                              ? "fill-primary text-primary"
                                              : "text-muted-foreground"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-muted-foreground">{review.createdAt}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="mt-3 leading-relaxed text-muted-foreground">{review.comment}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="comments" className="mt-6">
                  <div className="space-y-6">
                    {/* Comment Form */}
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                          <MessageCircle className="h-5 w-5" />
                          Post a Comment
                        </h3>
                        <form onSubmit={handleSubmitComment} className="space-y-4">
                          <div>
                            <Textarea
                              placeholder="Ask a question or share your thoughts..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="min-h-[100px]"
                              required
                            />
                          </div>
                          <Button type="submit">Post Comment</Button>
                        </form>
                      </CardContent>
                    </Card>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {productComments.map((comment) => (
                        <Card key={comment.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                                {comment.userName.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{comment.userName}</p>
                                  <span className="text-sm text-muted-foreground">{comment.createdAt}</span>
                                </div>
                                <p className="mt-2 leading-relaxed text-muted-foreground">{comment.comment}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-border/40 bg-muted/30 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="mb-8 text-balance text-2xl font-bold tracking-tight sm:text-3xl">Related Products</h2>
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
  )
}
