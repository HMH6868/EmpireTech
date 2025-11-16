import { createSupabaseServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create cart
    let { data: cart } = await supabase
      .from('cart')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (!cart) {
      const { data: newCart } = await supabase
        .from('cart')
        .insert({ user_id: session.user.id })
        .select('id')
        .single();
      cart = newCart;
    }

    if (!cart) {
      return NextResponse.json({ items: [] });
    }

    // Get cart items
    const { data: items, error } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id);

    if (error) throw error;

    return NextResponse.json({ items: items || [] });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
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

    const body = await request.json();
    const { item_id, item_type, variant_id, price_usd, price_vnd, quantity = 1 } = body;

    if (!item_id || !item_type || !price_usd || !price_vnd) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get or create cart
    let { data: cart } = await supabase
      .from('cart')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (!cart) {
      const { data: newCart, error: cartError } = await supabase
        .from('cart')
        .insert({ user_id: session.user.id })
        .select('id')
        .single();

      if (cartError) throw cartError;
      cart = newCart;
    }

    // Check if item already exists
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('cart_id', cart.id)
      .eq('item_id', item_id)
      .eq('item_type', item_type)
      .eq('variant_id', variant_id || null)
      .single();

    if (existingItem) {
      // Update quantity
      const { data: updatedItem, error: updateError } = await supabase
        .from('cart_items')
        .update({
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (updateError) throw updateError;
      return NextResponse.json({ item: updatedItem });
    }

    // Add new item
    const { data: newItem, error: insertError } = await supabase
      .from('cart_items')
      .insert({
        cart_id: cart.id,
        item_id,
        item_type,
        variant_id: variant_id || null,
        quantity,
        price_usd,
        price_vnd,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    return NextResponse.json({ item: newItem });
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart', details: error?.message },
      { status: 500 }
    );
  }
}
