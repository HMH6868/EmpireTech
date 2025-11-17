import { ApiError, handleApiError } from '@/lib/errors';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// DELETE - Xóa comment (chỉ admin)
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    const { data: existingComment } = await supabase
      .from('comments')
      .select('id')
      .eq('id', id)
      .single();

    if (!existingComment) {
      throw new ApiError('Comment not found', 404, 'NOT_FOUND');
    }

    const { error: deleteError } = await supabase.from('comments').delete().eq('id', id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[comments/DELETE]', error);
    return handleApiError(error);
  }
}
