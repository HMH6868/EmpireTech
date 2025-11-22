'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/hooks/use-locale';
import { Filter, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export type FilterState = {
  category: string;
  priceRange: { min: string; max: string };
  sortBy: string;
};

type Category = {
  id: string;
  name_en: string;
  name_vi: string;
  slug: string;
};

interface ProductFiltersProps {
  categories: Category[];
  onFilter: (filters: FilterState) => void;
  className?: string;
}

export function ProductFilters({ categories, onFilter, className }: ProductFiltersProps) {
  const { locale } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('default');

  const handleApplyFilters = () => {
    onFilter({
      category: selectedCategory,
      priceRange,
      sortBy,
    });
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceRange({ min: '', max: '' });
    setSortBy('default');
    onFilter({
      category: 'all',
      priceRange: { min: '', max: '' },
      sortBy: 'default',
    });
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    priceRange.min !== '' ||
    priceRange.max !== '' ||
    sortBy !== 'default';

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col gap-4 rounded-xl border border-border/40 bg-card p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {locale === 'vi' ? 'Danh mục' : 'Category'}
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-[180px]">
                  <SelectValue placeholder={locale === 'vi' ? 'Tất cả' : 'All'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{locale === 'vi' ? 'Tất cả' : 'All'}</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {locale === 'vi' ? category.name_vi : category.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Price Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              {locale === 'vi' ? 'Mức giá' : 'Price Range'}
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder={locale === 'vi' ? 'Từ' : 'Min'}
                value={
                  priceRange.min
                    ? new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US').format(
                        parseFloat(priceRange.min.replace(/,/g, '').replace(/\./g, '')) || 0
                      )
                    : ''
                }
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setPriceRange({ ...priceRange, min: value });
                }}
                className="w-full lg:w-[160px]"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="text"
                placeholder={locale === 'vi' ? 'Đến' : 'Max'}
                value={
                  priceRange.max
                    ? new Intl.NumberFormat(locale === 'vi' ? 'vi-VN' : 'en-US').format(
                        parseFloat(priceRange.max.replace(/,/g, '').replace(/\./g, '')) || 0
                      )
                    : ''
                }
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setPriceRange({ ...priceRange, max: value });
                }}
                className="w-full lg:w-[160px]"
              />
            </div>
          </div>

          {/* Sort Filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              {locale === 'vi' ? 'Sắp xếp' : 'Sort by'}
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">{locale === 'vi' ? 'Mặc định' : 'Default'}</SelectItem>
                <SelectItem value="price-asc">
                  {locale === 'vi' ? 'Giá thấp đến cao' : 'Price: Low to High'}
                </SelectItem>
                <SelectItem value="price-desc">
                  {locale === 'vi' ? 'Giá cao đến thấp' : 'Price: High to Low'}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex items-end gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="gap-2 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <RotateCcw className="h-4 w-4" />
              {locale === 'vi' ? 'Khôi phục' : 'Reset'}
            </Button>
          )}
          <Button
            onClick={handleApplyFilters}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Filter className="h-4 w-4" />
            {locale === 'vi' ? 'Lọc' : 'Filter'}
          </Button>
        </div>
      </div>
    </div>
  );
}
