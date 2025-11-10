"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Plus, Edit, Trash2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  products,
  categories,
  type Product,
  type ProductVariant,
  type LocalizedText,
  type Price,
} from "@/lib/mock-data"
import { useLanguage } from "@/hooks/use-language"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const emptyLocalized = (): LocalizedText => ({ en: "", vi: "" })
const ensureLocalizedText = (value: LocalizedText | string | undefined): LocalizedText => {
  if (!value) return emptyLocalized()
  if (typeof value === "string") {
    return { en: value, vi: value }
  }
  return value
}

const ensurePriceValue = (value: Price | number | undefined): Price => {
  if (typeof value === "number") {
    return { usd: value, vnd: 0 }
  }
  return value ?? { usd: 0, vnd: 0 }
}

const getLocalizedString = (value: LocalizedText | string | undefined, lang: "en" | "vi") => {
  if (!value) return ""
  return typeof value === "string" ? value : value[lang] ?? ""
}

const statusLabels = {
  "in-stock": { en: "In Stock", vi: "Còn hàng" },
  "low-stock": { en: "Low Stock", vi: "Sắp hết" },
  "out-of-stock": { en: "Out of Stock", vi: "Hết hàng" },
} as const

const getCategoryLabel = (categoryId: string, lang: "en" | "vi") =>
  categories.find((category) => category.id === categoryId)?.name[lang] ?? categoryId

