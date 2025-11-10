"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { products, categories } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"

export default function AccountsPage() {
  const { language } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredProducts =
    selectedCategory === "all" ? products : products.filter((product) => product.categoryId === selectedCategory)

  const copy = {
    title: { en: "Premium Digital Accounts", vi: "Tài khoản số cao cấp" },
    description: {
      en: "Browse our collection of verified premium accounts with instant delivery",
      vi: "Khám phá kho tài khoản uy tín, giao ngay trong vài phút",
    },
    empty: { en: "No products found in this category.", vi: "Không có sản phẩm trong danh mục này." },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-border/40 bg-muted/30 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">{copy.title[language]}</h1>
            <p className="mt-3 text-pretty text-lg text-muted-foreground">{copy.description[language]}</p>
          </div>
        </section>

        {/* Filters and Products */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filters */}
            <div className="mb-8 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="transition-all"
                >
                  {category.name[language]}
                </Button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">{copy.empty[language]}</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
