'use client';

import { ProductCard } from '@/components/account-card';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-locale';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const categorySlug = searchParams.get('category');
    if (categorySlug && categories.length > 0) {
      const category = categories.find((cat) => cat.slug === categorySlug);
      if (category) {
        setSelectedCategory(category.id);
      }
    }
  }, [searchParams, categories]);

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
        <section className="py-5 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filters */}
            <div className="mb-10 flex flex-wrap gap-3">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className={`rounded-full px-6 transition-all ${
                  selectedCategory === 'all'
                    ? 'shadow-md hover:shadow-lg'
                    : 'border-border/60 bg-background hover:bg-muted hover:text-foreground'
                }`}
              >
                {locale === 'vi' ? 'Tất cả' : 'All'}
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full px-6 transition-all ${
                    selectedCategory === category.id
                      ? 'shadow-md hover:shadow-lg'
                      : 'border-border/60 bg-background hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {locale === 'vi' ? category.name_vi : category.name_en}
                </Button>
              ))}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex min-h-[400px] items-center justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-muted-foreground">{copy.loading[locale]}</p>
                </div>
              </div>
            )}

            {/* Product Grid */}
            {!loading && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredProducts.length === 0 && (
              <div className="flex min-h-[400px] flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-muted p-6">
                  <Search />
                </div>
                <h3 className="text-xl font-semibold">{copy.empty[locale]}</h3>
                <p className="mt-2 text-muted-foreground">
                  {locale === 'vi'
                    ? 'Hãy thử chọn danh mục khác'
                    : 'Try selecting a different category'}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
