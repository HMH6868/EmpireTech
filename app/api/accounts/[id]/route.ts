import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseRouteClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // XÁC THỰC ADMIN - BẮT BUỘC
    const supabaseAuth = await createSupabaseRouteClient();
    const {
      data: { session },
    } = await supabaseAuth.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabaseAuth
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Chỉ dùng admin client sau khi đã xác thực
    const supabase = createSupabaseAdminClient();

    const { data: account, error } = await supabase
      .from('accounts')
      .select(
        `
        *,
        category:categories(id, name_en, name_vi, slug),
        images:account_images(id, image_url, order_index),
        variants:account_variants(*)
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ account });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Xác thực admin
    const supabaseAuth = await createSupabaseRouteClient();
    const {
      data: { session },
    } = await supabaseAuth.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabaseAuth
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabase = createSupabaseAdminClient();
    const body = await request.json();
    const { variants, gallery_images, ...accountData } = body;

    // Kiểm tra account tồn tại
    const { data: existingAccounts } = await supabase.from('accounts').select('id').eq('id', id);

    if (!existingAccounts || existingAccounts.length === 0) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Cập nhật account
    const { error: accountError } = await supabase
      .from('accounts')
      .update(accountData)
      .eq('id', id);

    if (accountError) {
      return NextResponse.json({ error: accountError.message }, { status: 500 });
    }

    // Cập nhật variants
    if (variants && variants.length > 0) {
      await supabase.from('account_variants').delete().eq('account_id', id);

      const variantsToInsert = variants.map((variant: any, index: number) => {
        const { id: varId, created_at, account_id, ...variantData } = variant;
        return {
          id: `${id}-var-${index}-${Date.now()}`,
          ...variantData,
          account_id: id,
        };
      });

      await supabase.from('account_variants').insert(variantsToInsert);
    }

    // Cập nhật gallery images
    if (gallery_images !== undefined) {
      await supabase.from('account_images').delete().eq('account_id', id);

      if (gallery_images.length > 0) {
        const imagesToInsert = gallery_images.map((imageUrl: string, index: number) => ({
          account_id: id,
          image_url: imageUrl,
          order_index: index,
        }));

        await supabase.from('account_images').insert(imagesToInsert);
      }
    }

    // Lấy account đã cập nhật
    const { data: updatedAccountArray } = await supabase.from('accounts').select('*').eq('id', id);

    const updatedAccount =
      updatedAccountArray && updatedAccountArray.length > 0 ? updatedAccountArray[0] : null;

    if (!updatedAccount) {
      return NextResponse.json({ error: 'Failed to fetch updated account' }, { status: 500 });
    }

    // Lấy relations
    let category = null;
    if (updatedAccount.category_id) {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id, name_en, name_vi, slug')
        .eq('id', updatedAccount.category_id)
        .limit(1);
      category = categoryData?.[0] || null;
    }

    const { data: updatedVariants } = await supabase
      .from('account_variants')
      .select('*')
      .eq('account_id', id);

    const { data: images } = await supabase
      .from('account_images')
      .select('id, image_url, order_index')
      .eq('account_id', id);

    return NextResponse.json({
      account: {
        ...updatedAccount,
        category,
        variants: updatedVariants || [],
        images: images || [],
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Xác thực admin
    const supabaseAuth = await createSupabaseRouteClient();
    const {
      data: { session },
    } = await supabaseAuth.auth.getSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabaseAuth
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.from('accounts').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
