import {
  createRouteHandlerClient,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const createSupabaseServerClient = async () => {
  // Await cookie store because `cookies()` may be async in newer Next.js versions
  const cookieStore = await cookies();
  return createServerComponentClient({
    // Provide a synchronous provider function that returns the cookie store
    cookies: () => cookieStore as any,
  });
};

export const createSupabaseRouteClient = async () => {
  const cookieStore = await cookies();
  return createRouteHandlerClient({
    // Pass a sync function returning the awaited cookie store
    // Cast to any to handle type mismatch between Next.js and helper types
    cookies: () => cookieStore as any,
  });
};

export const createSupabaseAdminClient = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
