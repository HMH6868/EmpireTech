import { createSupabaseRouteClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const supabase = await createSupabaseRouteClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Xác thực admin
    const { data: requesterProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!requesterProfile || requesterProfile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Ngăn admin tự thay đổi role của chính mình
    if (id === session.user.id) {
      return NextResponse.json({ error: 'Cannot modify your own account' }, { status: 400 });
    }

    const body = await request.json();
    const updates: Record<string, string> = {};

    if (typeof body.role === 'string' && ['admin', 'user'].includes(body.role)) {
      updates.role = body.role;
    }

    if (typeof body.status === 'string' && ['active', 'banned'].includes(body.status)) {
      updates.status = body.status;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select('id, email, full_name, avatar, role, status, created_at')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
