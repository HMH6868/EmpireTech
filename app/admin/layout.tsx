import { AdminSidebar } from '@/components/admin-sidebar';
import { LanguageProvider } from '@/components/language-provider';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type React from 'react';
import { Suspense } from 'react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side guard: only allow users with role 'admin' to view the admin area
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If there's no authenticated session, redirect to home
  if (!session?.user?.id) {
    redirect('/');
  }

  // Fetch profile to validate the role
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (error || !profile || profile.role !== 'admin') {
    redirect('/');
  }
  return (
    <Suspense fallback={null}>
      <LanguageProvider>
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 md:pl-64">{children}</main>
        </div>
      </LanguageProvider>
    </Suspense>
  );
}
