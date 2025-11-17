import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';

const getCachedCategories = unstable_cache(
  async () => {
    const supabase = createSupabaseAdminClient();

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name_en', { ascending: true });

    if (error) throw error;

    return categories;
  },
  ['categories-list'],
  { revalidate: 3600 } // Cache 1 giờ
);

export async function GET() {
  try {
    const categories = await getCachedCategories();

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
