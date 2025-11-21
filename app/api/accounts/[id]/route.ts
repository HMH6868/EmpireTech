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
        images:account_images(id, image_url, locale, order_index),
        variants:account_variants(*, images:variant_images(*))
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
      // Delete existing variants
      const { error: deleteError } = await supabase
        .from('account_variants')
        .delete()
        .eq('account_id', id);

      if (deleteError) {
        console.error('Error deleting variants:', deleteError);
        return NextResponse.json(
          { error: `Failed to delete variants: ${deleteError.message}` },
          { status: 500 }
        );
      }

      for (let index = 0; index < variants.length; index++) {
        const variant = variants[index];
        const { id: varId, created_at, account_id, image, images, ...variantData } = variant;
        const variantId = `${id}-var-${index}-${Date.now()}`;

        // Insert variant
        const { error: variantError } = await supabase.from('account_variants').insert({
          id: variantId,
          ...variantData,
          account_id: id,
        });

        if (variantError) {
          console.error('Error inserting variant:', variantError);
          return NextResponse.json(
            { error: `Failed to insert variant: ${variantError.message}` },
            { status: 500 }
          );
        }

        // Insert variant images if any
        if (images?.length > 0) {
          const variantImagesToInsert = images.map((img: any) => ({
            variant_id: variantId,
            image_url: img.image_url,
            locale: img.locale || 'vi',
            order_index: img.order_index ?? 0,
          }));

          const { error: imagesError } = await supabase
            .from('variant_images')
            .insert(variantImagesToInsert);

          if (imagesError) {
            console.error('Error inserting variant images:', imagesError);
            return NextResponse.json(
              { error: `Failed to insert variant images: ${imagesError.message}` },
              { status: 500 }
            );
          }
        }
      }
    }

    // Cập nhật gallery images
    if (gallery_images !== undefined) {
      await supabase.from('account_images').delete().eq('account_id', id);

      if (gallery_images.length > 0) {
        const imagesToInsert = gallery_images.map((img: any) => ({
          account_id: id,
          image_url: typeof img === 'string' ? img : img.image_url,
          locale: typeof img === 'string' ? 'vi' : img.locale || 'vi',
          order_index:
            typeof img === 'string'
              ? gallery_images.indexOf(img)
              : img.order_index ?? gallery_images.indexOf(img),
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
      .select('*, images:variant_images(*)')
      .eq('account_id', id);

    const { data: images } = await supabase
      .from('account_images')
      .select('id, image_url, locale, order_index')
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
