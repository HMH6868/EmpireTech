'use client';

import { ProductCard } from '@/components/account-card';
import { ProductFilters, type FilterState } from '@/components/filters';
import { Footer } from '@/components/footer';
import { useLanguage } from '@/hooks/use-locale';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Account = {
  id: string;
  name_en: string;
  slug: string;
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
  const { locale, currency } = useLanguage();
  const searchParams = useSearchParams();

  // Applied filters state
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    category: 'all',
    priceRange: { min: '', max: '' },
    sortBy: 'default',
  });

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
        setAppliedFilters((prev) => ({ ...prev, category: category.id }));
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

  const filteredProducts = accounts
    .filter((account) => {
      // Filter by Category
      if (appliedFilters.category !== 'all' && account.category_id !== appliedFilters.category) {
        return false;
      }

      // Filter by Price
      const getPrice = (acc: Account) => {
        if (!acc.variants || acc.variants.length === 0) return 0;
        const prices = acc.variants.map((v) => (currency === 'vnd' ? v.price_vnd : v.price_usd));
        return Math.min(...prices);
      };

      const price = getPrice(account);
      const minPrice = appliedFilters.priceRange.min
        ? parseFloat(appliedFilters.priceRange.min)
        : 0;
      const maxPrice = appliedFilters.priceRange.max
        ? parseFloat(appliedFilters.priceRange.max)
        : Infinity;

      if (price < minPrice || price > maxPrice) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (appliedFilters.sortBy === 'default') return 0;

      const getPrice = (acc: Account) => {
        if (!acc.variants || acc.variants.length === 0) return 0;
        const prices = acc.variants.map((v) => (currency === 'vnd' ? v.price_vnd : v.price_usd));
        return Math.min(...prices);
      };

      const priceA = getPrice(a);
      const priceB = getPrice(b);

      return appliedFilters.sortBy === 'price-asc' ? priceA - priceB : priceB - priceA;
    });

  const handleApplyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);
  };

  const copy = {
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
      <main className="flex-1">
        {/* Filters and Products */}
        <section className="py-5 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter Bar */}
            <ProductFilters
              categories={categories}
              onFilter={handleApplyFilters}
              className="mb-8"
            />

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
