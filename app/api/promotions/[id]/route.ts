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
      code,
      name_en,
      name_vi,
      description_en,
      description_vi,
      discount_percent,
      max_discount_amount,
      minimum_order_amount,
      start_date,
      end_date,
      usage_limit,
    } = body;

    // Determine status based on dates
    const now = new Date();
    const start = new Date(start_date);
    const end = new Date(end_date);
    let status = 'scheduled';
    if (now >= start && now <= end) {
      status = 'active';
    } else if (now > end) {
      status = 'expired';
    }

    const { data: promotion, error: promotionError } = await supabase
      .from('promotions')
      .update({
        code: code.toUpperCase(),
        name_en,
        name_vi,
        description_en: description_en || null,
        description_vi: description_vi || null,
        discount_percent,
        max_discount_amount: max_discount_amount || null,
        minimum_order_amount: minimum_order_amount || null,
        start_date,
        end_date,
        status,
        usage_limit: usage_limit || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (promotionError) throw promotionError;

    return NextResponse.json({ promotion });
  } catch (error: any) {
    console.error('Error updating promotion:', error);
    return NextResponse.json(
      { error: 'Failed to update promotion', details: error?.message },
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

    const { error } = await supabase.from('promotions').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting promotion:', error);
    return NextResponse.json(
      { error: 'Failed to delete promotion', details: error?.message },
      { status: 500 }
    );
  }
}
