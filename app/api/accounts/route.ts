import { createSupabaseAdminClient } from '@/lib/supabase/admin';
import { createSupabaseRouteClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createSupabaseAdminClient();

    const { data: accounts, error } = await supabase
      .from('accounts')
      .select(
        `
        *,
        category:categories(id, name_en, name_vi, slug),
        images:account_images(id, image_url, order_index),
        variants:account_variants(*)
      `
      )
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ accounts });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
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

    const accountId = `acc-${Date.now()}`;

    // Tạo account
    const { data: accountArray, error: accountError } = await supabase
      .from('accounts')
      .insert([{ id: accountId, ...accountData }])
      .select();

    if (accountError || !accountArray?.[0]) {
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }

    // Thêm variants
    if (variants?.length > 0) {
      const variantsToInsert = variants.map((variant: any, index: number) => {
        const { id, created_at, ...variantData } = variant;
        return {
          id: `${accountId}-var-${index}`,
          ...variantData,
          account_id: accountId,
        };
      });

      await supabase.from('account_variants').insert(variantsToInsert);
    }

    // Thêm gallery images
    if (gallery_images?.length > 0) {
      const imagesToInsert = gallery_images.map((imageUrl: string, index: number) => ({
        account_id: accountId,
        image_url: imageUrl,
        order_index: index,
      }));

      await supabase.from('account_images').insert(imagesToInsert);
    }

    // Lấy account với relations
    const { data: createdAccountArray } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', accountId);

    const createdAccount = createdAccountArray?.[0];

    if (!createdAccount) {
      return NextResponse.json({ account: accountArray[0] }, { status: 201 });
    }

    // Lấy relations
    let category = null;
    if (createdAccount.category_id) {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id, name_en, name_vi, slug')
        .eq('id', createdAccount.category_id)
        .limit(1);
      category = categoryData?.[0] || null;
    }

    const { data: createdVariants } = await supabase
      .from('account_variants')
      .select('*')
      .eq('account_id', accountId);

    const { data: images } = await supabase
      .from('account_images')
      .select('id, image_url, order_index')
      .eq('account_id', accountId);

    return NextResponse.json(
      {
        account: {
          ...createdAccount,
          category,
          variants: createdVariants || [],
          images: images || [],
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
