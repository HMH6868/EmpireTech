import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: courses, error } = await supabase
      .from('courses')
      .select(
        `
        *,
        images:course_images(id, image_url, order_index)
      `
      )
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ courses: courses || [] });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
