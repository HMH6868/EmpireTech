'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-locale';
import { MessageCircle } from 'lucide-react';

export default function AdminCommentsPage() {
  const { locale } = useLanguage();

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {locale === 'vi' ? 'Quản lý bình luận' : 'Comments Management'}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {locale === 'vi'
            ? 'Quản lý bình luận của người dùng'
            : 'Manage user comments on products and courses'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {locale === 'vi' ? 'Tất cả bình luận' : 'All Comments'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">
              {locale === 'vi' ? 'Chưa có bình luận' : 'No comments yet'}
            </h3>
            <p className="text-muted-foreground">
              {locale === 'vi'
                ? 'Chưa có bình luận nào từ người dùng'
                : 'No user comments available'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
