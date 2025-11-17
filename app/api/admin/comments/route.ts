import { ApiError, handleApiError } from '@/lib/errors';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Lấy tất cả comments (chỉ admin)
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    // Kiểm tra role admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      throw new ApiError('Forbidden - Admin only', 403, 'FORBIDDEN');
    }

    // Lấy tất cả comments
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
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ comments: comments || [] });
  } catch (error) {
    console.error('[admin/comments/GET]', error);
    return handleApiError(error);
  }
}
