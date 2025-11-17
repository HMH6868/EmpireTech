import { AdminHeader } from '@/components/admin-header';
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
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();


  if (authError || !user?.id) {
    redirect('/');
  }

  // Fetch profile to validate the role
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !profile || profile.role !== 'admin') {
    redirect('/');
  }
  return (
    <Suspense fallback={null}>
      <LanguageProvider>
        <div className="flex min-h-screen">
          <AdminSidebar />
          <div className="flex-1 md:pl-64">
            <AdminHeader />
            <main>{children}</main>
          </div>
        </div>
      </LanguageProvider>
    </Suspense>
  );
}
