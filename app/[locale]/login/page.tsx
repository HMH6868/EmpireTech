'use client';

import type React from 'react';

import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/useTranslations';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
    <path
      fill="#4285F4"
      d="M22.5 12.273c0-.854-.077-1.67-.221-2.455H12v4.64h5.92c-.256 1.38-1.035 2.548-2.2 3.333v2.774h3.555c2.08-1.915 3.225-4.735 3.225-8.292Z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.917 0 5.364-.965 7.152-2.435l-3.555-2.774c-.99.665-2.255 1.06-3.597 1.06-2.768 0-5.111-1.868-5.947-4.384H2.37v2.852C4.149 20.897 7.79 23 12 23Z"
    />
    <path
      fill="#FBBC05"
      d="M6.053 14.467A7.027 7.027 0 0 1 5.684 12c0-.862.149-1.7.37-2.467V6.68H2.37A11.003 11.003 0 0 0 1 12a11 11 0 0 0 1.37 5.32l3.684-2.853Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.958c1.59 0 3.018.547 4.143 1.619l3.102-3.102C17.364 1.64 14.917.5 12 .5 7.79.5 4.149 2.603 2.37 6.68l3.684 2.853C4.889 7.017 7.232 4.958 12 4.958Z"
    />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations('auth');
  const { locale } = useLanguage();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.error || 'Unable to sign in');
      }

      toast({
        title: t('login.toastTitle'),
        description: t('login.toastDescription'),
      });
      router.push(`/${locale}`);
      router.refresh();
    } catch (error) {
      const description = error instanceof Error ? error.message : t('errors.description');
      toast({
        title: t('errors.title'),
        description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isGoogleLoading || isLoading) {
      return;
    }

    try {
      setIsGoogleLoading(true);
      const redirectTo =
        typeof window !== 'undefined' ? `${window.location.origin}/${locale}` : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      const description = error instanceof Error ? error.message : t('errors.description');
      toast({
        title: t('errors.title'),
        description,
        variant: 'destructive',
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md">
            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <LogIn className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="mt-4 text-2xl">{t('login.heading')}</CardTitle>
                <CardDescription>{t('login.subheading')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('fields.emailLabel')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('fields.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">{t('fields.passwordLabel')}</Label>
                      <Link
                        href={`/${locale}/forgot-password`}
                        className="text-sm text-primary hover:underline"
                      >
                        {t('login.forgotPassword')}
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('fields.passwordPlaceholder')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? t('passwordToggle.hide') : t('passwordToggle.show')
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t('login.submitLoading') : t('login.submitIdle')}
                  </Button>
                </form>

                <div className="mt-6 space-y-3">
                  <p className="text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {t('social.title')}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-center gap-2"
                    onClick={handleGoogleLogin}
                    disabled={isLoading || isGoogleLoading}
                  >
                    {isGoogleLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <GoogleIcon className="h-5 w-5" />
                    )}
                    {t('social.google')}
                  </Button>
                </div>

                <div className="mt-6 text-center text-sm">
                  <span className="text-muted-foreground">{t('login.noAccount')} </span>
                  <Link
                    href={`/${locale}/register`}
                    className="font-medium text-primary hover:underline"
                  >
                    {t('login.signupCta')}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
