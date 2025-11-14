import { NextResponse } from 'next/server';

import { createSupabaseRouteClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createSupabaseRouteClient();

    const getSessionRes = await supabase.auth.getSession();
    const session =
      (getSessionRes && (getSessionRes as any).data && (getSessionRes as any).data.session) || null;
    if ((getSessionRes as any)?.error) {
      console.error('[api/profile] getSession error:', (getSessionRes as any).error);
      return NextResponse.json(
        { error: (getSessionRes as any).error?.message ?? 'Unable to fetch session' },
        { status: 401 }
      );
    }

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, created_at, avatar, role, status')
      .eq('id', session.user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch (error) {
    console.error('[api/profile] GET error', error);
    const message = (error as Error)?.message ?? 'Internal server error';
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'development' ? message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createSupabaseRouteClient();

    const getSessionRes = await supabase.auth.getSession();
    const session =
      (getSessionRes && (getSessionRes as any).data && (getSessionRes as any).data.session) || null;
    if ((getSessionRes as any)?.error) {
      console.error('[api/profile] getSession error:', (getSessionRes as any).error);
      return NextResponse.json(
        { error: (getSessionRes as any).error?.message ?? 'Unable to fetch session' },
        { status: 401 }
      );
    }

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let payload: { full_name?: string; avatar?: string };
    try {
      payload = await request.json();
    } catch (err) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { full_name, avatar } = payload;

    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name, avatar })
      .eq('id', session.user.id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data?.[0] ?? null });
  } catch (error) {
    console.error('[api/profile] PUT error', error);
    const message = (error as Error)?.message ?? 'Internal server error';
    return NextResponse.json(
      { error: process.env.NODE_ENV === 'development' ? message : 'Internal server error' },
      { status: 500 }
    );
  }
}
