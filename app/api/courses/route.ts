import { ApiError, handleApiError } from '@/lib/errors';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';

// Create a public Supabase client for cached queries (no cookies)
const createPublicSupabaseClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

const getCachedCourses = unstable_cache(
  async (limit: number, cursor?: string) => {
    // Use public client without cookies for caching
    const supabase = createPublicSupabaseClient();

    let query = supabase
      .from('courses')
      .select(
        `
        id,
        slug,
        title_en,
        title_vi,
        thumbnail,
        instructor,
        price_vnd,
        price_usd,
        description_en,
        description_vi,
        created_at,
        updated_at,
        images:course_images(id, image_url, order_index)
      `
      )
      .order('created_at', { ascending: false })
      .limit(limit + 1);

    // Nếu có cursor, lấy các bản ghi có created_at nhỏ hơn cursor
    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  },
  ['courses-list'],
  { revalidate: 900 } // Cache 15 phút
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Lấy limit từ query params, mặc định 20, tối đa 50
    const limitParam = searchParams.get('limit');
    const limit = Math.min(parseInt(limitParam || '20', 10), 50);

    // Lấy cursor (timestamp created_at) để phân trang
    const cursor = searchParams.get('cursor') || undefined;

    const data = await getCachedCourses(limit, cursor);

    // Kiểm tra còn trang sau không
    const hasMore = data.length > limit;
    const items = hasMore ? data.slice(0, -1) : data;

    // Lấy cursor cho trang tiếp theo
    const nextCursor = hasMore && items.length > 0 ? items[items.length - 1]?.created_at : null;

    // Format items - keep all fields including images
    const formattedItems = items.map((course: any) => ({
      ...course,
      thumbnail_image: course.images?.[0]?.image_url || course.thumbnail,
      // Keep images array for detail page
    }));

    return NextResponse.json({
      items: formattedItems,
      nextCursor,
      hasMore,
      limit,
    });
  } catch (error) {
    console.error('[courses/GET]', error);
    return handleApiError(error);
  }
}

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

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      throw new ApiError('Forbidden', 403, 'FORBIDDEN');
    }

    const body = await request.json();
    const {
      slug,
      title_en,
      title_vi,
      thumbnail,
      instructor,
      price_usd,
      price_vnd,
      description_en,
      description_vi,
      gallery_images,
    } = body;

    if (!slug || !title_en || !title_vi || !instructor) {
      throw new ApiError('Missing required fields', 400, 'MISSING_FIELDS');
    }

    const courseId = `course-${Date.now()}`;

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        id: courseId,
        slug,
        title_en,
        title_vi,
        thumbnail: thumbnail || null,
        instructor,
        price_usd: price_usd || 0,
        price_vnd: price_vnd || 0,
        description_en: description_en || null,
        description_vi: description_vi || null,
      })
      .select()
      .single();

    if (courseError) throw courseError;

    if (gallery_images && gallery_images.length > 0) {
      const imageInserts = gallery_images.map((url: string, index: number) => ({
        course_id: courseId,
        image_url: url,
        order_index: index,
      }));

      await supabase.from('course_images').insert(imageInserts);
    }

    const { data: fullCourse } = await supabase
      .from('courses')
      .select(
        `
        *,
        images:course_images(id, image_url, order_index)
      `
      )
      .eq('id', courseId)
      .single();

    return NextResponse.json({ course: fullCourse });
  } catch (error) {
    console.error('[courses/POST]', error);
    return handleApiError(error);
  }
}
