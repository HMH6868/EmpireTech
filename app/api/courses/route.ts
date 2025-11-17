import { ApiError, handleApiError } from '@/lib/errors';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';

const getCachedCourses = unstable_cache(
  async (limit: number, cursor?: string) => {
    const supabase = await createSupabaseServerClient();

    let query = supabase
      .from('courses')
      .select(
        `
        id,
        slug,
        title_en,
        title_vi,
        thumbnail,
        price_vnd,
        price_usd,
        created_at,
        images:course_images(image_url)
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

    // Format images để chỉ lấy URL đầu tiên
    const formattedItems = items.map((course: any) => ({
      ...course,
      thumbnail_image: course.images?.[0]?.image_url || course.thumbnail,
      images: undefined, // Xóa field images gốc
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
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
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
