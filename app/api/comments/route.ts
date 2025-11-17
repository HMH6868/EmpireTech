import { ApiError, handleApiError } from '@/lib/errors';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Lấy comments cho một item (public, không cache để tránh vấn đề RLS)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const item_id = searchParams.get('item_id');
    const item_type = searchParams.get('item_type');

    if (!item_id || !item_type) {
      throw new ApiError('Missing item_id or item_type', 400, 'MISSING_PARAMS');
    }

    // Validate item_type
    if (!['account', 'course'].includes(item_type)) {
      throw new ApiError('Invalid item_type', 400, 'INVALID_ITEM_TYPE');
    }

    const supabase = await createSupabaseServerClient();

    // Lấy tất cả comments (bao gồm cả replies)
    const { data: comments, error } = await supabase
      .from('comments')
      .select(
        `
        id,
        item_id,
        item_type,
        user_id,
        parent_id,
        comment,
        created_at,
        updated_at,
        user:profiles(id, full_name, avatar, role)
      `
      )
      .eq('item_id', item_id)
      .eq('item_type', item_type)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Tổ chức comments thành cấu trúc tree (parent-child)
    const commentMap = new Map();
    const rootComments: any[] = [];

    // Tạo map của tất cả comments
    (comments || []).forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Xây dựng tree structure
    (comments || []).forEach((comment) => {
      const commentWithReplies = commentMap.get(comment.id);
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    return NextResponse.json({
      comments: rootComments,
      total: (comments || []).length,
    });
  } catch (error) {
    console.error('[comments/GET]', error);
    return handleApiError(error);
  }
}

// POST - Tạo comment mới
export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const body = await request.json();
    const { item_id, item_type, comment, parent_id } = body;

    if (!item_id || !item_type || !comment) {
      throw new ApiError('Missing required fields', 400, 'MISSING_FIELDS');
    }

    // Validate item_type
    if (!['account', 'course'].includes(item_type)) {
      throw new ApiError('Invalid item_type', 400, 'INVALID_ITEM_TYPE');
    }

    // Validate comment length
    if (comment.trim().length < 1 || comment.trim().length > 1000) {
      throw new ApiError('Comment must be between 1 and 1000 characters', 400, 'INVALID_LENGTH');
    }

    // Nếu có parent_id, kiểm tra parent comment tồn tại
    if (parent_id) {
      const { data: parentComment, error: parentError } = await supabase
        .from('comments')
        .select('id')
        .eq('id', parent_id)
        .single();

      if (parentError || !parentComment) {
        throw new ApiError('Parent comment not found', 404, 'PARENT_NOT_FOUND');
      }
    }

    const { data: newComment, error: insertError } = await supabase
      .from('comments')
      .insert({
        item_id,
        item_type,
        user_id: user.id,
        parent_id: parent_id || null,
        comment: comment.trim(),
      })
      .select(
        `
        id,
        item_id,
        item_type,
        user_id,
        parent_id,
        comment,
        created_at,
        updated_at,
        user:profiles(id, full_name, avatar, role)
      `
      )
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ comment: newComment }, { status: 201 });
  } catch (error) {
    console.error('[comments/POST]', error);
    return handleApiError(error);
  }
}
