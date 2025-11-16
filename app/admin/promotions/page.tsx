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
import { Textarea } from '@/components/ui/textarea';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Promotion = {
  id: string;
  code: string;
  name_en: string;
  name_vi: string;
  description_en?: string;
  description_vi?: string;
  discount_percent: number;
  max_discount_amount?: number;
  minimum_order_amount?: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'scheduled';
  usage_limit?: number;
  used_count: number;
  created_at: string;
};

const statusLabels = {
  active: 'Đang hoạt động',
  expired: 'Đã hết hạn',
  scheduled: 'Đã lên lịch',
} as const;

const statusColors = {
  active: 'default',
  expired: 'secondary',
  scheduled: 'outline',
} as const;

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    name_en: '',
    name_vi: '',
    description_en: '',
    description_vi: '',
    discount_percent: 0,
    max_discount_amount: '',
    minimum_order_amount: '',
    start_date: '',
    end_date: '',
    usage_limit: '',
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<Promotion | null>(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/promotions');
      const data = await response.json();
      if (data.promotions) {
        setPromotions(data.promotions);
      }
    } catch (error) {
      console.error('Lỗi khi tải khuyến mãi:', error);
      toast.error('Không thể tải danh sách khuyến mãi');
    } finally {
      setLoading(false);
    }
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredPromotions = promotions.filter((promo) => {
    if (!normalizedQuery) return true;
    return (
      promo.code.toLowerCase().includes(normalizedQuery) ||
      promo.name_en.toLowerCase().includes(normalizedQuery) ||
      promo.name_vi.toLowerCase().includes(normalizedQuery)
    );
  });

  const handleAddPromotion = () => {
    setEditingPromotion(null);
    setFormData({
      code: '',
      name_en: '',
      name_vi: '',
      description_en: '',
      description_vi: '',
      discount_percent: 0,
      max_discount_amount: '',
      minimum_order_amount: '',
      start_date: '',
      end_date: '',
      usage_limit: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      code: promotion.code,
      name_en: promotion.name_en,
      name_vi: promotion.name_vi,
      description_en: promotion.description_en || '',
      description_vi: promotion.description_vi || '',
      discount_percent: promotion.discount_percent,
      max_discount_amount: promotion.max_discount_amount?.toString() || '',
      minimum_order_amount: promotion.minimum_order_amount?.toString() || '',
      start_date: promotion.start_date.split('T')[0],
      end_date: promotion.end_date.split('T')[0],
      usage_limit: promotion.usage_limit?.toString() || '',
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (promotion: Promotion) => {
    setPromotionToDelete(promotion);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!promotionToDelete) return;

    try {
      const response = await fetch(`/api/promotions/${promotionToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPromotions(promotions.filter((promo) => promo.id !== promotionToDelete.id));
        toast.success('Xóa khuyến mãi thành công!');
        setDeleteDialogOpen(false);
        setPromotionToDelete(null);
      } else {
        const error = await response.json();
        toast.error(`Lỗi: ${error.error}`);
      }
    } catch (error) {
      console.error('Lỗi khi xóa khuyến mãi:', error);
      toast.error('Có lỗi xảy ra khi xóa khuyến mãi');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const promotionData = {
      code: formData.code,
      name_en: formData.name_en,
      name_vi: formData.name_vi,
      description_en: formData.description_en,
      description_vi: formData.description_vi,
      discount_percent: formData.discount_percent,
      max_discount_amount: formData.max_discount_amount
        ? parseInt(formData.max_discount_amount)
        : null,
      minimum_order_amount: formData.minimum_order_amount
        ? parseInt(formData.minimum_order_amount)
        : null,
      start_date: formData.start_date,
      end_date: formData.end_date,
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
    };

    try {
      if (editingPromotion) {
        const response = await fetch(`/api/promotions/${editingPromotion.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(promotionData),
        });

        if (response.ok) {
          const { promotion } = await response.json();
          if (promotion) {
            setPromotions(promotions.map((p) => (p.id === editingPromotion.id ? promotion : p)));
            toast.success('Cập nhật khuyến mãi thành công!');
          }
        } else {
          const error = await response.json();
          toast.error(`Lỗi: ${error.error}`);
          return;
        }
      } else {
        const response = await fetch('/api/promotions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(promotionData),
        });

        if (response.ok) {
          const { promotion } = await response.json();
          if (promotion) {
            setPromotions([promotion, ...promotions]);
            toast.success('Tạo khuyến mãi thành công!');
          }
        } else {
          const error = await response.json();
          toast.error(`Lỗi: ${error.error}`);
          return;
        }
      }

      setIsDialogOpen(false);
      setEditingPromotion(null);
    } catch (error) {
      console.error('Lỗi khi lưu khuyến mãi:', error);
      toast.error('Có lỗi xảy ra khi lưu khuyến mãi');
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
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa khuyến mãi</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa mã khuyến mãi{' '}
              <span className="font-semibold">{promotionToDelete?.code}</span>? Hành động này không
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
            <h1 className="text-3xl font-bold">Quản lý khuyến mãi</h1>
            <p className="mt-2 text-muted-foreground">Thêm, sửa hoặc xóa mã khuyến mãi</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={handleAddPromotion}>
                <Plus className="h-4 w-4" />
                Thêm khuyến mãi
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingPromotion ? 'Sửa khuyến mãi' : 'Thêm khuyến mãi mới'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingPromotion
                      ? 'Cập nhật thông tin khuyến mãi bên dưới.'
                      : 'Điền thông tin cho mã khuyến mãi mới.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="code">Mã khuyến mãi</Label>
                      <Input
                        id="code"
                        placeholder="WELCOME20"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData({ ...formData, code: e.target.value.toUpperCase() })
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="discount_percent">Phần trăm giảm (%)</Label>
                      <Input
                        id="discount_percent"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="20"
                        value={formData.discount_percent}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            discount_percent: parseInt(e.target.value) || 0,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="name_en">Tên (Tiếng Anh)</Label>
                      <Input
                        id="name_en"
                        placeholder="Welcome Discount"
                        value={formData.name_en}
                        onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name_vi">Tên (Tiếng Việt)</Label>
                      <Input
                        id="name_vi"
                        placeholder="Giảm giá chào mừng"
                        value={formData.name_vi}
                        onChange={(e) => setFormData({ ...formData, name_vi: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="max_discount_amount">Giảm tối đa (VND)</Label>
                      <Input
                        id="max_discount_amount"
                        type="number"
                        min="0"
                        placeholder="500000"
                        value={formData.max_discount_amount}
                        onChange={(e) =>
                          setFormData({ ...formData, max_discount_amount: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="minimum_order_amount">Đơn hàng tối thiểu (VND)</Label>
                      <Input
                        id="minimum_order_amount"
                        type="number"
                        min="0"
                        placeholder="1000000"
                        value={formData.minimum_order_amount}
                        onChange={(e) =>
                          setFormData({ ...formData, minimum_order_amount: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="start_date">Ngày bắt đầu</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="end_date">Ngày kết thúc</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="usage_limit">Giới hạn sử dụng (tùy chọn)</Label>
                    <Input
                      id="usage_limit"
                      type="number"
                      min="0"
                      placeholder="100"
                      value={formData.usage_limit}
                      onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description_en">Mô tả (Tiếng Anh)</Label>
                    <Textarea
                      id="description_en"
                      placeholder="Get 20% off on your first purchase"
                      value={formData.description_en}
                      onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description_vi">Mô tả (Tiếng Việt)</Label>
                    <Textarea
                      id="description_vi"
                      placeholder="Giảm 20% cho đơn hàng đầu tiên"
                      value={formData.description_vi}
                      onChange={(e) => setFormData({ ...formData, description_vi: e.target.value })}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button type="submit">{editingPromotion ? 'Cập nhật' : 'Tạo'} khuyến mãi</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Tất cả khuyến mãi ({filteredPromotions.length})</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm mã khuyến mãi..."
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
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">Mã</th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Tên
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Giảm giá
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Thời gian
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Sử dụng
                    </th>
                    <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                      Trạng thái
                    </th>
                    <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPromotions.map((promotion) => (
                    <tr key={promotion.id} className="border-b border-border last:border-0">
                      <td className="py-3 text-sm font-mono font-bold">{promotion.code}</td>
                      <td className="py-3 text-sm">{promotion.name_vi}</td>
                      <td className="py-3 text-sm font-bold text-primary">
                        {promotion.discount_percent}%
                      </td>
                      <td className="py-3 text-sm text-muted-foreground">
                        {new Date(promotion.start_date).toLocaleDateString('vi-VN')} -{' '}
                        {new Date(promotion.end_date).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-3 text-sm">
                        {promotion.used_count}
                        {promotion.usage_limit ? ` / ${promotion.usage_limit}` : ''}
                      </td>
                      <td className="py-3">
                        <Badge variant={statusColors[promotion.status]}>
                          {statusLabels[promotion.status]}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditPromotion(promotion)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteClick(promotion)}
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
