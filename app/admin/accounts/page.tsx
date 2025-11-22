'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Loader2, Plus, Search, Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Account = {
  id: string;
  slug: string;
  name_en: string;
  name_vi: string;
  description_en?: string;
  description_vi?: string;
  image?: string;
  category_id?: string;
  inventory_status: 'in-stock' | 'low-stock' | 'out-of-stock';
  delivery_type_en?: string;
  delivery_type_vi?: string;
  category?: {
    id: string;
    name_en: string;
    name_vi: string;
    slug: string;
  };
  images?: Array<{
    id: string;
    image_url: string;
    locale: string;
    order_index: number;
  }>;
  variants?: Array<{
    id: string;
    account_id: string;
    name_en: string;
    name_vi: string;
    price_usd: number;
    price_vnd: number;
    original_price_usd?: number;
    original_price_vnd?: number;
    sku: string;
    image?: string;
    stock: boolean;
    is_default: boolean;
    images?: Array<{
      id?: string;
      image_url: string;
      locale: string;
      order_index: number;
    }>;
  }>;
};

type Category = {
  id: string;
  name_en: string;
  name_vi: string;
  slug: string;
};

const statusLabels = {
  'in-stock': 'Còn hàng',
  'low-stock': 'Sắp hết',
  'out-of-stock': 'Hết hàng',
} as const;

const formatVND = (value: number | string) => {
  if (!value) return '';
  // Convert to string and remove existing dots
  const stringValue = value.toString().replace(/\./g, '');
  // Check if it's a valid number
  const numberValue = Number(stringValue);
  if (isNaN(numberValue)) return value.toString();
  // Format with dots
  return new Intl.NumberFormat('vi-VN').format(numberValue);
};

