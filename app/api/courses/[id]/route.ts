import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .update({
        slug,
        title_en,
        title_vi,
        thumbnail: thumbnail || null,
        instructor,
        price_usd: price_usd || 0,
        price_vnd: price_vnd || 0,
        description_en: description_en || null,
        description_vi: description_vi || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (courseError) {
      console.error('Course update error:', courseError);
      throw courseError;
    }

    await supabase.from('course_images').delete().eq('course_id', id);

    if (gallery_images && gallery_images.length > 0) {
      const imageInserts = gallery_images.map((url: string, index: number) => ({
        course_id: id,
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
      .eq('id', id)
      .single();

    return NextResponse.json({ course: fullCourse });
  } catch (error: any) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      {
        error: 'Failed to update course',
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    const { error } = await supabase.from('courses').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
