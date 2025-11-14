import { AdminSidebar } from '@/components/admin-sidebar';
import { LanguageProvider } from '@/components/language-provider';
import type React from 'react';
import { Suspense } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