export default function AdminProductsPage() {
  const { language, formatCurrency, currency } = useLanguage()
  const [productList, setProductList] = useState(products)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null)

  const handleAddProduct = () => {
    setEditingProduct(null)
    setVariants([])
    setIsDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setVariants(
      (product.variants || []).map((variant) => ({
        ...variant,
        name: ensureLocalizedText(variant.name),
        price: ensurePriceValue(variant.price),
        originalPrice: variant.originalPrice ? ensurePriceValue(variant.originalPrice) : undefined,
      })),
    )
    setIsDialogOpen(true)
  }

  const handleDeleteProduct = (id: string) => {
    setProductList(productList.filter((product) => product.id !== id))
  }

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        id: `variant-${Date.now()}`,
        name: emptyLocalized(),
        price: { usd: 0, vnd: 0 },
        originalPrice: { usd: 0, vnd: 0 },
        sku: "",
        image: "",
        stock: true,
      },
    ])
    setEditingVariantIndex(variants.length)
  }

  const handleUpdateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const updatedVariants = [...variants]
    updatedVariants[index] = { ...updatedVariants[index], [field]: value }
    setVariants(updatedVariants)
  }

  const handleDeleteVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const galleryInput = (formData.get("images") as string) || ""
    const galleryImages = galleryInput
      .split("\n")
      .map((img) => img.trim())
      .filter(Boolean)

    const normalizedVariants =
      variants.length > 0
        ? variants.map((variant) => ({
            ...variant,
            name: ensureLocalizedText(variant.name),
            price: ensurePriceValue(variant.price),
            originalPrice: variant.originalPrice ? ensurePriceValue(variant.originalPrice) : undefined,
          }))
        : undefined

    const newProduct: Product = {
      id: editingProduct?.id || String(productList.length + 1),
      slug: (formData.get("slug") as string)?.trim() || editingProduct?.slug || "",
      name: {
        en: (formData.get("name_en") as string)?.trim() || "",
        vi: (formData.get("name_vi") as string)?.trim() || "",
      },
      image: (formData.get("image") as string)?.trim() || galleryImages[0] || editingProduct?.image || "",
      images: galleryImages.length ? galleryImages : editingProduct?.images,
      price: {
        usd: Number.parseFloat((formData.get("price_usd") as string) || "0"),
        vnd: Number.parseFloat((formData.get("price_vnd") as string) || "0"),
      },
      categoryId: (formData.get("categoryId") as string) || categories[0]?.id || "ai-tools",
      rating: editingProduct?.rating || 0,
      description: {
        en: (formData.get("description_en") as string) || "",
        vi: (formData.get("description_vi") as string) || "",
      },
      inventoryStatus: (formData.get("inventoryStatus") as Product["inventoryStatus"]) || "in-stock",
      deliveryType: {
        en: (formData.get("delivery_en") as string) || "",
        vi: (formData.get("delivery_vi") as string) || "",
      },
      variants: normalizedVariants,
    }

    if (editingProduct) {
      setProductList(productList.map((p) => (p.id === editingProduct.id ? newProduct : p)))
    } else {
      setProductList([...productList, newProduct])
    }

    setIsDialogOpen(false)
    setEditingProduct(null)
    setVariants([])
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <p className="mt-2 text-muted-foreground">Add, edit, or remove products from your inventory</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={handleAddProduct}>
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                <DialogDescription>
                  {editingProduct
                    ? "Update the product details below."
                    : "Fill in the details for the new product. Use Markdown for description."}
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="general" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">General Info</TabsTrigger>
                  <TabsTrigger value="variants">Variants ({variants.length})</TabsTrigger>
                  <TabsTrigger value="description">Description</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 py-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="name_en">Product Name (English)</Label>
                      <Input
                        id="name_en"
                        name="name_en"
                        placeholder="ChatGPT Plus Account"
                        defaultValue={editingProduct ? editingProduct.name.en : ""}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name_vi">Product Name (Vietnamese)</Label>
                      <Input
                        id="name_vi"
                        name="name_vi"
                        placeholder="Tài khoản ChatGPT Plus"
                        defaultValue={editingProduct ? editingProduct.name.vi : ""}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        name="slug"
                        placeholder="chatgpt-plus-account"
                        defaultValue={editingProduct?.slug}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="categoryId">Category</Label>
                      <Select name="categoryId" defaultValue={editingProduct?.categoryId || categories[0]?.id}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name.en} / {category.name.vi}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="price_usd">Price (USD)</Label>
                      <Input
                        id="price_usd"
                        name="price_usd"
                        type="number"
                        step="0.01"
                        placeholder="15.99"
                        defaultValue={editingProduct ? editingProduct.price.usd : ""}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="price_vnd">Price (VND)</Label>
                      <Input
                        id="price_vnd"
                        name="price_vnd"
                        type="number"
                        step="1000"
                        placeholder="349000"
                        defaultValue={editingProduct ? editingProduct.price.vnd : ""}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="image">Main Image URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="image"
                        name="image"
                        placeholder="/images/products/chatgpt-plus/main.png"
                        defaultValue={editingProduct?.image}
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Enter image URL or click upload icon (mock)</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="images">Gallery Images (one per line)</Label>
                    <Textarea
                      id="images"
                      name="images"
                      placeholder="/images/products/chatgpt-plus/main.png"
                      defaultValue={editingProduct?.images?.join("\n") ?? ""}
                      className="min-h-[120px]"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="inventoryStatus">Stock Status</Label>
                      <Select name="inventoryStatus" defaultValue={editingProduct?.inventoryStatus || "in-stock"}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-stock">In Stock</SelectItem>
                          <SelectItem value="low-stock">Low Stock</SelectItem>
                          <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Delivery Type</Label>
                      <Input
                        name="delivery_en"
                        placeholder="Instant email delivery"
                        defaultValue={editingProduct ? editingProduct.deliveryType.en : ""}
                        required
                      />
                      <Input
                        name="delivery_vi"
                        placeholder="Giao qua email ngay"
                        defaultValue={editingProduct ? editingProduct.deliveryType.vi : ""}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="variants" className="space-y-4 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Add multiple variants for this product (e.g., different durations, packages)
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddVariant}
                      className="gap-2 bg-transparent"
                    >
                      <Plus className="h-3 w-3" />
                      Add Variant
                    </Button>
                  </div>

                  {variants.length === 0 ? (
                    <Card className="border-dashed">
                      <CardContent className="flex flex-col items-center justify-center py-8">
                        <p className="text-sm text-muted-foreground">No variants added yet</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleAddVariant}
                          className="mt-3 bg-transparent"
                        >
                          Add Your First Variant
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3">
                      {variants.map((variant, index) => {
                        const localizedName = ensureLocalizedText(variant.name)
                        const basePrice = ensurePriceValue(variant.price)
                        const comparePrice = variant.originalPrice ? ensurePriceValue(variant.originalPrice) : undefined

                        return (
                          <Card key={variant.id}>
                            <CardContent className="p-4">
                              <div className="mb-3 flex items-center justify-between">
                                <Badge variant="secondary">Variant {index + 1}</Badge>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-destructive"
                                  onClick={() => handleDeleteVariant(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid gap-3">
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs">Variant Name (EN)</Label>
                                    <Input
                                      placeholder="1 Month Access"
                                      value={localizedName.en}
                                      onChange={(e) =>
                                        handleUpdateVariant(index, "name", { ...localizedName, en: e.target.value })
                                      }
                                      className="h-9"
                                    />
                                  </div>
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs">Variant Name (VI)</Label>
                                    <Input
                                      placeholder="1 tháng sử dụng"
                                      value={localizedName.vi}
                                      onChange={(e) =>
                                        handleUpdateVariant(index, "name", { ...localizedName, vi: e.target.value })
                                      }
                                      className="h-9"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs">SKU</Label>
                                    <Input
                                      placeholder="PRODUCT-1M"
                                      value={variant.sku}
                                      onChange={(e) => handleUpdateVariant(index, "sku", e.target.value)}
                                      className="h-9"
                                    />
                                  </div>
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs">Image URL</Label>
                                    <Input
                                      placeholder="/images/products/chatgpt-plus/main.png"
                                      value={variant.image}
                                      onChange={(e) => handleUpdateVariant(index, "image", e.target.value)}
                                      className="h-9"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs">Price (USD)</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="15.99"
                                      value={basePrice.usd}
                                      onChange={(e) =>
                                        handleUpdateVariant(index, "price", {
                                          ...basePrice,
                                          usd: Number.parseFloat(e.target.value) || 0,
                                        })
                                      }
                                      className="h-9"
                                    />
                                  </div>
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs">Price (VND)</Label>
                                    <Input
                                      type="number"
                                      step="1000"
                                      placeholder="349000"
                                      value={basePrice.vnd}
                                      onChange={(e) =>
                                        handleUpdateVariant(index, "price", {
                                          ...basePrice,
                                          vnd: Number.parseFloat(e.target.value) || 0,
                                        })
                                      }
                                      className="h-9"
                                    />
                                  </div>
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs">Original (USD)</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="18.99"
                                      value={comparePrice?.usd ?? ""}
                                      onChange={(e) =>
                                        handleUpdateVariant(index, "originalPrice", {
                                          ...(comparePrice ?? { usd: 0, vnd: 0 }),
                                          usd: Number.parseFloat(e.target.value) || 0,
                                        })
                                      }
                                      className="h-9"
                                    />
                                  </div>
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs">Original (VND)</Label>
                                    <Input
                                      type="number"
                                      step="1000"
                                      placeholder="399000"
                                      value={comparePrice?.vnd ?? ""}
                                      onChange={(e) =>
                                        handleUpdateVariant(index, "originalPrice", {
                                          ...(comparePrice ?? { usd: 0, vnd: 0 }),
                                          vnd: Number.parseFloat(e.target.value) || 0,
                                        })
                                      }
                                      className="h-9"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs">Stock</Label>
                                    <Select
                                      value={variant.stock ? "true" : "false"}
                                      onValueChange={(val) => handleUpdateVariant(index, "stock", val === "true")}
                                    >
                                      <SelectTrigger className="h-9">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="true">Available</SelectItem>
                                        <SelectItem value="false">Sold Out</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex items-center gap-2 pt-6">
                                    <input
                                      type="checkbox"
                                      id={`default-${index}`}
                                      checked={variant.isDefault || false}
                                      onChange={(e) => {
                                        const updatedVariants = variants.map((v, i) => ({
                                          ...v,
                                          isDefault: i === index ? e.target.checked : false,
                                        }))
                                        setVariants(updatedVariants)
                                      }}
                                      className="h-4 w-4"
                                    />
                                    <Label htmlFor={`default-${index}`} className="text-xs">
                                      Set as default variant
                                    </Label>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="description" className="space-y-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="description_en">Description (Markdown) - English</Label>
                    <Textarea
                      id="description_en"
                      name="description_en"
                      placeholder="## Premium Account&#10;&#10;This is a **high-quality** account with full access..."
                      defaultValue={editingProduct ? editingProduct.description.en : ""}
                      className="min-h-[200px] font-mono text-sm"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description_vi">Description (Markdown) - Vietnamese</Label>
                    <Textarea
                      id="description_vi"
                      name="description_vi"
                      placeholder="## Tài khoản cao cấp&#10;&#10;Đây là tài khoản **chính chủ** với đầy đủ quyền hạn..."
                      defaultValue={editingProduct ? editingProduct.description.vi : ""}
                      className="min-h-[200px] font-mono text-sm"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Supports Markdown formatting (headers, bold, lists, etc.)
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingProduct ? "Update" : "Create"} Product</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products ({productList.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Product</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Price</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Variants</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Stock</th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Rating</th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {productList.map((product) => {
                  const localizedName = getLocalizedString(product.name, language)
                  const status = product.inventoryStatus || "in-stock"
                  const statusLabel = statusLabels[status as keyof typeof statusLabels] || statusLabels["in-stock"]
                  return (
                    <tr key={product.id} className="border-b border-border last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={product.image || "/placeholder.svg"}
                              alt={localizedName || product.slug}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-sm font-medium">{localizedName || product.slug}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm">{getCategoryLabel(product.categoryId, language)}</td>
                      <td className="py-3 text-sm font-medium">
                        {formatCurrency(product.price[currency], { currency })}
                      </td>
                      <td className="py-3">
                        {product.variants && product.variants.length > 0 ? (
                          <Badge variant="secondary">{product.variants.length} variants</Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">None</span>
                        )}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            status === "in-stock" ? "default" : status === "low-stock" ? "secondary" : "destructive"
                          }
                        >
                          {statusLabel[language]}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm">{product.rating} ★</td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
