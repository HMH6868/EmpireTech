'use client';

import { LanguageSwitcher } from '@/components/language-switcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/hooks/use-locale';
import { useTranslations } from '@/hooks/useTranslations';
import { i18nConfig } from '@/i18nConfig';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import {
  Gift,
  GraduationCap,
  LogIn,
  LogOut,
  Menu,
  Settings,
  ShoppingCart,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

type UserProfile = {
  full_name: string | null;
  avatar: string | null;
};

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [sessionUser, setSessionUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const t = useTranslations('common');
  const { locale } = useLanguage();
  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const navLinks = [
    { href: '/', labelKey: 'nav.home' },
    { href: '/accounts', labelKey: 'nav.accounts' },
    { href: '/courses', labelKey: 'nav.courses' },
    { href: '/promotions', labelKey: 'nav.promotions' },
    { href: '/policies', labelKey: 'nav.policies' },
  ] as const;

  const getLocalizedHref = (path: string) => {
    if (!path.startsWith('/')) {
      return path;
    }
    const [pathnamePart, search] = path.split('?');
    const normalized = pathnamePart.replace(/^\/+/, '');
    const localized = normalized ? `/${locale}/${normalized}` : `/${locale}`;
    return search ? `${localized}?${search}` : localized;
  };

  const normalizedPathname = useMemo(() => {
    if (!pathname) return '/';
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0 && i18nConfig.locales.includes(segments[0] as any)) {
      segments.shift();
    }
    return '/' + segments.join('/');
  }, [pathname]);

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
      setIsAdmin(false);
      setCartCount(0);
      return;
    }

    let isActive = true;

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar, role')
        .eq('id', sessionUser.id)
        .single();

      if (error) {
        console.error('[header] profile fetch error', error);
        return;
      }

      if (isActive) {
        setProfile(data ?? null);
        setIsAdmin(data?.role === 'admin');
      }
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [sessionUser?.id, supabase]);

  useEffect(() => {
    if (!sessionUser?.id) {
      setCartCount(0);
      return;
    }

    const fetchCartCount = async () => {
      try {
        const response = await fetch('/api/cart', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Count number of unique items, not total quantity
          const itemCount = data.items?.length || 0;
          setCartCount(itemCount);
        }
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    fetchCartCount();

    // Listen for cart update events
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Refresh cart count every 10 seconds
    const interval = setInterval(fetchCartCount, 10000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [sessionUser?.id]);

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
  const displayName = profile?.full_name ?? metadataName ?? sessionUser?.email ?? 'User';
  const avatarUrl = profile?.avatar ?? metadataAvatar ?? null;
  const initials = displayName?.charAt(0)?.toUpperCase() ?? 'U';
  const isLoggedIn = Boolean(sessionUser);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setSessionUser(null);
    } catch (error) {
      console.error('[header] logout error', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          if (current > lastScrollY.current && current > 120) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
          lastScrollY.current = current;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) setIsVisible(true);
  }, [isOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      lastScrollY.current = window.scrollY;
      setIsVisible(true);
    }
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur transition-transform duration-300 supports-[backdrop-filter]:bg-background/60 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="bg-primary/10 py-2 text-center">
        <Link
          href={getLocalizedHref('/promotions')}
          className="text-xs font-medium hover:underline"
        >
          <Gift className="mr-1 inline-block h-4 w-4" />
          {t('promo.message')}
        </Link>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={getLocalizedHref('/')} className="flex items-center gap-2">
            <div className="relative h-9 w-9">
              <Image
                src="/logo.png"
                alt="Empire Tech logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold tracking-tight">Empire Tech</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-3 px-2 py-1 md:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? normalizedPathname === '/'
                  : normalizedPathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={getLocalizedHref(link.href)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`rounded-full px-3 py-1 text-sm transition-all ${
                    isActive
                      ? 'font-bold text-foreground'
                      : 'font-medium text-foreground/70 hover:text-foreground'
                  }`}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <LanguageSwitcher size="sm" />
            </div>
            {/* Cart */}
            <Link href={getLocalizedHref('/cart')}>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Auth */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="hidden md:flex gap-3 rounded-full pl-2 pr-4">
                    <Avatar className="h-6 w-6">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt={displayName ?? 'User avatar'} />
                      ) : (
                        <AvatarFallback>{initials}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex items-center text-left">
                      <span className="max-w-[140px] truncate text-sm font-medium leading-tight">
                        {displayName}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem asChild>
                    <Link href={getLocalizedHref('/user/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      {t('auth.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={getLocalizedHref('/user/orders')}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {t('auth.orders')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={getLocalizedHref('/user/courses')}>
                      <User className="mr-2 h-4 w-4" />
                      {t('auth.courses')}
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Settings className="mr-2 h-4 w-4" />
                          {locale === 'vi' ? 'Quản trị' : 'Admin Dashboard'}
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onSelect={(event) => {
                      event.preventDefault();
                      void handleLogout();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('auth.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href={getLocalizedHref('/login')} className="hidden sm:block">
                <Button variant="default" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  {t('auth.login')}
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <div className="flex flex-col gap-4 pt-6 px-2">
                  <div className="flex justify-center py-2">
                    <LanguageSwitcher size="md" />
                  </div>

                  <div className="flex flex-col gap-2">
                    {navLinks.map((link) => {
                      const isActive =
                        link.href === '/'
                          ? normalizedPathname === '/'
                          : normalizedPathname?.startsWith(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={getLocalizedHref(link.href)}
                          aria-current={isActive ? 'page' : undefined}
                          onClick={() => setIsOpen(false)}
                        >
                          <Button
                            variant={isActive ? 'secondary' : 'ghost'}
                            className={`w-full justify-start text-base h-12 rounded-xl ${
                              isActive ? 'font-bold' : 'font-medium'
                            }`}
                          >
                            {t(link.labelKey)}
                          </Button>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-2 border-t pt-4">
                    {isLoggedIn ? (
                      <div className="mb-2 flex flex-col gap-3">
                        <div className="flex items-center gap-3 px-2">
                          <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                            {avatarUrl ? (
                              <AvatarImage src={avatarUrl} alt={displayName ?? 'User avatar'} />
                            ) : (
                              <AvatarFallback>{initials}</AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex flex-col overflow-hidden">
                            <span className="truncate font-bold text-lg leading-tight">
                              {displayName}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                              {sessionUser?.email}
                            </span>
                          </div>
                        </div>

                        <div className="grid gap-1">
                          <Link
                            href={getLocalizedHref('/user/profile')}
                            onClick={() => setIsOpen(false)}
                          >
                            <Button variant="outline" className="w-full justify-start gap-3 h-11">
                              <User className="h-4 w-4" />
                              {t('auth.profile')}
                            </Button>
                          </Link>
                          <Link
                            href={getLocalizedHref('/user/orders')}
                            onClick={() => setIsOpen(false)}
                          >
                            <Button variant="outline" className="w-full justify-start gap-3 h-11">
                              <ShoppingCart className="h-4 w-4" />
                              {t('auth.orders')}
                            </Button>
                          </Link>
                          <Link
                            href={getLocalizedHref('/user/courses')}
                            onClick={() => setIsOpen(false)}
                          >
                            <Button variant="outline" className="w-full justify-start gap-3 h-11">
                              <GraduationCap className="h-4 w-4" />
                              {t('auth.courses')}
                            </Button>
                          </Link>
                          {isAdmin && (
                            <Link href="/admin" onClick={() => setIsOpen(false)}>
                              <Button variant="outline" className="w-full justify-start gap-3 h-11">
                                <Settings className="h-4 w-4" />
                                {locale === 'vi' ? 'Quản trị' : 'Admin Dashboard'}
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="outline"
                            className="w-full justify-start gap-3 h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              void handleLogout();
                              setIsOpen(false);
                            }}
                          >
                            <LogOut className="h-4 w-4" />
                            {t('auth.logout')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Link href={getLocalizedHref('/login')} onClick={() => setIsOpen(false)}>
                        <Button className="w-full gap-2" size="lg">
                          <LogIn className="h-5 w-5" />
                          {t('auth.login')}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
