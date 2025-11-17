'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/use-locale';
import { BadgeCheck, MessageCircle, Reply, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Comment = {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    full_name: string;
    avatar?: string;
    role?: string;
  };
  replies?: Comment[];
};

type CommentSectionProps = {
  itemId: string;
  itemType: 'account' | 'course';
  currentUserId?: string;
};

export function CommentSection({ itemId, itemType, currentUserId }: CommentSectionProps) {
  const { locale } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments?item_id=${itemId}&item_type=${itemType}`);
      const data = await response.json();
      if (response.ok) {
        console.log('Fetched comments:', data.comments); // Debug
        // Flatten replies: Tất cả replies đều nằm ở tầng 2, không nested
        const flattenedComments = (data.comments || []).map((comment: Comment) => {
          if (comment.replies && comment.replies.length > 0) {
            // Lấy tất cả replies và replies của replies, flatten thành 1 mảng
            const allReplies: Comment[] = [];
            const collectReplies = (replies: Comment[]) => {
              replies.forEach((reply) => {
                console.log('Reply user:', reply.user); // Debug
                allReplies.push({ ...reply, replies: [] }); // Bỏ nested replies
                if (reply.replies && reply.replies.length > 0) {
                  collectReplies(reply.replies);
                }
              });
            };
            collectReplies(comment.replies);
            return { ...comment, replies: allReplies };
          }
          return comment;
        });
        console.log('Flattened comments:', flattenedComments); // Debug
        setComments(flattenedComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    fetchComments();
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: itemId,
          item_type: itemType,
          comment: newComment,
        }),
      });

      if (response.ok) {
        toast.success(locale === 'vi' ? 'Đã gửi bình luận' : 'Comment posted');
        setNewComment('');
        fetchComments();
      } else {
        const error = await response.json();
        if (response.status === 401) {
          toast.error(locale === 'vi' ? 'Vui lòng đăng nhập' : 'Please login');
        } else {
          toast.error(error.error || 'Failed to post comment');
        }
      }
    } catch (error) {
      toast.error(locale === 'vi' ? 'Có lỗi xảy ra' : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!replyText.trim()) return;

    try {
      setSubmitting(true);
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: itemId,
          item_type: itemType,
          comment: replyText,
          parent_id: parentId,
        }),
      });

      if (response.ok) {
        toast.success(locale === 'vi' ? 'Đã trả lời' : 'Reply posted');
        setReplyText('');
        setReplyingTo(null);
        fetchComments();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to post reply');
      }
    } catch (error) {
      toast.error(locale === 'vi' ? 'Có lỗi xảy ra' : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = (comment: Comment, isReply = false) => {
    return (
      <div key={comment.id} className={isReply ? 'ml-12' : ''}>
        <div className="flex gap-3 rounded-lg border p-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={comment.user?.avatar} />
            <AvatarFallback>
              {comment.user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <p className="font-medium">{comment.user?.full_name || 'User'}</p>
                {comment.user?.role === 'admin' && (
                  <BadgeCheck className="h-4 w-4 fill-primary text-primary-foreground" />
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString(
                  locale === 'vi' ? 'vi-VN' : 'en-US',
                  { year: 'numeric', month: 'short', day: 'numeric' }
                )}
              </span>
            </div>

            <p className="mt-2 whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {comment.comment}
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 gap-1"
                onClick={() => {
                  if (!currentUserId) {
                    toast.error(locale === 'vi' ? 'Vui lòng đăng nhập' : 'Please login');
                    return;
                  }
                  setReplyingTo(comment.id);
                }}
              >
                <Reply className="h-3 w-3" />
                {locale === 'vi' ? 'Trả lời' : 'Reply'}
              </Button>
            </div>

            {replyingTo === comment.id && (
              <div className="mt-3 space-y-2">
                <Textarea
                  placeholder={locale === 'vi' ? 'Viết câu trả lời...' : 'Write a reply...'}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="min-h-[80px]"
                  maxLength={1000}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleReply(comment.id)}
                    disabled={submitting}
                    className="gap-1"
                  >
                    <Send className="h-3 w-3" />
                    {locale === 'vi' ? 'Gửi' : 'Send'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyText('');
                    }}
                  >
                    {locale === 'vi' ? 'Hủy' : 'Cancel'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h3 className="text-lg font-semibold">
          {locale === 'vi' ? 'Bình luận' : 'Comments'} ({comments.length})
        </h3>
      </div>

      {/* Form bình luận mới */}
      <form onSubmit={handleSubmitComment} className="space-y-3 rounded-lg border p-4">
        <Textarea
          placeholder={locale === 'vi' ? 'Viết bình luận của bạn...' : 'Write your comment...'}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
          maxLength={1000}
          required
        />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{newComment.length}/1000</span>
          <Button type="submit" disabled={submitting} className="gap-2">
            <Send className="h-4 w-4" />
            {locale === 'vi' ? 'Gửi bình luận' : 'Post Comment'}
          </Button>
        </div>
      </form>

      {/* Danh sách bình luận */}
      {loading ? (
        <div className="py-8 text-center text-muted-foreground">
          {locale === 'vi' ? 'Đang tải...' : 'Loading...'}
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          {locale === 'vi' ? 'Chưa có bình luận nào' : 'No comments yet'}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {renderComment(comment, false)}
              {comment.replies && comment.replies.length > 0 && (
                <>{comment.replies.map((reply) => renderComment(reply, true))}</>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
