'use client';

import { LanguageSwitcher } from '@/components/language-switcher';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTranslations } from '@/hooks/useTranslations';
import { Gift, LogIn, Menu, ShoppingCart, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [cartCount] = useState(3); // Mock cart count
  const [isLoggedIn] = useState(false); // Mock auth state
  const t = useTranslations('common');
  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const navLinks = [
    { href: '/', labelKey: 'nav.home' },
    { href: '/accounts', labelKey: 'nav.accounts' },
    { href: '/courses', labelKey: 'nav.courses' },
    { href: '/promotions', labelKey: 'nav.promotions' },
    { href: '/policies', labelKey: 'nav.policies' },
  ] as const;

  const activeIndex = useMemo(
    () => navLinks.findIndex((link) => pathname === link.href),
    [pathname],
  );

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
        <Link href="/promotions" className="text-xs font-medium hover:underline">
          <Gift className="mr-1 inline-block h-4 w-4" />
          {t('promo.message')}
        </Link>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-background text-foreground shadow-lg shadow-primary/20 ring-1 ring-primary/30"
                    : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <LanguageSwitcher size="sm" />
            </div>
            {/* Cart */}
            <Link href="/cart">
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
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/user/profile">
                      <User className="mr-2 h-4 w-4" />
                      {t('auth.profile')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user/orders">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {t('auth.orders')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user/courses">
                      <User className="mr-2 h-4 w-4" />
                      {t('auth.courses')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    {t('auth.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="hidden sm:block">
                <Button variant="default" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  {t('auth.login')}
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-4 pt-8 px-4">
                  <div className="mb-2 flex justify-center">
                    <LanguageSwitcher size="md" />
                  </div>
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`rounded-full px-4 py-2 text-base font-medium transition-all ${
                        pathname === link.href
                          ? "bg-primary/10 text-foreground shadow-lg shadow-primary/20 ring-1 ring-primary/30"
                          : "text-foreground/80 hover:text-foreground/90"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {t(link.labelKey)}
                    </Link>
                  ))}
                  <div className="mt-4 border-t pt-4">
                    {!isLoggedIn && (
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button className="w-full gap-2">
                          <LogIn className="h-4 w-4" />
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
