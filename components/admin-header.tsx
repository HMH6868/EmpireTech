'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { ExternalLink, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type UserProfile = {
  full_name: string | null;
  avatar: string | null;
};

export function AdminHeader() {
  const [sessionUser, setSessionUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    let isMounted = true;

    const syncSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (isMounted) {
        setSessionUser(data.session?.user ?? null);
      }
    };

    syncSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user ?? null);
      if (!session) {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!sessionUser?.id) {
      setProfile(null);
      return;
    }

    let isActive = true;

    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar')
        .eq('id', sessionUser.id)
        .single();

      if (isActive) {
        setProfile(data ?? null);
      }
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [sessionUser?.id, supabase]);

  const metadata = sessionUser?.user_metadata as
    | Record<string, string | null | undefined>
    | undefined;
  const metadataName =
    metadata?.full_name ??
    metadata?.name ??
    metadata?.user_name ??
    metadata?.preferred_username ??
    null;
  const metadataAvatar = metadata?.avatar_url ?? metadata?.picture ?? null;
  const displayName = profile?.full_name ?? metadataName ?? sessionUser?.email ?? 'Admin';
  const avatarUrl = profile?.avatar ?? metadataAvatar ?? null;
  const initials = displayName?.charAt(0)?.toUpperCase() ?? 'A';

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setSessionUser(null);
      window.location.href = '/login';
    } catch (error) {
      console.error('[admin-header] logout error', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/vi">
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              Xem trang web
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-3 rounded-full pl-2 pr-4">
                <Avatar className="h-8 w-8">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={displayName ?? 'Admin avatar'} />
                  ) : (
                    <AvatarFallback>{initials}</AvatarFallback>
                  )}
                </Avatar>
                <span className="text-sm font-medium">{displayName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem asChild>
                <Link href="/user/profile">
                  <User className="mr-2 h-4 w-4" />
                  Hồ sơ
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  void handleLogout();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
