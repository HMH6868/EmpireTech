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
import { products, type Product, type ProductVariant } from "@/lib/mock-data"
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

export default function AdminProductsPage() {
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
    setVariants(product.variants || [])
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
        name: "",
        price: 0,
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
    const newProduct: Product = {
      id: editingProduct?.id || String(productList.length + 1),
      name: formData.get("name") as string,
      image: formData.get("image") as string,
      price: Number.parseFloat(formData.get("price") as string),
      category: formData.get("category") as string,
      rating: editingProduct?.rating || 0,
      description: formData.get("description") as string,
      stock: formData.get("stock") as string,
      deliveryType: formData.get("deliveryType") as string,
      variants: variants.length > 0 ? variants : undefined,
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
                  <div className="grid gap-2">
                    <Label htmlFor="name">Product Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="ChatGPT Plus Account"
                      defaultValue={editingProduct?.name}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">Base Price</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        placeholder="15.99"
                        defaultValue={editingProduct?.price}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        name="category"
                        placeholder="AI Tools"
                        defaultValue={editingProduct?.category}
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
                        placeholder="/placeholder.svg?height=300&width=300"
                        defaultValue={editingProduct?.image}
                        required
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Enter image URL or click upload icon (mock)</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="stock">Stock Status</Label>
                      <Select name="stock" defaultValue={editingProduct?.stock || "In Stock"}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="In Stock">In Stock</SelectItem>
                          <SelectItem value="Low Stock">Low Stock</SelectItem>
                          <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="deliveryType">Delivery Type</Label>
                      <Select name="deliveryType" defaultValue={editingProduct?.deliveryType || "Auto Delivery"}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select delivery" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Auto Delivery">Auto Delivery</SelectItem>
                          <SelectItem value="Manual Delivery">Manual Delivery</SelectItem>
                        </SelectContent>
                      </Select>
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
                      {variants.map((variant, index) => (
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
                              <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-1.5">
                                  <Label className="text-xs">Variant Name</Label>
                                  <Input
                                    placeholder="1 Month"
                                    value={variant.name}
                                    onChange={(e) => handleUpdateVariant(index, "name", e.target.value)}
                                    className="h-9"
                                  />
                                </div>
                                <div className="grid gap-1.5">
                                  <Label className="text-xs">SKU</Label>
                                  <Input
                                    placeholder="PRODUCT-1M"
                                    value={variant.sku}
                                    onChange={(e) => handleUpdateVariant(index, "sku", e.target.value)}
                                    className="h-9"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-3">
                                <div className="grid gap-1.5">
                                  <Label className="text-xs">Price</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="15.99"
                                    value={variant.price || ""}
                                    onChange={(e) =>
                                      handleUpdateVariant(index, "price", Number.parseFloat(e.target.value))
                                    }
                                    className="h-9"
                                  />
                                </div>
                                <div className="grid gap-1.5">
                                  <Label className="text-xs">Original Price</Label>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="20.00"
                                    value={variant.originalPrice || ""}
                                    onChange={(e) =>
                                      handleUpdateVariant(index, "originalPrice", Number.parseFloat(e.target.value))
                                    }
                                    className="h-9"
                                  />
                                </div>
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
                                      <SelectItem value="true">In Stock</SelectItem>
                                      <SelectItem value="false">Out of Stock</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid gap-1.5">
                                <Label className="text-xs">Image URL</Label>
                                <div className="flex gap-2">
                                  <Input
                                    placeholder="/placeholder.svg?height=300&width=300"
                                    value={variant.image}
                                    onChange={(e) => handleUpdateVariant(index, "image", e.target.value)}
                                    className="h-9"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-9 w-9 shrink-0 bg-transparent"
                                  >
                                    <Upload className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
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
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="description" className="space-y-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (Markdown)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="## Premium Account&#10;&#10;This is a **high-quality** account with full access..."
                      defaultValue={editingProduct?.description}
                      className="min-h-[300px] font-mono text-sm"
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
                {productList.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm">{product.category}</td>
                    <td className="py-3 text-sm font-medium">${product.price.toLocaleString()}</td>
                    <td className="py-3">
                      {product.variants && product.variants.length > 0 ? (
                        <Badge variant="secondary">{product.variants.length} variants</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">None</span>
                      )}
                    </td>
                    <td className="py-3">
                      <Badge variant={product.stock === "In Stock" ? "default" : "destructive"}>{product.stock}</Badge>
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
