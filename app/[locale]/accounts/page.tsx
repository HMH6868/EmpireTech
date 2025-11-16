'use client';

import { ProductCard } from '@/components/account-card';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-locale';
import { useEffect, useState } from 'react';

type Account = {
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

type Category = {
  id: string;
  name_en: string;
  name_vi: string;
  slug: string;
};

export default function AccountsPage() {
  const { locale } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [accountsRes, categoriesRes] = await Promise.all([
        fetch('/api/accounts'),
        fetch('/api/categories'),
      ]);

      const accountsData = await accountsRes.json();
      const categoriesData = await categoriesRes.json();

      if (accountsData.accounts) {
        setAccounts(accountsData.accounts);
      }

      if (categoriesData.categories) {
        setCategories(categoriesData.categories);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts =
    selectedCategory === 'all'
      ? accounts
      : accounts.filter((account) => account.category_id === selectedCategory);

  const copy = {
    title: { en: 'Premium Digital Accounts', vi: 'Tài khoản Premium' },
    description: {
      en: 'Browse our collection of verified premium accounts with instant delivery',
      vi: 'Kho tài khoản uy tín, giao ngay trong vài phút',
    },
    empty: {
      en: 'No products found in this category.',
      vi: 'Không có sản phẩm trong danh mục này.',
    },
    loading: {
      en: 'Loading products...',
      vi: 'Đang tải sản phẩm...',
    },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-border/40 bg-muted/30 py-5 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-balance text-xl font-bold tracking-tight sm:text-2xl">
              {copy.title[locale]}
            </h1>
            <p className="mt-1 text-pretty text-base text-muted-foreground">
              {copy.description[locale]}
            </p>
          </div>
        </section>

        {/* Filters and Products */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filters */}
            <div className="mb-8 flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="transition-all"
              >
                {locale === 'vi' ? 'Tất cả' : 'All'}
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="transition-all"
                >
                  {locale === 'vi' ? category.name_vi : category.name_en}
                </Button>
              ))}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">{copy.loading[locale]}</p>
              </div>
            )}

            {/* Product Grid */}
            {!loading && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredProducts.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">{copy.empty[locale]}</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