const parseVND = (value: string) => {
  // Remove dots and convert to number
  return Number(value.replace(/\./g, ''));
};

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [variants, setVariants] = useState<Account['variants']>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // State để lưu dữ liệu form
  const [formData, setFormData] = useState({
    name_en: '',
    name_vi: '',
    slug: '',
    category_id: '',
    image: '',
    inventory_status: 'in-stock' as Account['inventory_status'],
    delivery_en: '',
    delivery_vi: '',
    description_en: '',
    description_vi: '',
  });

  // State cho gallery images
  const [galleryImages, setGalleryImages] = useState<
    Array<{ image_url: string; locale: string; order_index: number }>
  >([]);

  // State cho delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);

  useEffect(() => {
    fetchAccounts();
    fetchCategories();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/accounts');
      const data = await response.json();
      if (data.accounts) {
        setAccounts(data.accounts);
      }
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
      toast.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredAccounts = accounts.filter((account) => {
    if (!normalizedQuery) return true;
    const nameMatches =
      account.name_en.toLowerCase().includes(normalizedQuery) ||
      account.name_vi.toLowerCase().includes(normalizedQuery);
    const categoryMatches = account.category?.name_vi.toLowerCase().includes(normalizedQuery);
    return nameMatches || categoryMatches;
  });

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
      toast.error('Không thể tải danh sách danh mục');
    }
  };

  const handleAddProduct = () => {
    setEditingAccount(null);
    setVariants([]);
    setGalleryImages([]);
    setFormData({
      name_en: '',
      name_vi: '',
      slug: '',
      category_id: categories[0]?.id || '',
      image: '',
      inventory_status: 'in-stock',
      delivery_en: '',
      delivery_vi: '',
      description_en: '',
      description_vi: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditProduct = (account: Account) => {
    setEditingAccount(account);
    setVariants(account.variants || []);
    setGalleryImages(
      account.images?.map((img, idx) => ({
        image_url: img.image_url,
        locale: img.locale || 'vi',
        order_index: idx,
      })) || []
    );
    setFormData({
      name_en: account.name_en,
      name_vi: account.name_vi,
      slug: account.slug,
      category_id: account.category_id || categories[0]?.id || '',
      image: account.image || '',
      inventory_status: account.inventory_status,
      delivery_en: account.delivery_type_en || '',
      delivery_vi: account.delivery_type_vi || '',
      description_en: account.description_en || '',
      description_vi: account.description_vi || '',
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (account: Account) => {
    setAccountToDelete(account);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!accountToDelete) return;

    try {
      const response = await fetch(`/api/accounts/${accountToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAccounts(accounts.filter((account) => account.id !== accountToDelete.id));
        toast.success('Xóa sản phẩm thành công!');
        setDeleteDialogOpen(false);
        setAccountToDelete(null);
      } else {
        const error = await response.json();
        toast.error(`Lỗi: ${error.error}`);
      }
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
      toast.error('Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  const handleAddVariant = () => {
    setVariants([
      ...(variants || []),
      {
        id: `variant-${Date.now()}`,
        account_id: editingAccount?.id || '',
        name_en: '',
        name_vi: '',
        price_usd: 0,
        price_vnd: 0,
        sku: '',
        image: '',
        stock: true,
        is_default: false,
        images: [],
      },
    ]);
  };

  const handleUpdateVariant = (index: number, field: string, value: any) => {
    const updatedVariants = [...(variants || [])];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setVariants(updatedVariants);
  };

  const handleDeleteVariant = (index: number) => {
    setVariants((variants || []).filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent spam clicking
    if (isSubmitting) return;
    setIsSubmitting(true);

    const accountData = {
      slug: formData.slug,
      name_en: formData.name_en,
      name_vi: formData.name_vi,
      description_en: formData.description_en,
      description_vi: formData.description_vi,
      image: formData.image,
      category_id: formData.category_id,
      inventory_status: formData.inventory_status,
      delivery_type_en: formData.delivery_en,
      delivery_type_vi: formData.delivery_vi,
      variants,
      gallery_images: galleryImages.filter((img) => img.image_url.trim() !== ''),
    };

    try {
      if (editingAccount) {
        // Cập nhật sản phẩm
        const response = await fetch(`/api/accounts/${editingAccount.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(accountData),
        });

        if (response.ok) {
          const { account } = await response.json();
          if (account) {
            setAccounts(accounts.map((a) => (a.id === editingAccount.id ? account : a)));
            toast.success('Cập nhật sản phẩm thành công!');
          } else {
            toast.error('Không nhận được dữ liệu sản phẩm sau khi cập nhật');
            return;
          }
        } else {
          const error = await response.json();
          toast.error(`Lỗi: ${error.error}`);
          return;
        }
      } else {
        // Tạo sản phẩm mới
        const response = await fetch('/api/accounts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(accountData),
        });

        if (response.ok) {
          const { account } = await response.json();
          if (account) {
            setAccounts([account, ...accounts]);
            toast.success('Tạo sản phẩm thành công!');
          } else {
            toast.error('Không nhận được dữ liệu sản phẩm sau khi tạo');
            return;
          }
        } else {
          const error = await response.json();
          toast.error(`Lỗi: ${error.error}`);
          return;
        }
      }

      setIsDialogOpen(false);
      setEditingAccount(null);
      setVariants([]);
    } catch (error) {
      console.error('Lỗi khi lưu sản phẩm:', error);
      toast.error('Có lỗi xảy ra khi lưu sản phẩm');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm{' '}
              <span className="font-semibold">{accountToDelete?.name_vi}</span>? Hành động này không
              thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Xóa
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="p-6 md:p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
            <p className="mt-2 text-muted-foreground">Thêm, sửa hoặc xóa sản phẩm trong kho</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={handleAddProduct}>
                <Plus className="h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>{editingAccount ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</DialogTitle>
                  <DialogDescription>
                    {editingAccount
                      ? 'Cập nhật thông tin sản phẩm bên dưới.'
                      : 'Điền thông tin cho sản phẩm mới. Sử dụng Markdown cho mô tả.'}
                  </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="general" className="mt-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="general">Thông tin chung</TabsTrigger>
                    <TabsTrigger value="variants">Biến thể ({(variants || []).length})</TabsTrigger>
                    <TabsTrigger value="description">Mô tả</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-4 py-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name_en">Tên sản phẩm (Tiếng Anh)</Label>
                        <Input
                          id="name_en"
                          name="name_en"
                          placeholder="ChatGPT Plus Account"
                          value={formData.name_en}
                          onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="name_vi">Tên sản phẩm (Tiếng Việt)</Label>
                        <Input
                          id="name_vi"
                          name="name_vi"
                          placeholder="Tài khoản ChatGPT Plus"
                          value={formData.name_vi}
                          onChange={(e) => setFormData({ ...formData, name_vi: e.target.value })}
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
                          value={formData.slug}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              slug: e.target.value.replace(/\s+/g, '-').toLowerCase(),
                            })
                          }
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category_id">Danh mục</Label>
                        <Select
                          name="category_id"
                          value={formData.category_id}
                          onValueChange={(value) =>
                            setFormData({ ...formData, category_id: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name_vi}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="image">URL hình ảnh chính</Label>
                      <div className="flex gap-2">
                        <Input
                          id="image"
                          name="image"
                          placeholder="https://i.imgur.com/example.png"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                        <Button type="button" variant="outline" size="icon">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Nhập URL hình ảnh hoặc nhấn biểu tượng tải lên
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label>Thư viện ảnh (Gallery)</Label>
                      <div className="space-y-2">
                        {galleryImages.map((img, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder={`URL ảnh ${index + 1}`}
                              value={img.image_url}
                              onChange={(e) => {
                                const newImages = [...galleryImages];
                                newImages[index] = {
                                  ...newImages[index],
                                  image_url: e.target.value,
                                };
                                setGalleryImages(newImages);
                              }}
                              className="flex-1"
                            />
                            <Select
                              value={img.locale}
                              onValueChange={(value) => {
                                const newImages = [...galleryImages];
                                newImages[index] = { ...newImages[index], locale: value };
                                setGalleryImages(newImages);
                              }}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="vi">VI</SelectItem>
                                <SelectItem value="en">EN</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setGalleryImages(galleryImages.filter((_, i) => i !== index));
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setGalleryImages([
                              ...galleryImages,
                              { image_url: '', locale: 'vi', order_index: galleryImages.length },
                            ])
                          }
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Thêm ảnh
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Thêm nhiều ảnh cho Gallery. Chọn VI (Tiếng Việt) hoặc EN (Tiếng Anh) cho mỗi
                        ảnh.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="inventory_status">Trạng thái kho</Label>
                        <Select
                          name="inventory_status"
                          value={formData.inventory_status}
                          onValueChange={(value) =>
                            setFormData({
                              ...formData,
                              inventory_status: value as Account['inventory_status'],
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in-stock">Còn hàng</SelectItem>
                            <SelectItem value="low-stock">Sắp hết</SelectItem>
                            <SelectItem value="out-of-stock">Hết hàng</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Loại giao hàng</Label>
                        <Input
                          name="delivery_en"
                          placeholder="Instant email delivery"
                          value={formData.delivery_en}
                          onChange={(e) =>
                            setFormData({ ...formData, delivery_en: e.target.value })
                          }
                        />
                        <Input
                          name="delivery_vi"
                          placeholder="Giao qua email ngay"
                          value={formData.delivery_vi}
                          onChange={(e) =>
                            setFormData({ ...formData, delivery_vi: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="variants" className="space-y-4 py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Thêm nhiều biến thể cho sản phẩm này (ví dụ: thời hạn khác nhau, gói khác
                        nhau)
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddVariant}
                        className="gap-2 bg-transparent"
                      >
                        <Plus className="h-3 w-3" />
                        Thêm biến thể
                      </Button>
                    </div>

                    {!variants || variants.length === 0 ? (
                      <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-8">
                          <p className="text-sm text-muted-foreground">Chưa có biến thể nào</p>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddVariant}
                            className="mt-3 bg-transparent"
                          >
                            Thêm biến thể đầu tiên
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-3">
                        {variants.map((variant, index) => (
                          <Card key={variant.id}>
                            <CardContent className="p-4">
                              <div className="mb-3 flex items-center justify-between">
                                <Badge variant="secondary">Biến thể {index + 1}</Badge>
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
                                <div className="grid grid-cols-1 gap-3">
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs">Tên biến thể (EN)</Label>
                                    <Input
                                      placeholder="1 Month Access"
                                      value={variant.name_en}
                                      onChange={(e) =>
                                        handleUpdateVariant(index, 'name_en', e.target.value)
                                      }
                                      className="h-9"
                                    />
                                  </div>
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs">Tên biến thể (VI)</Label>
                                    <Input
                                      placeholder="1 tháng sử dụng"
                                      value={variant.name_vi}
                                      onChange={(e) =>
                                        handleUpdateVariant(index, 'name_vi', e.target.value)
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
                                      onChange={(e) =>
                                        handleUpdateVariant(
                                          index,
                                          'sku',
                                          e.target.value.toUpperCase()
                                        )
                                      }
                                      className="h-9 uppercase"
                                    />
                                  </div>
                                </div>
                                <Label className="text-xs">Hình ảnh biến thể (Localized)</Label>
                                <div className="space-y-2">
                                  {(variant.images || []).map((img, imgIndex) => (
                                    <div key={imgIndex} className="flex gap-2">
                                      <Input
                                        placeholder="URL hình ảnh"
                                        value={img.image_url}
                                        onChange={(e) => {
                                          const newImages = [...(variant.images || [])];
                                          newImages[imgIndex] = {
                                            ...newImages[imgIndex],
                                            image_url: e.target.value,
                                          };
                                          handleUpdateVariant(index, 'images', newImages);
                                        }}
                                        className="h-9 flex-1"
                                      />
                                      <Select
                                        value={img.locale}
                                        onValueChange={(value) => {
                                          const newImages = [...(variant.images || [])];
                                          newImages[imgIndex] = {
                                            ...newImages[imgIndex],
                                            locale: value,
                                          };
                                          handleUpdateVariant(index, 'images', newImages);
                                        }}
                                      >
                                        <SelectTrigger className="h-9 w-20">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="vi">VI</SelectItem>
                                          <SelectItem value="en">EN</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={() => {
                                          const newImages = (variant.images || []).filter(
                                            (_, i) => i !== imgIndex
                                          );
                                          handleUpdateVariant(index, 'images', newImages);
                                        }}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const newImages = [
                                        ...(variant.images || []),
                                        {
                                          image_url: '',
                                          locale: 'vi',
                                          order_index: (variant.images || []).length,
                                        },
                                      ];
                                      handleUpdateVariant(index, 'images', newImages);
                                    }}
                                    className="w-full h-8 text-xs"
                                  >
                                    <Plus className="h-3 w-3 mr-2" />
                                    Thêm ảnh biến thể
                                  </Button>
                                </div>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-2">
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs">Giá (USD)</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="15.99"
                                      value={variant.price_usd}
                                      onChange={(e) =>
                                        handleUpdateVariant(
                                          index,
                                          'price_usd',
                                          Number.parseFloat(e.target.value) || 0
                                        )
                                      }
                                      className="h-9"
                                    />
                                  </div>
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs">Giá (VND)</Label>
                                    <Input
                                      type="text"
                                      placeholder="349.000"
                                      value={formatVND(variant.price_vnd)}
                                      onChange={(e) =>
                                        handleUpdateVariant(
                                          index,
                                          'price_vnd',
                                          parseVND(e.target.value)
                                        )
                                      }
                                      className="h-9"
                                    />
                                  </div>
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs">Giá gốc (USD)</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="18.99"
                                      value={variant.original_price_usd || ''}
                                      onChange={(e) =>
                                        handleUpdateVariant(
                                          index,
                                          'original_price_usd',
                                          Number.parseFloat(e.target.value) || 0
                                        )
                                      }
                                      className="h-9"
                                    />
                                  </div>
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs">Giá gốc (VND)</Label>
                                    <Input
                                      type="text"
                                      placeholder="399.000"
                                      value={formatVND(variant.original_price_vnd || 0)}
                                      onChange={(e) =>
                                        handleUpdateVariant(
                                          index,
                                          'original_price_vnd',
                                          parseVND(e.target.value)
                                        )
                                      }
                                      className="h-9"
                                    />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                  <div className="grid gap-1.5">
                                    <Label className="text-xs">Tồn kho</Label>
                                    <Select
                                      value={variant.stock ? 'true' : 'false'}
                                      onValueChange={(val) =>
                                        handleUpdateVariant(index, 'stock', val === 'true')
                                      }
                                    >
                                      <SelectTrigger className="h-9">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="true">Còn hàng</SelectItem>
                                        <SelectItem value="false">Hết hàng</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex items-center gap-2 pt-6">
                                    <input
                                      type="checkbox"
                                      id={`default-${index}`}
                                      checked={variant.is_default || false}
                                      onChange={(e) => {
                                        const updatedVariants = (variants || []).map((v, i) => ({
                                          ...v,
                                          is_default: i === index ? e.target.checked : false,
                                        }));
                                        setVariants(updatedVariants);
                                      }}
                                      className="h-4 w-4"
                                    />
                                    <Label htmlFor={`default-${index}`} className="text-xs">
                                      Đặt làm biến thể mặc định
                                    </Label>
                                  </div>
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
                      <Label htmlFor="description_en">Mô tả (Markdown) - Tiếng Anh</Label>
                      <Textarea
                        id="description_en"
                        name="description_en"
                        placeholder="## Premium Account&#10;&#10;This is a **high-quality** account with full access..."
                        value={formData.description_en}
                        onChange={(e) =>
                          setFormData({ ...formData, description_en: e.target.value })
                        }
                        className="min-h-[200px] font-mono text-sm"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description_vi">Mô tả (Markdown) - Tiếng Việt</Label>
                      <Textarea
                        id="description_vi"
                        name="description_vi"
                        placeholder="## Tài khoản cao cấp&#10;&#10;Đây là tài khoản **chính chủ** với đầy đủ quyền hạn..."
                        value={formData.description_vi}
                        onChange={(e) =>
                          setFormData({ ...formData, description_vi: e.target.value })
                        }
                        className="min-h-[200px] font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Hỗ trợ định dạng Markdown (tiêu đề, in đậm, danh sách, v.v.)
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter className="mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingAccount ? 'Đang cập nhật...' : 'Đang tạo...'}
                      </>
                    ) : (
                      <>{editingAccount ? 'Cập nhật' : 'Tạo'} sản phẩm</>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Tất cả sản phẩm ({filteredAccounts.length})</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Sản phẩm
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Danh mục
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Biến thể
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Tồn kho
                    </th>
                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account) => (
                    <tr key={account.id} className="border-b border-border last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative aspect-video w-16 overflow-hidden rounded-xl bg-muted">
                            <Image
                              src={account.image || '/placeholder.svg'}
                              alt={account.name_vi || account.slug}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {account.name_vi || account.slug}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-sm">
                        {account.category?.name_vi || 'Chưa phân loại'}
                      </td>
                      <td className="py-3">
                        {account.variants && account.variants.length > 0 ? (
                          <Badge variant="secondary">{account.variants.length} biến thể</Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">Không có</span>
                        )}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            account.inventory_status === 'in-stock'
                              ? 'default'
                              : account.inventory_status === 'low-stock'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {statusLabels[account.inventory_status]}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditProduct(account)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteClick(account)}
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
    </>
  );
}
