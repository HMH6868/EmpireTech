'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/hooks/use-locale';
import { useToast } from '@/hooks/use-toast';
// import { useTranslations } from '@/hooks/useTranslations';
import { Spinner } from '@/components/ui/spinner';
import { type AdminUser } from '@/lib/mock-data';
import { createTranslator, getTranslationDictionary } from '@/lib/translations';
import { Ban, CheckCircle, Eye, MoreHorizontal, Search, Shield, UserMinus } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminUsersPage() {
  const [userList, setUserList] = useState<AdminUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  // Use Vietnamese translations only for this admin page
  const t = createTranslator(getTranslationDictionary('vi' as any, 'admin' as any));
  const tProfile = createTranslator(getTranslationDictionary('vi' as any, 'profile' as any));
  const { locale } = useLanguage();
  const viLocale = 'vi';

  const filteredUsers = userList.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const skeletonRows = [...Array(4)].map((_, index) => (
    <tr key={index} className="border-b border-border last:border-0">
      <td className="py-3">
        <Skeleton className="h-8 w-8 rounded-full" />
      </td>
      <td className="py-3">
        <Skeleton className="h-4 w-40" />
      </td>
      <td className="py-3">
        <Skeleton className="h-4 w-64" />
      </td>
      <td className="py-3">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="py-3">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="py-3">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="py-3 text-right">
        <Skeleton className="h-6 w-6 rounded-full" />
      </td>
    </tr>
  ));

  const userRows = filteredUsers.map((user) => (
    <tr key={user.id} className="border-b border-border last:border-0">
      <td className="py-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : (
              <AvatarFallback>
                {user.name
                  ?.split(' ')
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </td>
      <td className="py-3 text-sm font-medium">{user.name}</td>
      <td className="py-3 text-sm text-muted-foreground">{user.email}</td>
      <td className="py-3">
        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
          {user.role === 'admin' ? (
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              {tProfile('roles.admin')}
            </span>
          ) : (
            tProfile('roles.user')
          )}
        </Badge>
      </td>
      <td className="py-3">
        <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
          {user.status === 'active' ? (
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {tProfile('statuses.active')}
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Ban className="h-3 w-3" />
              {tProfile('statuses.banned')}
            </span>
          )}
        </Badge>
      </td>
      <td className="py-3 text-sm text-muted-foreground">{user.createdAt}</td>
      <td className="py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('users.table.actions')}>
              {updatingUserId === user.id ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <MoreHorizontal className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('users.actions.userActions')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleViewDetails(user)}>
              <Eye className="mr-2 h-4 w-4" />
              {t('users.actions.viewDetails')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>{t('users.actions.changeRole')}</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleChangeRole(user.id, 'admin')}
              disabled={isUpdating || user.role === 'admin'}
            >
              <Shield className="mr-2 h-4 w-4" />
              {t('users.actions.makeAdmin')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleChangeRole(user.id, 'user')}
              disabled={isUpdating || user.role === 'user'}
            >
              <UserMinus className="mr-2 h-4 w-4" />
              {t('users.actions.makeUser')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleToggleStatus(user.id)}
              className={user.status === 'active' ? 'text-destructive' : ''}
              disabled={isUpdating}
            >
              {user.status === 'active' ? (
                <>
                  <Ban className="mr-2 h-4 w-4" />
                  {t('users.actions.banUser')}
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {t('users.actions.unbanUser')}
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  ));

  const handleChangeRole = (userId: string, newRole: 'user' | 'admin') => {
    updateUser(userId, { role: newRole });
  };

  const handleToggleStatus = (userId: string) => {
    const user = userList.find((u) => u.id === userId);
    if (!user) return;
    const newStatus = user.status === 'active' ? 'banned' : 'active';
    updateUser(userId, { status: newStatus });
  };

  const handleViewDetails = (user: AdminUser) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? t('users.messages.fetchError'));
      }
      const data = await res.json();
      const profiles = (data?.profiles ?? []).map(
        (p: any) =>
          ({
            id: p.id,
            name: p.full_name ?? p.email,
            email: p.email,
            avatar: p.avatar ?? null,
            role: p.role,
            status: p.status,
            createdAt: p.created_at ? new Date(p.created_at).toLocaleDateString(viLocale) : '',
          } as AdminUser)
      );
      setUserList(profiles);
    } catch (err: any) {
      toast?.({
        title: t('users.messages.error'),
        description: t('users.messages.fetchError'),
        variant: 'destructive',
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const updateUser = async (userId: string, updates: { role?: string; status?: string }) => {
    setIsUpdating(true);
    setUpdatingUserId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok || !result) {
        throw new Error(result?.error ?? t('users.messages.updateError'));
      }
      const p = result.profile;
      const mapped = {
        id: p.id,
        name: p.full_name ?? p.email,
        email: p.email,
        avatar: p.avatar ?? null,
        role: p.role,
        status: p.status,
        createdAt: p.created_at ? new Date(p.created_at).toLocaleDateString(viLocale) : '',
      } as AdminUser;
      setUserList((prev) => prev.map((u) => (u.id === userId ? mapped : u)));
      toast?.({ title: t('users.messages.success'), description: t('users.messages.userUpdated') });
    } catch (err: any) {
      toast?.({
        title: t('users.messages.error'),
        description: t('users.messages.updateError'),
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
      setUpdatingUserId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('users.title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('users.subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>
              {t('users.allUsers')} ({filteredUsers.length})
            </CardTitle>
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('users.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                disabled={isLoadingUsers}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    {t('users.table.avatar')}
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    {t('users.table.name')}
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    {t('users.table.email')}
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    {t('users.table.role')}
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    {t('users.table.status')}
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                    {t('users.table.created')}
                  </th>
                  <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                    {t('users.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>{isLoadingUsers ? skeletonRows : userRows}</tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('users.dialog.title')}</DialogTitle>
            <DialogDescription>{t('users.dialog.description')}</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">{t('users.table.name')}:</span>
                <span className="col-span-2">{selectedUser.name}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">{t('users.table.email')}:</span>
                <span className="col-span-2">{selectedUser.email}</span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">{t('users.table.role')}:</span>
                <span className="col-span-2">
                  <Badge variant={selectedUser.role === 'admin' ? 'default' : 'secondary'}>
                    {selectedUser?.role === 'admin'
                      ? tProfile('roles.admin')
                      : tProfile('roles.user')}
                  </Badge>
                </span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">{t('users.table.status')}:</span>
                <span className="col-span-2">
                  <Badge variant={selectedUser.status === 'active' ? 'default' : 'destructive'}>
                    {selectedUser?.status === 'active'
                      ? tProfile('statuses.active')
                      : tProfile('statuses.banned')}
                  </Badge>
                </span>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <span className="font-medium">{t('users.table.created')}:</span>
                <span className="col-span-2">{selectedUser.createdAt}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
