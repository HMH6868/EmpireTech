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

    let { full_name, avatar } = payload;

    // VALIDATE & SANITIZE full_name
    if (full_name !== undefined) {
      full_name = full_name.trim();
      if (full_name.length < 2 || full_name.length > 50) {
        return NextResponse.json(
          { error: 'Full name must be between 2 and 50 characters' },
          { status: 400 }
        );
      }
      // Sanitize: remove dangerous characters
      full_name = full_name.replace(/[<>&"']/g, '');
    }

    // VALIDATE avatar URL
    if (avatar !== undefined && avatar !== null && avatar.length > 0) {
      try {
        const url = new URL(avatar);
        if (!['http:', 'https:'].includes(url.protocol)) {
          return NextResponse.json({ error: 'Invalid avatar URL' }, { status: 400 });
        }
      } catch {
        return NextResponse.json({ error: 'Invalid avatar URL format' }, { status: 400 });
      }
    }

    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (avatar !== undefined) updateData.avatar = avatar;

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
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
