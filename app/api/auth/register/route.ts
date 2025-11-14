import { NextResponse } from 'next/server';

import { createSupabaseRouteClient } from '@/lib/supabase/server';

type RegisterPayload = {
  email?: string;
  password?: string;
  name?: string;
};

export async function POST(request: Request) {
  let payload: RegisterPayload;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { email, password, name } = payload;

  if (!email || !password || !name) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseRouteClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        user: data.user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[auth/register] unexpected error', error);
    return NextResponse.json({ error: 'Unable to create account' }, { status: 500 });
  }
}
