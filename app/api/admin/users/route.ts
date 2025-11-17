import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseRouteClient } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';

const getCachedUsers = unstable_cache(
  async (page: number, perPage: number) => {
    // Use admin client without cookies for caching
    const supabase = createSupabaseAdminClient();

    const offset = (page - 1) * perPage;

    // Lấy danh sách users với phân trang
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, status, created_at')
      .order('created_at', { ascending: true })
      .range(offset, offset + perPage - 1);

    if (error) throw error;

    // Lấy tổng số users
    const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

    return { data: data ?? [], count: count ?? 0 };
  },
  ['admin-users-list'],
  { revalidate: 300 } // Cache 5 phút
);

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseRouteClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Xác thực admin
    const { data: requesterProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!requesterProfile || requesterProfile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Lấy pagination params
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');
    const perPageParam = searchParams.get('perPage');

    const page = Math.max(parseInt(pageParam || '1', 10), 1);
    const perPage = Math.min(Math.max(parseInt(perPageParam || '20', 10), 1), 100);

    const { data, count } = await getCachedUsers(page, perPage);

    const totalPages = Math.ceil(count / perPage);

    return NextResponse.json({
      profiles: data,
      total: count,
      page,
      perPage,
      totalPages,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
