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

    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1 || quantity > 999) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    // VERIFY OWNERSHIP: Kiểm tra cart item thuộc về user
    const { data: cartItem } = await supabase
      .from('cart_items')
      .select('cart_id, cart:cart(user_id)')
      .eq('id', id)
      .single();

    if (!cartItem || (cartItem.cart as any)?.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: item, error } = await supabase
      .from('cart_items')
      .update({
        quantity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ item });
  } catch (error: any) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item', details: error?.message },
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

    // VERIFY OWNERSHIP: Kiểm tra cart item thuộc về user
    const { data: cartItem } = await supabase
      .from('cart_items')
      .select('cart_id, cart:cart(user_id)')
      .eq('id', id)
      .single();

    if (!cartItem || (cartItem.cart as any)?.user_id !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { error } = await supabase.from('cart_items').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting cart item:', error);
    return NextResponse.json(
      { error: 'Failed to delete cart item', details: error?.message },
      { status: 500 }
    );
  }
}
