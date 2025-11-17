import { createSupabaseRouteClient, createSupabaseServerClient } from './supabase/server';

/**
 * Securely get authenticated user from Supabase
 * Uses getUser() instead of getSession() for better security
 * @returns User object or null if not authenticated
 */
export async function getAuthenticatedUser() {
  const supabase = await createSupabaseRouteClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Securely get authenticated user for server components
 */
export async function getAuthenticatedUserServer() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}
