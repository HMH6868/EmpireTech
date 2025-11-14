'use client';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/use-locale';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from '@/hooks/useTranslations';
import { useEffect, useState } from 'react';

export default function UserProfilePage() {
  const { toast } = useToast();
  const t = useTranslations('profile');
  const { locale } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  type ProfileRecord = {
    id?: string;
    full_name?: string | null;
    email?: string | null;
    avatar?: string | null;
    role?: 'admin' | 'user';
    status?: 'active' | 'banned';
    created_at?: string | null;
  };
  const [profile, setProfile] = useState<ProfileRecord | null>(null);

  const [profileData, setProfileData] = useState<{
    name: string;
    email: string;
    phone?: string;
  }>({ name: '', email: '', phone: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/profile`);
        if (!isMounted) return;

        if (response.status === 401) {
          // Not authenticated; show default empty profile
          setProfileData({ name: '', email: '' });
          setIsLoading(false);
          return;
        }

        const result = (await response.json().catch(() => null)) as {
          profile?: ProfileRecord;
          error?: string;
        } | null;

        if (!response.ok || !result) {
          setError(result?.error ?? 'Không thể tải thông tin người dùng.');
          setProfileData({ name: '', email: '' });
        } else {
          const p = result.profile;
          setProfile(p ?? null);
          setProfileData({ name: p?.full_name ?? '', email: p?.email ?? '' });
        }
      } catch (err) {
        setError('Không thể tải thông tin người dùng.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">{t('pageTitle')}</h1>
            <p className="mt-2 text-muted-foreground">{t('subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      {profile?.avatar ? (
                        <img
                          src={profile.avatar}
                          alt={profile.full_name ?? t('labels.avatar')}
                          className="h-24 w-24 rounded-full object-cover"
                        />
                      ) : profileData?.name ? (
                        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border bg-primary text-3xl font-bold text-primary-foreground">
                          {profileData.name
                            .split(' ')
                            .map((s) => s[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                        </div>
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
                          —
                        </div>
                      )}
                    </div>
                    {profile && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        <div>
                          {t('labels.role')}: {t(`roles.${profile.role ?? 'user'}`)}
                        </div>
                        <div>
                          {t('labels.status')}: {t(`statuses.${profile.status ?? 'active'}`)}
                        </div>
                      </div>
                    )}
                    {isLoading ? (
                      <div className="animate-pulse">
                        <div className="h-6 w-40 rounded bg-muted" />
                        <div className="mt-1 h-4 w-56 rounded bg-muted" />
                      </div>
                    ) : error ? (
                      <div className="text-sm text-destructive">{error}</div>
                    ) : (
                      <>
                        <h3 className="font-semibold">{profileData.name}</h3>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">{t('title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <Label className="mb-1 ml-1" htmlFor="name">
                        {t('labels.fullName')}
                      </Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        required
                        disabled
                        readOnly
                      />
                    </div>
                    <div>
                      <Label className="mb-1 ml-1" htmlFor="email">
                        {t('labels.email')}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        required
                        readOnly
                        disabled
                      />
                    </div>
                    <div>
                      <Label className="mb-1 ml-1" htmlFor="date">
                        {t('labels.memberSince')}
                      </Label>
                      <Input
                        id="date"
                        value={
                          profile?.created_at
                            ? new Date(profile.created_at).toLocaleDateString(locale)
                            : ''
                        }
                        readOnly
                        disabled
                      />
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
