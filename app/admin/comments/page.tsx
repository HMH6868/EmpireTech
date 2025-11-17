'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/hooks/use-locale';
import { BadgeCheck, ExternalLink, MessageCircle, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type Comment = {
  id: string;
  item_id: string;
  item_type: 'account' | 'course';
  user_id: string;
  parent_id: string | null;
  comment: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name: string;
    avatar?: string;
    role?: string;
  };
};

type Account = {
  id: string;
  slug: string;
  name_en: string;
  name_vi: string;
};

type Course = {
  id: string;
  slug: string;
  title_en: string;
  title_vi: string;
};

export default function AdminCommentsPage() {
  const { locale } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'account' | 'course'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminRole();
    fetchComments();
    fetchAccounts();
    fetchCourses();
  }, []);

  const checkAdminRole = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.profile?.role === 'admin');
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/comments');
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
      } else {
        toast.error('Không thể tải bình luận');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/accounts');
      if (response.ok) {
        const data = await response.json();
        setAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.items || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleDelete = async () => {
    if (!commentToDelete || !isAdmin) return;

    try {
      const response = await fetch(`/api/comments/${commentToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Đã xóa bình luận');
        setDeleteDialogOpen(false);
        setCommentToDelete(null);
        fetchComments();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Không thể xóa bình luận');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const getItemInfo = (comment: Comment) => {
    if (comment.item_type === 'account') {
      const account = accounts.find((a) => a.id === comment.item_id);
      return {
        name: account?.name_vi || account?.name_en,
        url: account ? `/vi/accounts/${account.slug}` : null,
      };
    } else {
      const course = courses.find((c) => c.id === comment.item_id);
      return {
        name: course?.title_vi || course?.title_en,
        url: course ? `/vi/courses/${course.slug}` : null,
      };
    }
  };

  const filteredComments = comments.filter((comment) => {
    if (filterType === 'all') return true;
    return comment.item_type === filterType;
  });

  if (!isAdmin) {
    return (
      <div className="p-6 md:p-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="mb-2 text-lg font-semibold">Không có quyền truy cập</h3>
            <p className="text-muted-foreground">Bạn cần quyền admin để truy cập trang này</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Quản lý bình luận</h1>
          <p className="mt-2 text-muted-foreground">
            Quản lý bình luận của người dùng trên sản phẩm và khóa học
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Tất cả bình luận ({filteredComments.length})
              </CardTitle>
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="account">Tài khoản</SelectItem>
                  <SelectItem value="course">Khóa học</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">Đang tải...</div>
            ) : filteredComments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">Chưa có bình luận</h3>
                <p className="text-muted-foreground">Chưa có bình luận nào từ người dùng</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComments.map((comment) => {
                  const itemInfo = getItemInfo(comment);
                  return (
                    <div key={comment.id} className="rounded-lg border p-4">
                      <div className="flex gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={comment.user?.avatar} />
                          <AvatarFallback>
                            {comment.user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <p className="font-medium">
                                  {comment.user?.full_name || 'Người dùng'}
                                </p>
                                {comment.user?.role === 'admin' && (
                                  <BadgeCheck className="h-4 w-4 fill-primary text-primary-foreground" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>
                                  {new Date(comment.created_at).toLocaleDateString('vi-VN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {comment.item_type === 'account' ? 'Tài khoản' : 'Khóa học'}
                                </Badge>
                                {comment.parent_id && (
                                  <Badge variant="secondary" className="text-xs">
                                    Trả lời
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {itemInfo.url && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  onClick={() => window.open(itemInfo.url!, '_blank')}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  Xem
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                className="gap-1"
                                onClick={() => {
                                  setCommentToDelete(comment.id);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                                Xóa
                              </Button>
                            </div>
                          </div>
                          {itemInfo.name && (
                            <p className="text-sm text-muted-foreground">
                              Trên: <strong>{itemInfo.name}</strong>
                            </p>
                          )}
                          <p className="whitespace-pre-wrap leading-relaxed">{comment.comment}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
