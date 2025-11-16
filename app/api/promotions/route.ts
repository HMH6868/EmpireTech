import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: promotions, error } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ promotions: promotions || [] });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json({ error: 'Failed to fetch promotions' }, { status: 500 });
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
    console.log('📦 Received body:', body);

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

    if (!code || !name_en || !name_vi || !discount_percent || !start_date || !end_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

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

    const promotionId = `promo-${Date.now()}`;

    const insertData = {
      id: promotionId,
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
      used_count: 0,
    };

    console.log('💾 Inserting data:', insertData);

    const { data: promotion, error: promotionError } = await supabase
      .from('promotions')
      .insert(insertData)
      .select()
      .single();

    if (promotionError) {
      console.error('❌ Supabase error:', promotionError);
      throw promotionError;
    }

    console.log('✅ Created promotion:', promotion);

    return NextResponse.json({ promotion });
  } catch (error: any) {
    console.error('Error creating promotion:', error);
    return NextResponse.json(
      { error: 'Failed to create promotion', details: error?.message },
      { status: 500 }
    );
  }
}
